import { getModelForClass } from "@typegoose/typegoose";
import { Course } from "./Course";
import { Item } from "./Item";
import { LTI13Conf } from "./LTI13Conf";
import { LTIConf } from "./LTIConf";
import { User } from "./User";

export const CourseModel = getModelForClass(Course);
export const ItemModel = getModelForClass(Item);
export const UserModel = getModelForClass(User);
export const LTIConfModel = getModelForClass(LTIConf);
export const LTI13ConfModel = getModelForClass(LTI13Conf);
