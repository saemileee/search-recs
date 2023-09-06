import {useCallback, useState} from 'react';

interface TypeFocusingHook {
    onKeydownHandler: (key: string) => void;
    focusingIdx: number | null;
    setFocusingIdx: React.Dispatch<React.SetStateAction<number | null>>;
}

const useFocusingIdx = (dataLength: number): TypeFocusingHook => {
    const [focusingIdx, setFocusingIdx] = useState<number | null>(null);

    const onKeydownHandler = useCallback(
        (key: string) => {
            if (key === 'ArrowDown') {
                if (focusingIdx === null) {
                    setFocusingIdx(0);
                } else if (focusingIdx < dataLength - 1) {
                    setFocusingIdx(prev => (prev !== null ? prev + 1 : prev));
                }
            }
            if (key === 'ArrowUp') {
                if (focusingIdx === 0) {
                    setFocusingIdx(null);
                } else if (focusingIdx !== null && focusingIdx > 0) {
                    setFocusingIdx(prev => (prev ? prev - 1 : prev));
                }
            }
        },
        [focusingIdx]
    );
    return {onKeydownHandler, focusingIdx, setFocusingIdx};
};

export default useFocusingIdx;
