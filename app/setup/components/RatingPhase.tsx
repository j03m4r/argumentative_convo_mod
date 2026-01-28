"use client";
import { type FC } from "react";
import LikertScale, { likertOptions } from "./LikertScale";
import { useState } from "react";

interface RatingsPhaseProps {
    handleRatingsUpdate: (_ratings: number[]) => void;
    ratings: number[]; // Renamed from _ratings for clarity
}

const opinions = [
    "Men should have a say in abortion",
    "Trump and the US are fascist",
    "Islam is wrong",
    "Being gay is wrong",
    "Feminism is anti-male"
]

const RatingPhase: FC<RatingsPhaseProps> = ({ handleRatingsUpdate, ratings }) => {
    const [valHovered, setValHovered] = useState<number|null>(null);
    const onClick = (scale_idx: number, val: number) => {
        const updatedRatings = [...ratings];
        updatedRatings[scale_idx] = val;
        handleRatingsUpdate(updatedRatings);
    }

    const onMouseEnter = (val: number) => {
        setValHovered(val);
    }

    const onMouseLeave = () => {
        setValHovered(null);
    }
    
    return (
        <div className="flex w-full h-full items-center px-16 py-4">
            <div className="w-full flex flex-col justify-evenly h-full">
                <div className="flex w-full justify-between">
                    <div className="min-w-[350px]"></div>
                    <div className="flex w-full justify-between items-center h-full gap-x-4 pl-4">
                        {likertOptions.map((option, idx) => (
                            <div key={`val_${idx}`} className={`w-full flex justify-center py-4 h-full border-b-2 ${valHovered===option.val ? "border-blood-orange" : "border-cream"}`}>{option.label}</div>
                        ))}
                    </div>
                </div>
                {
                    opinions.map((opinion, idx) => (
                        <LikertScale
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            key={`likert_${idx}`} 
                            scale_idx={idx} 
                            statement={opinion} 
                            onClick={onClick}
                            selectedValue={ratings[idx]} // Pass current value
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default RatingPhase;
