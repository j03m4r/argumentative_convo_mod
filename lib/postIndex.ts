import { posts } from "@/lib/experiment_materials/posts";

// Index into postVotes / postComments. Aux posts are stored after all opinion posts.
export function storageIdx(postType: string, postIdx: number) {
    return postType === "aux" ? postIdx + posts.length : postIdx;
}
