const SkeletonPost = () => (
    <div className="flex flex-col w-full animate-pulse">
        <div className="pt-4 pb-2 px-2 flex w-full gap-x-1">
            {/* PFP */}
            <div className="flex justify-center" style={{ minWidth: 50 }}>
                <div className="w-[37px] h-[37px] rounded-full bg-gray-200" />
            </div>
            <div className="flex flex-col w-full gap-y-1">
                <div className="flex w-full flex-col">
                    {/* Name row */}
                    <div className="flex w-full gap-x-1 items-center">
                        <div className="h-3 w-20 rounded-full bg-gray-200" />
                        <div className="h-3 w-16 rounded-full bg-gray-200" />
                        <div className="h-3 w-2 rounded-full bg-gray-200" />
                        <div className="h-3 w-8 rounded-full bg-gray-200" />
                    </div>
                    {/* Title - matches text-lg font-semibold */}
                    <div className="h-5 w-2/3 rounded-full bg-gray-200 mt-1" />
                </div>
                {/* Content - matches text-lg */}
                <div className="h-4 w-full rounded-full bg-gray-200" />
                <div className="h-4 w-5/6 rounded-full bg-gray-200" />
                <div className="h-4 w-1/2 rounded-full bg-gray-200" />
            </div>
        </div>
        {/* Action row - matches px-[60px] pt-2 */}
        <div className="flex items-center gap-x-2 px-[60px] pt-2 pb-2">
            <div className="h-8 w-16 rounded-lg bg-gray-200" />
            <div className="h-8 w-16 rounded-lg bg-gray-200" />
            <div className="h-8 w-16 rounded-lg bg-gray-200" />
        </div>
    </div>
);

export default SkeletonPost;