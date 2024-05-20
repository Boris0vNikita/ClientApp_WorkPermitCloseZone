import { useAppSelector } from "../store/hooks";
import { IWorkPermit, IWorkPermitAll } from "../types/types";

export const useWorkPermit = (): IWorkPermitAll | null => {
    const workPermit = useAppSelector((state) => state.workPermit.workPermit);

    return workPermit;
};
