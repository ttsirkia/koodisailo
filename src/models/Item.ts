import type { Ref } from "@typegoose/typegoose";
import { defaultClasses, plugin, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
const findorcreate = require("mongoose-findorcreate");

import { Course } from "./Course";
import { User } from "./User";

// ************************************************************************************************

export type ItemDTO = {
  title: string;
  id: any;
  binary: boolean;
  file: boolean;
  createdAt: number;
  size: number;
  public: boolean;
  isExpiringSoon: boolean;
};

// ************************************************************************************************

@plugin(findorcreate)
export class Item extends defaultClasses.FindOrCreate implements Base {
  public _id!: Types.ObjectId;
  public id!: string;

  @prop({ required: true })
  public title!: string;

  // This is stored as Base64 encoded string
  @prop({ required: true })
  public content!: string;

  @prop({ ref: () => User, index: true })
  public user!: Ref<User>;

  @prop({ required: true, default: Date.now })
  public createdAt!: number;

  @prop({ required: true, default: Date.now, index: true })
  public expires!: number;

  // in bytes
  @prop({ required: true })
  public size!: number;

  @prop({ required: true, ref: () => Course })
  public course!: Ref<Course>;

  @prop({ required: true, default: false })
  public public!: boolean;

  @prop({ required: true, default: false })
  public file!: boolean;

  @prop({ required: true, default: false })
  public binary!: boolean;

  // ************************************************************************************************

  public convertItemToDTO(this: Item): ItemDTO {
    return {
      title: this.title,
      id: this.id,
      binary: this.binary,
      file: this.file,
      createdAt: this.createdAt,
      size: this.size,
      public: this.public,
      isExpiringSoon: this.expires - Date.now() < 1000 * 60 * 60 * 24, // less than 24 hours
    };
  }
}
