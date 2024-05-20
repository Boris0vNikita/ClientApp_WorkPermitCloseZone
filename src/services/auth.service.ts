import { instance } from "../API/axios.api";
import { IUserData } from "../types/types";
import { IResponseUserData, IUser } from "../types/types";

export const AuthService = {
    async registration(userData: IUserData): Promise<IResponseUserData | undefined> {
        const { data } = await instance.post<IResponseUserData>("user", userData);
        return data;
    },

    async login(userData: IUserData): Promise<IUser | undefined> {
        const { data } = await instance.post<IUser>("auth/login", userData);
        return data;
    },

    async getProfile(): Promise<IUser | undefined> {
        const { data } = await instance.get<IUser>("auth/chek");
        if (data) {
            return data;
        }
    },
};
//http://localhost:8000/api/auth/chek
