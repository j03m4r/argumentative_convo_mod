"use client"
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { FC } from 'react';
import { Post } from '@/lib/experiment_materials/posts';
import { addConversationMessage } from '@/lib/firebase/firestore';
import { Tooltip } from 'react-tooltip'

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

interface ChatMessagesProps {
    userPfp: string;
    savedMessages?: Message[];
}

const ChatMessages: FC<ChatMessagesProps> = ({ 
    userPfp, 
    savedMessages = []
}) => {
    const [messages, setMessages] = useState<Message[]>(savedMessages);

    return (
        <div className="flex-1 overflow-y-scroll px-4 py-4 space-y-4">
            {messages.map((message) => (
                message.role !== 'system' && (
                    <div key={message.id} className={`flex gap-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'assistant' && (
                            <div className='shrink-0'>
                                <div className="w-10 h-10 rounded-full bg-blood-orange flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} className='fill-cream' viewBox="0 0 640 640"><path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 128L192 128C139 128 96 171 96 224L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 224C544 171 501 128 448 128L352 128L352 64zM160 432C160 418.7 170.7 408 184 408L216 408C229.3 408 240 418.7 240 432C240 445.3 229.3 456 216 456L184 456C170.7 456 160 445.3 160 432zM280 432C280 418.7 290.7 408 304 408L336 408C349.3 408 360 418.7 360 432C360 445.3 349.3 456 336 456L304 456C290.7 456 280 445.3 280 432zM400 432C400 418.7 410.7 408 424 408L456 408C469.3 408 480 418.7 480 432C480 445.3 469.3 456 456 456L424 456C410.7 456 400 445.3 400 432zM224 240C250.5 240 272 261.5 272 288C272 314.5 250.5 336 224 336C197.5 336 176 314.5 176 288C176 261.5 197.5 240 224 240zM368 288C368 261.5 389.5 240 416 240C442.5 240 464 261.5 464 288C464 314.5 442.5 336 416 336C389.5 336 368 314.5 368 288zM64 288C64 270.3 49.7 256 32 256C14.3 256 0 270.3 0 288L0 384C0 401.7 14.3 416 32 416C49.7 416 64 401.7 64 384L64 288zM608 256C590.3 256 576 270.3 576 288L576 384C576 401.7 590.3 416 608 416C625.7 416 640 401.7 640 384L640 288C640 270.3 625.7 256 608 256z"/></svg>
                                </div>
                            </div>
                        )}

                        <div className={`flex flex-col max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-3 rounded-lg ${message.role === 'user'
                                ? 'bg-blood-orange text-cream'
                                : 'bg-gray-100 text-black border border-gray-200'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {message.content}
                                </p>
                            </div>
                            <span className="text-sm text-gray-400 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        {message.role === 'user' && (
                            <div className='shrink-0'>
                                <Image
                                    src={userPfp}
                                    width={40}
                                    height={40}
                                    alt="Your profile"
                                    className="w-10 h-10 rounded-full"
                                />
                            </div>
                        )}
                    </div>
                )
            ))}
        </div>
    );
}

export default ChatMessages;
