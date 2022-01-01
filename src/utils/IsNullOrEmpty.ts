export const isNullOrEmpty = (value: string) => {
    if (!value || value.trim() === '' || value.trim().length === 0) {
        return true;
    }

    return false;
};
