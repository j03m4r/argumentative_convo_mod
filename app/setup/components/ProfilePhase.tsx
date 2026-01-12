import Image from "next/image"

export default function ProfilePhase() {
    return (
        <div className="flex flex-col gap-y-4 w-full h-full justify-center items-center">
            <Image 
                src='/images/avatar_mosaic.png' 
                width={100} 
                height={100} 
                alt="Mosaic profile picture"
                className="w-1/4 h-auto rounded-full"
            />
            <h2 className="text-4xl">5121329495</h2>
        </div>
    )
}

