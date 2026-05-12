const SkeletonComment = () => (
    <div className="flex w-full gap-x-1 animate-pulse">
        {/* PFP - matches w-3/4 h-fit rounded-full inside flex justify-center */}
        <div className="flex justify-center" style={{ minWidth: 50 }}>
            <div className="w-[37px] h-[37px] rounded-full bg-gray-200" />
        </div>
        <div className="flex flex-col w-full gap-y-1">
            <div className="flex w-full flex-col">
                <div className="flex w-full gap-x-1 items-center">
                    {/* text-blood-orange name */}
                    <div className="h-3 w-20 rounded-full bg-gray-200" />
                    {/* @handle */}
                    <div className="h-3 w-16 rounded-full bg-gray-200" />
                    {/* • */}
                    <div className="h-3 w-2 rounded-full bg-gray-200" />
                    {/* timestamp */}
                    <div className="h-3 w-8 rounded-full bg-gray-200" />
                </div>
            </div>
            {/* comment body - matches text-md */}
            <div className="h-4 w-full rounded-full bg-gray-200" />
            <div className="h-4 w-2/3 rounded-full bg-gray-200" />
            {/* action row - matches gap-x-8 py-2 */}
            <div className="flex items-center justify-center gap-x-8 py-2 w-fit">
                <div className="h-3 w-8 rounded-full bg-gray-200" />
                <div className="h-3 w-8 rounded-full bg-gray-200" />
                <div className="h-3 w-8 rounded-full bg-gray-200" />
            </div>
        </div>
    </div>
);

export default SkeletonComment;