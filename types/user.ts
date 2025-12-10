import { Timestamp } from "firebase/firestore";

export type UserData = {
  hasCompletedInitialRatings: boolean;
  initialRatings: number[];
  disagreePostIdx: number;
  auxPostIdx1: number;
  auxPostIdx2: number;
  initialResponse: string;
  revisedResponse: string;
  conversation: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
