import { defaultClasses, plugin, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
const findorcreate = require("mongoose-findorcreate");

// ************************************************************************************************

export class Name {
  @prop()
  public first?: string;
  @prop()
  public last?: string;
}

// ************************************************************************************************

@plugin(findorcreate)
export class User extends defaultClasses.FindOrCreate implements Base {
  public _id!: Types.ObjectId;
  public id!: string;

  @prop({ _id: false })
  public name!: Name;

  @prop()
  public email!: string;

  @prop({ index: true })
  public ltiId!: string;

  // ************************************************************************************************
  public get fullName() {
    return `${this.name.first} ${this.name.last}`;
  }
}
