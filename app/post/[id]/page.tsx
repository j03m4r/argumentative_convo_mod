import { artificial_intelligence_posts, posts, vaccine_posts } from "@/lib/experiment_materials/posts";
import PageContent from "./components/PageContent";

export default async function PostPage({
    params
}: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    const splitParams = id.split("-")
    const postType = splitParams[0]
    const postIdx = Number(splitParams[1])
    const post = postType==="aux" ? (postIdx >= 4 ? vaccine_posts[postIdx-4] : artificial_intelligence_posts[postIdx]) : posts[postIdx]
    const upVoteVal = Number(splitParams[2])
    const downVoteVal = Number(splitParams[3])
    const commentVal = Number(splitParams[4])

    return (
        <PageContent post={post} postIdx={postIdx} postType={postType} upVoteVal={upVoteVal} downVoteVal={downVoteVal} commentVal={commentVal} />
    )
}

