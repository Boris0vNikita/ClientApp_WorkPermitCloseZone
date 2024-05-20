import { useAppSelector } from "../store/hooks";
import { IStatusView } from "../types/types";

export const useStatusView = (): IStatusView => {
    const statusView = useAppSelector((state) => state.statusView.statusView);

    return statusView;
};
