import { TRPCError } from "@trpc/server";
import { isDocument } from "@typegoose/typegoose";
import { Base64 } from "js-base64";
import { z } from "zod";
import { Item, ItemDTO } from "../../../models/Item";
import { ItemService } from "../../../services/ItemService";
import { getSession } from "../../../utils/session";
import { createRouter } from "../context";

// ************************************************************************************************

export const itemRouter = createRouter()
  // ************************************************************************************************
  .query("getItem", {
    // This is before the middleware to allow reading public pastes without a proper session
    input: z.object({ id: z.string(), readOnly: z.boolean() }),
    async resolve({ input, ctx }) {
      if (ctx.req && ctx.res) {
        const [session, richSession] = await getSession(ctx.req, ctx.res);

        const item = await ItemService.find(input.id);
        if (item) {
          // Permissions to see the code is checked here
          if (ItemService.hasPermission(item, richSession, input.readOnly)) {
            return {
              id: item.id,
              title: item.title,
              content: item.content,
              public: item.public,
              isOwn: session.userId === item.user?.id,
              userName: isDocument(item.user) ? item.user.fullName : "?",
              courseName: isDocument(item.course) ? item.course.name : "?",
              file: item.file,
              binary: item.binary,
              createdAt: item.createdAt.valueOf(),
              size: item.size,
              language: isDocument(item.course) ? item.course.language : "",
            };
          } else {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
        } else {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    },
  })
  // ************************************************************************************************
  .middleware(async ({ ctx, next }) => {
    if (
      !ctx.richSession?.user ||
      !ctx.richSession?.course ||
      !ctx.session ||
      ctx.req?.headers["authorization"] !== ctx.session.id
    ) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        richSession: ctx.richSession,
        session: ctx.session,
        user: ctx.richSession.user,
        course: ctx.richSession.course,
      },
    });
  })
  // ************************************************************************************************
  .query("getAll", {
    async resolve({ ctx }) {
      // This returns all metadata of the items but not the actual content
      const items = await ItemService.getAll(ctx.user, ctx.course);
      const totalSize = await ItemService.getTotalSize(ctx.user);
      const result = {
        totalSize,
        totalSizeLimit: ctx.course.totalSizeLimitKb,
        expireTime: ctx.course.expireTime,
        items: [] as ItemDTO[],
      };
      if (items) {
        result.items = items.map((x) => x.convertItemToDTO());
      }
      return result;
    },
  })
  // ************************************************************************************************
  .mutation("createOrUpdate", {
    input: z.object({
      title: z.string().nullish(),
      content: z.string(),
      file: z.boolean(),
      public: z.boolean(),
      id: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      const totalSize = await ItemService.getTotalSize(ctx.user);

      const decoded = Base64.toUint8Array(input.content);

      // Try if this is a text or a binary file
      const decoder = new TextDecoder("utf-8", { fatal: true });
      let isBinary = false;
      try {
        decoder.decode(decoded);
      } catch (e) {
        isBinary = true;
      }

      const newItem: Partial<Item> = {
        user: ctx.user,
        course: ctx.course,
        title: input.title || "?",
        content: input.content,
        public: input.public && ctx.richSession.isStaff,
        file: input.file,
        binary: isBinary,
        size: decoded.length,
        createdAt: Date.now(),
        expires: Date.now() + 1000 * 60 * 60 * 24 * ctx.course.expireTime,
      };

      let item: Item | null = null;
      if (input.id) {
        // Replacing an existing item by using id
        item = await ItemService.find(input.id);
        if (item) {
          if (!ItemService.hasPermission(item, ctx.richSession, true)) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
          newItem.id = input.id;
        }
      } else if (input.file) {
        // Check if an item with the same file name already exists
        item = await ItemService.findByFilename(input.title ?? "?", ctx.user, ctx.course);
        if (item) {
          newItem.id = item.id;
        }
      }

      // Is quota exceeded?
      if (!newItem.id && totalSize + decoded.length > ctx.course.totalSizeLimitKb * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE" });
      } else if (newItem.id && item && totalSize + decoded.length - item.size > ctx.course.totalSizeLimitKb * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE" });
      }

      const addedItem = await ItemService.createOrUpdate(newItem);
      return { id: addedItem?.id };
    },
  })
  // ************************************************************************************************
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    async resolve({ input, ctx }) {
      const item = await ItemService.find(input.id);
      if (item && ItemService.hasPermission(item, ctx.richSession, false)) {
        await ItemService.remove(input.id);
        return { result: "OK" };
      } else {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    },
  });
