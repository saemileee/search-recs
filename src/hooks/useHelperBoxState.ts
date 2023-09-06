import {useCallback, useEffect, useState} from 'react';

const useHelperBox = (refs: React.MutableRefObject<null>[]) => {
    const [isShowing, setIsShowing] = useState(false);

    const showHelperBox = useCallback(() => {
        setIsShowing(true);
    }, []);

    const closeHelperBox = useCallback(() => {
        setIsShowing(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: Event) => {
            let isOutside = true;
            for (const ref of refs) {
                if (ref.current && ref.current === e.target) {
                    isOutside = false;
                    break;
                }
            }
            if (isOutside) {
                closeHelperBox();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [closeHelperBox, refs]);

    return {isShowing, showHelperBox, closeHelperBox};
};

export default useHelperBox;
