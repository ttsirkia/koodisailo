import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CourseService } from "../../../services/CourseService";
import { createRouter } from "../context";

export const settingsRouter = createRouter()
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

    // Teacher role is required for all actions in this API
    if (!ctx.richSession.isTeacher) {
      throw new TRPCError({ code: "FORBIDDEN" });
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
  .query("getCourseSettings", {
    async resolve({ ctx }) {
      return ctx.course.convertCourseToDTO();
    },
  })
  // ************************************************************************************************
  .mutation("saveSettings", {
    input: z.object({
      name: z.string().min(1),
      combined: z.string().trim().optional(),
      language: z.string(),
      defaultUILanguage: z.string(),
      expireTime: z.number().min(1).max(365),
      totalSizeLimitKb: z.number().min(1).max(2048),
    }),
    async resolve({ input, ctx }) {
      const courseObj = { ...input, id: ctx.course.id };
      const result = await CourseService.update(courseObj);
      if (!result) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return true;
    },
  });
