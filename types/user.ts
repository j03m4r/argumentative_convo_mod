import { Timestamp } from "firebase/firestore";

export type UserData = {
  hasCompletedInitialRatings: boolean;
  initialRatings: number[];
  disagreePostIdx: number;
  auxPostIdx1: number;
  auxPostIdx2: number;
  comment: string;
  randomPostOrder: string[];
  initialResponse: string;
  revisedResponse: string;
  conversation: string[];
  finishedModeration: boolean;
  hasUpvoted: boolean|null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
