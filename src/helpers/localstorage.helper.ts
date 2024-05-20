export function getTokenFromLocalStorage(): string {
    const data = localStorage.getItem("token");
    console.log(data);

    const token: string = data ? JSON.parse(data) : "";

    return token;
}

export function setTokenToLocalStorage(key: string, token: string): void {
    localStorage.setItem(key, JSON.stringify(token));
}

export function removeTokenFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
}

// user
// export function setUserToLocalStorage(key: string, user: string): void {
//     localStorage.setItem(key, JSON.stringify(user));
// }

// export function getUserFromLocalStorage(): string {
//     const data = localStorage.getItem("user");
//     console.log(data);

//     const user: string = data ? JSON.parse(data) : "";

//     return user;
// }

// export function removeUserFromLocalStorage(key: string): void {
//     localStorage.removeItem(key);
// }
