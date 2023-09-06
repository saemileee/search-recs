import {useCallback, useEffect, useState} from 'react';

const useHelperBox = (ref: React.MutableRefObject<null>) => {
    const [isShowing, setIsShowing] = useState(false);

    const showHelperBox = useCallback(() => {
        setIsShowing(true);
    }, []);

    const closeHelperBox = useCallback(
        (doc: EventTarget | null) => {
            if (doc !== ref.current) {
                setIsShowing(false);
            }
        },
        [ref]
    );

    useEffect(() => {
        document.addEventListener('click', e => {
            closeHelperBox(e.target);
        });

        return document.removeEventListener('click', e => {
            closeHelperBox(e.target);
        });
    }, [closeHelperBox]);

    return {isShowing, showHelperBox, closeHelperBox};
};

export default useHelperBox;
