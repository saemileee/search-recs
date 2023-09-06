import {useCallback, useEffect, useState} from 'react';

const useHelperBox = (ref: React.MutableRefObject<null>) => {
    const [isShowing, setIsShowing] = useState(false);

    const showHelperBox = useCallback(() => {
        setIsShowing(true);
    }, []);

    const closeHelperBox = useCallback(() => {
        setIsShowing(false);
    }, []);

    useEffect(() => {
        document.addEventListener('click', e => {
            if (e.target !== ref.current) {
                closeHelperBox();
            }
        });

        return document.removeEventListener('click', e => {
            if (e.target !== ref.current) {
                closeHelperBox();
            }
        });
    }, [closeHelperBox, ref]);

    return {isShowing, showHelperBox, closeHelperBox};
};

export default useHelperBox;
