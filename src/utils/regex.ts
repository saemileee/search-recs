export const isValidKeyword = (string: string) => {
    const regex = /^(?! )[0-9가-힣A-Za-z\s]+$/g;
    if (regex.test(string)) {
        return true;
    }
    return false;
};
