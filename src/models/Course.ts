import { defaultClasses, plugin, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
const findorcreate = require("mongoose-findorcreate");

// ************************************************************************************************

export type CourseDTO = {
  name: string;
  courseId: string;
  combined: string;
  language: string;
  defaultUILanguage: string;
  expireTime: number;
  totalSizeLimitKb: number;
};

// ************************************************************************************************

@plugin(findorcreate)
export class Course extends defaultClasses.FindOrCreate implements Base {
  public _id!: Types.ObjectId;
  public id!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, index: true })
  public courseId!: string;

  @prop()
  public combined?: string;

  @prop()
  public language?: string;

  @prop()
  public defaultUILanguage?: string;

  // in days
  @prop({ required: true, default: 7, min: 1, max: 365 })
  public expireTime!: number;

  @prop({ required: true, default: 500, min: 1, max: 2048 })
  public totalSizeLimitKb!: number;

  // ************************************************************************************************

  public convertCourseToDTO(this: Course): CourseDTO {
    return {
      name: this.name,
      courseId: this.courseId,
      combined: this.combined ?? "",
      language: this.language ?? "",
      expireTime: this.expireTime,
      totalSizeLimitKb: this.totalSizeLimitKb,
      defaultUILanguage: this.defaultUILanguage || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "en",
    };
  }
}
