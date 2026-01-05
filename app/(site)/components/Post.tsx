"use client"

import { useState, type FC } from 'react';
import { Post as P } from "@/lib/experiment_materials/posts";
import Image from 'next/image';
import Link from 'next/link';

interface PostProps {
    post: P;
    postType: string;
    postIdx: number;
    randIdx: number;
}

const Post: FC<PostProps> = ({ postType, postIdx, post, randIdx }) => {
    const [upVoteVal] = useState(Math.floor(Math.random() * 100))
    const [downVoteVal] = useState(Math.floor(Math.random() * 100))
    const [commentVal] = useState(Math.floor(Math.random() * 100))
    const isReplyPost = postType==="p"

    return isReplyPost ? (
        <Link href={`post/${postType}-${postIdx}`} className="hover:bg-blood-orange/5 rounded-xl group flex w-full gap-x-1 pt-4 pb-2 px-2 cursor-pointer" data-tooltip-id="replyPost" data-tooltip-content="The post you will reply to" data-tooltip-place={randIdx===0 ? "bottom-end" : "right"}>
            <div className="flex justify-center">
                <Image
                    src={post.user.pfp_src}
                    width={50}
                    height={50}
                    alt="Wave profile picture"
                    className="w-3/4 h-fit rounded-full"
                />
            </div>
            <div className="flex flex-col w-full gap-y-1">
                <div className="flex w-full flex-col">
                    <div className="flex w-full gap-x-1 items-center">
                        <h2 className="cursor-not-allowed text-blood-orange text-sm">{post.user.name}</h2>
                        <h2 className="text-sm ml-1 font-light">@{post.user.name}</h2>
                        <p className='font-light'>•</p>
                        <p className='text-sm font-light'>{post.timestamp}</p>
                    </div>
                    <h2 className='font-semibold group-hover:underline'>{post.title}</h2>
                </div>
                <p>{post.content}</p>
                <div className='w-full flex justify-between items-center'>
                    <div className="flex items-center justify-center gap-x-8 py-2">
                        <div className={`text-sm flex items-center justify-center gap-x-1`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                            0
                        </div>
                        <div className={`text-sm flex items-center justify-center gap-x-1`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='rotate-180 fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                            0
                        </div>
                        <div className={`text-sm flex items-center justify-center gap-x-1`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z"/></svg>
                            0
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    ) : (
        <div className="cursor-not-allowed group flex w-full gap-x-1 pt-4 pb-2 px-2">
            <div className="flex justify-center">
                <Image
                    src={post.user.pfp_src}
                    width={50}
                    height={50}
                    alt="Wave profile picture"
                    className="w-3/4 h-fit rounded-full"
                />
            </div>
            <div className="flex flex-col w-full gap-y-1">
                <div className="flex w-full flex-col">
                    <div className="flex w-full gap-x-1 items-center">
                        <h2 className="cursor-not-allowed text-blood-orange text-sm">{post.user.name}</h2>
                        <h2 className="text-sm ml-1 font-light">@{post.user.name}</h2>
                        <p className='font-light'>•</p>
                        <p className='text-sm font-light'>{post.timestamp}</p>
                    </div>
                    <h2 className='font-semibold'>{post.title}</h2>
                </div>
                <p>{post.content}</p>
                <div className='w-full flex justify-between items-center'>
                    <div className="flex items-center justify-center gap-x-8 py-2">
                        <div className={`text-sm flex items-center justify-center gap-x-1`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                            {upVoteVal}
                        </div>
                        <div className={`text-sm flex items-center justify-center gap-x-1`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='rotate-180 fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                            {downVoteVal}
                        </div>
                        <div className={`text-sm flex items-center justify-center gap-x-1`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z"/></svg>
                            {commentVal}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Post;
