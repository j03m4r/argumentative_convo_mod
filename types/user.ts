import { Timestamp } from "firebase/firestore";

export interface PostKey {
  type: string;
  idx: number;
}

export type UserData = {
  hasCompletedInitialRatings: boolean;
  initialRatings: number[];
  disagreePostIdx: number;
  disagreePage: PostKey[];
  agreePage: PostKey[];
  respondPage: PostKey[];
  postVotes: number[];
  postComments: Record<string, string[]>;
  page2StartedAt: Timestamp|null,
  page3StartedAt: Timestamp|null,
  comment: string;
  initialResponse: string;
  revisedResponse: string;
  conversation: string[];
  finishedModeration: boolean;
  hasUpvoted: boolean|null;
  argumentationType: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
