export const formatDate = (dateString: string): string => {
    const newDate = new Date(dateString);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return newDate.toLocaleDateString("us-US", options);
};
