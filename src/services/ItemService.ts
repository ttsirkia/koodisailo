import { isDocument } from "@typegoose/typegoose";
import { Course } from "../models/Course";
import { Item } from "../models/Item";
import { ItemModel } from "../models/modelClasses";
import { User } from "../models/User";
import { dbConnect } from "../utils/database";
import { RichSessionData } from "../utils/session";

/**
 * Handles all actions related to the items in database level.
 */
export namespace ItemService {
  // ************************************************************************************************
  export const getAll = async (user: User, course: Course) => {
    return await ItemModel.find({ user: user._id, course: course._id }).select("-content").sort({ createdAt: -1 });
  };

  // ************************************************************************************************
  export const find = async (id: string) => {
    await dbConnect();
    return await ItemModel.findById(id).populate("user").populate("course");
  };

  // ************************************************************************************************
  export const findByFilename = async (filename: string, user: User, course: Course) => {
    await dbConnect();
    return await ItemModel.findOne({ title: filename, user: user.id, course: course })
      .populate("user")
      .populate("course");
  };

  // ************************************************************************************************
  export const remove = async (id: string) => {
    await dbConnect();
    const item = await find(id);
    if (item) {
      await item.remove();
    } else {
      throw "Not found";
    }
  };

  // ************************************************************************************************
  export const getTotalSize = async (user: User) => {
    await dbConnect();
    const items = await ItemModel.find({ user: user.id }).select("size");
    return items.reduce((prev, cur) => prev + cur.size, 0);
  };

  // ************************************************************************************************
  export const createOrUpdate = async (item: Partial<Item>) => {
    await dbConnect();
    if (item.id) {
      return await ItemModel.findOneAndUpdate({ _id: item.id }, { $set: { ...item } }, { runValidators: true });
    } else {
      return await ItemModel.create(item);
    }
  };

  // ************************************************************************************************
  export const hasPermission = (item: Item, richSessionData: RichSessionData, readOnly: boolean) => {
    if (!isDocument(item.user) || !isDocument(item.course)) {
      return false;
    }

    if (item.public && readOnly) {
      // Item is public
      return true;
    } else if (richSessionData.user && item.user.id === richSessionData.user.id) {
      // Item is owned by the user
      return true;
    } else if (
      // User is staff member and has read access to this course (stored in session)
      item.course &&
      richSessionData.course &&
      richSessionData.staffPermissionIn[item.course.id] === true &&
      readOnly
    ) {
      return true;
    }
    return false;
  };

  // ************************************************************************************************
  export const cleanExpiredItems = async () => {
    await ItemModel.deleteMany({ expires: { $lte: Date.now() } });
  };
}
