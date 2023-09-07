import {useCallback, useState} from 'react';

interface TypeFocusingHook {
    onKeydownFocusing: (e: React.KeyboardEvent) => void;
    onMouseHoverFocusing: (idx: number) => void;

    keyBoardFocusingIdx: number | null;
    mouseFocusingIdx: number | null;

    initFocusingIdx: () => void;
}

const useFocusingIdx = (dataLength: number): TypeFocusingHook => {
    const [keyBoardFocusingIdx, setKeyboardFocusingIdx] = useState<number | null>(null);
    const [mouseFocusingIdx, setMouseFocusingIdx] = useState<number | null>(null);

    const onKeydownFocusing = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.nativeEvent.isComposing) return;
            setMouseFocusingIdx(null);
            if (e.key === 'ArrowDown') {
                if (keyBoardFocusingIdx === null) {
                    setKeyboardFocusingIdx(0);
                } else if (keyBoardFocusingIdx < dataLength - 1) {
                    setKeyboardFocusingIdx(prev => (prev !== null ? prev + 1 : prev));
                }
            }
            if (e.key === 'ArrowUp') {
                if (keyBoardFocusingIdx === 0) {
                    setKeyboardFocusingIdx(null);
                } else if (keyBoardFocusingIdx !== null && keyBoardFocusingIdx > 0) {
                    setKeyboardFocusingIdx(prev => (prev ? prev - 1 : prev));
                }
            }
        },
        [dataLength, keyBoardFocusingIdx]
    );

    const onMouseHoverFocusing = useCallback(
        (idx: number) => {
            setMouseFocusingIdx(idx);
            if (mouseFocusingIdx === null) {
                setKeyboardFocusingIdx(null);
            } else {
                // 마우스 호버 후 키보드 동작 시 마우스 포커싱 된 값 기준으로 동작하기 위함
                setKeyboardFocusingIdx(idx);
            }
        },
        [mouseFocusingIdx]
    );

    const initFocusingIdx = useCallback(() => {
        setKeyboardFocusingIdx(null);
        setMouseFocusingIdx(null);
    }, []);

    return {
        onKeydownFocusing,
        onMouseHoverFocusing,
        keyBoardFocusingIdx,
        mouseFocusingIdx,
        initFocusingIdx,
    };
};

export default useFocusingIdx;
