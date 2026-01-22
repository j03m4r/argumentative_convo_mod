import { useState, useEffect, type FC } from 'react';

interface LikertScaleProps {
    scale_idx: number;
    statement: string;
    onClick: (scale_idx: number, val: number) => void;
    onMouseEnter: (val: number) => void;
    onMouseLeave: () => void;
    selectedValue?: number; // Add this prop
}

export const likertOptions = [
    { label: 'Strongly Disagree', val: 1 },
    { label: 'Disagree', val: 2 },
    { label: 'Agree', val: 3 },
    { label: 'Strongly Agree', val: 4 },
];

const LikertScale: FC<LikertScaleProps> = ({ 
    scale_idx, 
    statement, 
    onClick, 
    onMouseEnter,
    onMouseLeave,
    selectedValue = -1 
}) => {
    const [selected, setSelected] = useState<number>(selectedValue);
    
    useEffect(() => {
        setSelected(selectedValue);
    }, [selectedValue]);
    
    const handleSelection = (val: number) => {
        setSelected(val);
        onClick(scale_idx, val);
    }
    
    return (
        <div className={`flex w-full gap-x-4 justify-center h-full items-center ${scale_idx%2===0&&''}`}>
            <p className='text-xl font-semibold whitespace-nowrap min-w-[350px] pl-4'>{statement}</p>
            <div className='flex w-full justify-between items-center h-full gap-x-4 py-2'>
                {likertOptions.map((option) => (
                    <label 
                        key={`${statement}_${option.label}`} 
                        className="flex flex-col gap-y-2 items-center justify-center cursor-pointer w-full h-full rounded-lg hover:bg-blood-orange/10"
                        onMouseEnter={() => onMouseEnter(option.val)}
                        onMouseLeave={onMouseLeave}
                    >
                        <input
                            type="radio"
                            name={statement}
                            value={option.val}
                            checked={selected === option.val}
                            onChange={() => handleSelection(option.val)}
                            className='cursor-pointer w-5 h-5'
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}

export default LikertScale;
