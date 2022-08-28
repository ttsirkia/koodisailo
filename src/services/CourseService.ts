import { Course } from "../models/Course";
import { CourseModel } from "../models/modelClasses";
import { User } from "../models/User";
import { dbConnect } from "../utils/database";

/**
 * Handles all actions related to the course in database level.
 */
export namespace CourseService {
  // ************************************************************************************************
  export const findById = async (id: string) => {
    await dbConnect();
    return await CourseModel.findById(id);
  };

  // ************************************************************************************************
  export const findByCourseId = async (id: string) => {
    await dbConnect();
    return await CourseModel.findOne({ courseId: id });
  };

  // ************************************************************************************************
  export const findOrCreate = async (name: string, courseId: string, user: User) => {
    await dbConnect();
    const result = await CourseModel.findOrCreate({ courseId }, { name, courseId, createdBy: user._id });
    return result;
  };

  // ************************************************************************************************
  export const create = async (course: Partial<Course>) => {
    await dbConnect();
    return await CourseModel.create(course);
  };

  // ************************************************************************************************
  export const update = async (course: Partial<Course>) => {
    await dbConnect();
    const result = await CourseModel.updateOne({ _id: course.id }, { $set: { ...course } }, { runValidators: true });
    return result.matchedCount > 0;
  };
}
