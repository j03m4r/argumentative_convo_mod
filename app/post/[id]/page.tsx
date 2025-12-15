import { artificial_intelligence_posts, posts, vaccine_posts } from "@/lib/experiment_materials/posts";
import PageContent from "./components/PageContent";

export default async function PostPage({
    params
}: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    const postType = id.split("-")[0]
    const postIdx = Number(id.split("-")[1])
    const post = postType==="ai" ? artificial_intelligence_posts[postIdx] : postType==="vaccine" ? vaccine_posts[postIdx] : posts[postIdx]

    return (
        <PageContent post={post} />
    )
}

