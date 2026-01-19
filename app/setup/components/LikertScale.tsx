import { useState, useEffect, type FC } from 'react';

interface LikertScaleProps {
    scale_idx: number;
    statement: string;
    onClick: (scale_idx: number, val: number) => void;
    selectedValue?: number; // Add this prop
}

const likertOptions = [
    { label: 'Strongly Disagree', val: 1 },
    { label: 'Disagree', val: 2 },
    { label: 'Agree', val: 3 },
    { label: 'Strongly Agree', val: 4 },
];

const LikertScale: FC<LikertScaleProps> = ({ 
    scale_idx, 
    statement, 
    onClick, 
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
        <div className='flex flex-col w-full gap-y-4 justify-center'>
            <p className='text-xl font-semibold'>{statement}</p>
            <div className='flex w-full justify-between items-center'>
                {likertOptions.map((option) => (
                    <label 
                        key={`${statement}_${option.label}`} 
                        className="flex flex-col gap-y-2 items-center cursor-pointer"
                    >
                        <input
                            type="radio"
                            name={statement}
                            value={option.val}
                            checked={selected === option.val}
                            onChange={() => handleSelection(option.val)}
                            className='cursor-pointer w-5 h-5'
                        />
                        <span className="font-light text-center">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default LikertScale;
