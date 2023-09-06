export const isValidKeyword = (string: string) => {
    const regex = /^(?! )[가-힣A-Za-z]+$/g;
    if (regex.test(string)) {
        return true;
    }
    return false;
};
