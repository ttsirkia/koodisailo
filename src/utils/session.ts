import { NextApiRequest, NextApiResponse } from "next";
import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";

import MongoStore from "connect-mongo";
import { Session } from "next-session/lib/types";
import { Course } from "../models/Course";
import { User } from "../models/User";
import { CourseService } from "../services/CourseService";
import { UserService } from "../services/UserService";
import { dbConnect, getMongoClientPromise } from "../utils/database";

export type Role = "student" | "staff" | "teacher";

export type SessionData = {
  courseId?: string;
  userId?: string;
  language: string;
  role: Role;
  staffPermissionIn: Record<string, boolean>;
};

export type RichSessionData = {
  course?: Course | null;
  user?: User | null;
  isTeacher: boolean;
  isStaff: boolean;
  staffPermissionIn: Record<string, boolean>;
};

// ************************************************************************************************
// For back-end

const mongoStore = MongoStore.create({ clientPromise: getMongoClientPromise() });
const session = nextSession<SessionData>({
  store: promisifyStore(mongoStore),
  name: "koodisailo_sid",
  touchAfter: 60 * 60,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * +(process.env.SESSION_LIFETIME_DAYS || 30),
  },
});

export const getSession = async function (req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const curSession = await session(req, res);

  const richSession: RichSessionData = {
    isTeacher: curSession.role === "teacher",
    isStaff: curSession.role === "staff" || curSession.role === "teacher",
    staffPermissionIn: curSession.staffPermissionIn || {},
  };

  if (curSession.courseId) {
    richSession.course = await CourseService.findById(curSession.courseId);
  }

  if (curSession.userId) {
    richSession.user = await UserService.find(curSession.userId);
  }

  // Session is the persisted session object, RichSessionData contains
  // populated data from database such as the course and used objects
  return [curSession, richSession] as [Session<SessionData>, RichSessionData];
};
