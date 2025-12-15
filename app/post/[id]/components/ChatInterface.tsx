"use client"
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { FC } from 'react';
import { Post } from '@/lib/experiment_materials/posts';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    userPfp: string;
    initialSystemPrompt?: string;
    post: Post | null;
    initialReply: string;
    handleFinishModeration: (messages: string[]) => void;
}

const ChatInterface: FC<ChatInterfaceProps> = ({ userPfp, initialSystemPrompt, post, initialReply, handleFinishModeration }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize with system prompt
    useEffect(() => {
        if (initialSystemPrompt && messages.length === 0) {
            initializeChat();
        }
    }, [initialSystemPrompt]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const callOpenRouter = async (messages: Message[]): Promise<string> => {
        const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

        if (!apiKey) {
            throw new Error('OpenRouter API key not found');
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Y Discussion'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-sonnet-4',
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response received';
    };

    const initializeChat = async () => {
        if (!initialSystemPrompt || !post) return;

        setIsLoading(true);
        try {
            const systemMessage: Message = {
                id: 'system',
                role: 'system',
                content: initialSystemPrompt.replaceAll("{{post_title}}", post.title).replaceAll("{{post_content}}", post.content).replaceAll("{{responders_message}}", initialReply),
                timestamp: new Date()
            };

            const response = await callOpenRouter([systemMessage]);

            const assistantMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages([systemMessage, assistantMessage]);
        } catch (error) {
            console.error('Error initializing chat:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await callOpenRouter(updatedMessages);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages([...updatedMessages, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            };
            setMessages([...updatedMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen w-full">
            <div className='flex w-full border-b border-black'>
                <div className='p-4 flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width={48} className='fill-blood-orange' viewBox="0 0 640 640"><path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z" /></svg>
                </div>
                <div className="flex flex-col py-4 w-full">
                    <h1 className="text-xl font-bold text-blood-orange">
                        Hold on...
                    </h1>
                    <h2 className="text-lg">
                        Before you post your response to this discussion forum, we would like to have a conversation with you.
                    </h2>
                </div>
            </div>
            <div className="flex-1 overflow-y-scroll px-4 py-4 space-y-4">
                {messages.map((message) => (
                    message.role !== 'system' && (
                        <div key={message.id} className={`flex gap-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.role === 'assistant' && (
                                <div className='shrink-0'>
                                    <div className="w-10 h-10 rounded-full bg-blood-orange flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} className='fill-cream' viewBox="0 0 640 640">
                                            <path d="M320 64C241.3 64 176 129.3 176 208C176 286.7 241.3 352 320 352C398.7 352 464 286.7 464 208C464 129.3 398.7 64 320 64zM176 432C114.1 432 64 482.1 64 544C64 561.7 78.3 576 96 576L544 576C561.7 576 576 561.7 576 544C576 482.1 525.9 432 464 432L176 432z" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            <div className={`flex flex-col max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-3 rounded-lg ${message.role === 'user'
                                    ? 'bg-blood-orange text-cream'
                                    : 'bg-gray-100 text-black border border-gray-200'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
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

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex gap-x-3 justify-start">
                        <div className='shrink-0'>
                            <div className="w-10 h-10 rounded-full bg-blood-orange flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width={20} className='fill-cream' viewBox="0 0 640 640">
                                    <path d="M320 64C241.3 64 176 129.3 176 208C176 286.7 241.3 352 320 352C398.7 352 464 286.7 464 208C464 129.3 398.7 64 320 64zM176 432C114.1 432 64 482.1 64 544C64 561.7 78.3 576 96 576L544 576C561.7 576 576 561.7 576 544C576 482.1 525.9 432 464 432L176 432z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg flex justify-center items-center px-4 border border-gray-200">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed height at bottom */}
            {
                messages.length >= 8 ? (
                    <button onClick={() => handleFinishModeration(messages.map((message) => message.content))} className='flex w-full border-t p-8 font-bold cursor-pointer justify-center items-center border-black transition-all duration-200 ease-in-out bg-blood-orange text-cream hover:bg-cream hover:text-blood-orange'>
                        Finish Chatting
                    </button >
                ) : (
                    <div className='flex w-full border-t border-black pt-4 px-4 gap-x-3'>
                        <div className='shrink-0'>
                            <Image
                                src={userPfp}
                                width={40}
                                height={40}
                                alt="Your profile picture"
                                className="w-10 h-10 rounded-full"
                            />
                        </div>

                        <div className='flex-1 flex flex-col'>
                            <p className='text-sm text-gray-500 mb-2'>
                                Chatting with <span className='text-blood-orange'>AI Moderator</span>
                            </p>

                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder='Type your message'
                                disabled={isLoading}
                                className='w-full resize-none outline-none text-lg min-h-[60px] max-h-[200px] overflow-y-auto placeholder:text-gray-400 disabled:opacity-50'
                                rows={1}
                            />

                            {(isFocused || input.length > 0) && (
                                <div className='flex items-center justify-between pt-2'>
                                    <span className='text-xs text-gray-400'>Press Enter to send, Shift+Enter for new line</span>
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className='flex gap-x-1 px-4 py-2 border-x border-t border-black cursor-pointer 
                                     disabled:opacity-50 disabled:cursor-not-allowed 
                                     transition-all duration-200 hover:text-blood-orange disabled:hover:text-black'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} className='fill-current' viewBox="0 0 512 512">
                                            <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                                        </svg>
                                        Send
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default ChatInterface;
