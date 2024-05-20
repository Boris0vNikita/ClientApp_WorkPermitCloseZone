import { useAppSelector } from "../store/hooks";
import { IUser } from "../types/types";

export const useUser = (): IUser | null => {
    const user = useAppSelector((state) => state.user.user);

    return user;
};
