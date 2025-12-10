import { type FC } from "react";
import LikertScale from "./LikertScale";

interface RatingsPhaseProps {
    handleRatingsUpdate: (_ratings: number[]) => void;
    ratings: number[]; // Renamed from _ratings for clarity
}

const opinions = [
    "Men should have a say in abortion",
    "Trump and the US are fascist",
    "Islam is wrong",
    "Being gay is wrong",
    "Feminism is misandry"
]

const RatingPhase: FC<RatingsPhaseProps> = ({ handleRatingsUpdate, ratings }) => {
    const onClick = (scale_idx: number, val: number) => {
        const updatedRatings = [...ratings];
        updatedRatings[scale_idx] = val;
        handleRatingsUpdate(updatedRatings);
    }
    
    return (
        <div className="flex flex-col w-full h-full justify-evenly items-start px-16">
            {
                opinions.map((opinion, idx) => (
                    <LikertScale 
                        key={`likert_${idx}`} 
                        scale_idx={idx} 
                        statement={opinion} 
                        onClick={onClick}
                        selectedValue={ratings[idx]} // Pass current value
                    />
                ))
            }
        </div>
    )
}

export default RatingPhase;
