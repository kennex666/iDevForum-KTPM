export const cookiesKey = (key: string) => {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === key) {
            return decodeURIComponent(cookie[1]);
        }
    }
    return null;
}

export const getAccessToken = () => {
    return cookiesKey("accessToken");
}