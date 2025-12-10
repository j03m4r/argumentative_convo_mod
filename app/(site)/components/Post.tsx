"use client"

import { useState, type FC } from 'react';
import { Post as P } from "@/lib/experiment_materials/posts";
import Image from 'next/image';
import ReplyInput from './ReplyInput';

interface PostProps {
    post: P;
    isDisagreePost?: boolean;
    handleInitialReply?: (initialReply: string) => void;
    initialReply?: string;
}

const Post: FC<PostProps> = ({ post, isDisagreePost, handleInitialReply, initialReply }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [upVoteVal] = useState(Math.floor(Math.random() * 100))
    const [downVoteVal] = useState(Math.floor(Math.random() * 100))
    const [commentVal] = useState(Math.floor(Math.random() * 100))

    const handleReply = (reply: string) => {
        if (handleInitialReply) {
            handleInitialReply(reply);
        }
    }

    return isDisagreePost ? (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className="flex w-full gap-x-1 p-2 border-b border-black">
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
                            <h2 className="hover:underline cursor-pointer text-blood-orange text-sm">{post.user.name}</h2>
                            <h2 className="text-sm ml-1 font-light">@{post.user.name}</h2>
                            <p className='font-light'>•</p>
                            <p className='text-sm font-light'>{post.timestamp}</p>
                        </div>
                        <h2 className='font-semibold'>{post.title}</h2>
                    </div>
                    <p>{post.content}</p>
                </div>
            </div>

            <div className='w-full flex justify-center items-center border-b border-black'>
                <div className='flex items-center justify-center w-full'>
                    <div className="w-full flex items-center justify-center gap-x-1 border-r border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                        0
                    </div>
                    <div className="w-full flex items-center justify-center gap-x-1 border-r border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className='rotate-180 fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                        0
                    </div>
                </div>
                <div className="h-full text-sm flex items-center justify-center gap-x-1 border-r border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z"/></svg>
                    0
                </div>
                <div className="flex items-center justify-center gap-x-1 px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z" /></svg>
                    Share
                </div>
            </div>

            <ReplyInput 
                post={post} 
                handleReply={handleReply}
                initialReply={initialReply}
                userPfp="/images/avatar_mosaic.png"
            />
        </div>

    ) : (
        <div onClick={() => setIsClicked((prev) => !prev)} className="flex w-full gap-x-1 pt-2 px-2 border-b border-black cursor-pointer">
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
                        <h2 className="hover:underline cursor-pointer text-blood-orange text-sm">{post.user.name}</h2>
                        <h2 className="text-sm ml-1 font-light">@{post.user.name}</h2>
                        <p className='font-light'>•</p>
                        <p className='text-sm font-light'>{post.timestamp}</p>
                    </div>
                    <h2 className='font-semibold hover:underline'>{post.title}</h2>
                </div>
                <p className={isClicked ? "" : "line-clamp-10"}>{post.content}</p>
                <div className='w-full flex justify-between items-center mt-2'>
                    <div className='flex items-center justify-center'>
                        <div className="text-sm flex items-center justify-center gap-x-1 border-x border-t border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out">
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                            {upVoteVal}
                        </div>
                        <div className="text-sm flex items-center justify-center gap-x-1 border-r border-t border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out">
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='rotate-180 fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                            {downVoteVal}
                        </div>
                        <div className="text-sm flex items-center justify-center gap-x-1 border-r border-t border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out">
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z"/></svg>
                            {commentVal}
                        </div>
                    </div>
                    <div className="text-sm flex items-center justify-center gap-x-1 border-x border-t border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z" /></svg>
                        Share
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Post;
