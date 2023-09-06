import {useCallback, useState} from 'react';

interface TypeFocusingHook {
    onKeydownHandler: (e: React.KeyboardEvent) => void;
    focusingIdx: number | null;
    setFocusingIdx: React.Dispatch<React.SetStateAction<number | null>>;
}

const useFocusingIdx = (dataLength: number): TypeFocusingHook => {
    const [focusingIdx, setFocusingIdx] = useState<number | null>(null);

    const onKeydownHandler = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'ArrowDown') {
                if (focusingIdx === null) {
                    setFocusingIdx(0);
                } else if (focusingIdx < dataLength - 1) {
                    setFocusingIdx(prev => (prev !== null ? prev + 1 : prev));
                }
            }
            if (e.key === 'ArrowUp') {
                if (focusingIdx === 0) {
                    setFocusingIdx(null);
                } else if (focusingIdx !== null && focusingIdx > 0) {
                    setFocusingIdx(prev => (prev ? prev - 1 : prev));
                }
            }
        },
        [dataLength, focusingIdx]
    );
    return {onKeydownHandler, focusingIdx, setFocusingIdx};
};

export default useFocusingIdx;
