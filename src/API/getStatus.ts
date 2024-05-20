import { toast } from "react-toastify";
import {
    IEquipment,
    IIssuePeople,
    IPeopleFio,
    IPeopleFioNumber,
    ISIZ,
    IStatusDos,
    ISystem,
    ITeh,
    IWork,
    IWorkPermitAll,
    Isiz,
    Iworplace,
} from "../types/types";
import axios from "axios";
export const fetchStatus = async () => {
    try {
        const response = await axios.get<IStatusDos[]>("http://localhost:8000/api/status");
        return response.data;
    } catch (error) {
        console.error("Error fetching status data:", error);
    }
};
export const fetchWork = async () => {
    try {
        const response = await axios.get<IWork[]>("http://localhost:8000/api/work");
        return response.data;
    } catch (error) {
        console.error("Error fetching status data:", error);
    }
};
export const fetchEquipment = async () => {
    try {
        const response = await axios.get<IEquipment[]>("http://localhost:8000/api/equipment");
        return response.data;
    } catch (error) {
        console.error("Error fetching status data:", error);
    }
};
export const fetchSystem = async () => {
    try {
        const response = await axios.get<ISystem[]>("http://localhost:8000/api/system");
        return response.data;
    } catch (error) {
        console.error("Error fetching status data:", error);
    }
};
export const fetchSIZ = async () => {
    try {
        const response = await axios.get<ISIZ[]>("http://localhost:8000/api/siz");
        return response.data;
    } catch (error) {
        console.error("Error fetching status data:", error);
    }
};
export const fetchTeh = async () => {
    try {
        const response = await axios.get<ITeh[]>("http://localhost:8000/api/technical");
        return response.data;
    } catch (error) {
        console.error("Error fetching status data:", error);
    }
};

export const fetchFioPerson = async () => {
    try {
        const response = await axios.get<IPeopleFio[]>("http://localhost:8000/api/personal/fio");
        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};

////Выдача прав
export const fetchIssueAll = async (pageNumber: any) => {
    try {
        const response = await axios.get<IIssuePeople[]>(
            `http://localhost:8000/api/issuing/all?pageNumber=${pageNumber}`
        );

        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};

export const getTotalPage = async () => {
    try {
        const response = await axios.get<number>("http://localhost:8000/api/issuing/totalPage");
        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};

export const postIssue = async (newIssueData: any) => {
    try {
        const response = await axios.post<IIssuePeople[]>("http://localhost:8000/api/issuing/add", newIssueData);
        return response.data;
    } catch (e: any) {
        if (e.response && e.response.status === 500) {
            // Ошибка: такой пользователь уже есть
            toast.error("Такой пользователь уже есть");
        } else {
            // Другие ошибки
            console.error("Error adding issue:", e);
        }
    }
};

export const updateIssue = async (number: string, license: boolean) => {
    try {
        const response = await axios.patch<IIssuePeople[]>("http://localhost:8000/api/issuing/update", {
            number,
            license,
        });
        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};

export const getTrueIssue = async () => {
    try {
        const response = await axios.get<IPeopleFioNumber[]>("http://localhost:8000/api/issuing/trues");
        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};

/////////
export const getListDos = async () => {
    try {
        const response = await axios.get<IWorkPermitAll[]>("http://localhost:8000/api/dos/");
        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};
/////Обновления статуса в ListDos
export const updateStatus = async (id: string, date: string) => {
    try {
        const response = await axios.patch<IWorkPermitAll[]>("http://localhost:8000/api/dos/update", {
            id,
            date,
        });
        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};
//удаление из таблицы прав
export const deleteIssue = async (number: string) => {
    try {
        const response = await axios.patch<IIssuePeople[]>("http://localhost:8000/api/issuing/delete", {
            number,
        });
        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};

///Подготовка дознаряда/////
export const updatePreparation = async (
    id: string | undefined,
    note: string | undefined,
    workplaces: any,
    siz: any,
    tex: any
) => {
    try {
        const response = await axios.patch<IWorkPermitAll[]>("http://localhost:8000/api/dos/patch", {
            id,
            note,
            workplaces,
            siz,
            tex,
        });
        return response.data;
    } catch (e) {
        console.error("Error fetching status data:", e);
    }
};
///Создание дознаряда/////
export const postDos = async (
    numberDos: string | undefined,
    name: string | undefined,
    title: string | undefined,
    note: string | undefined,
    outstanding: string | undefined,
    custromer: string | undefined,
    executor: string | undefined,
    startPlan: string | undefined,
    endPlan: string | undefined,
    startFact: string | undefined,
    endFact: string | undefined,
    status: string | undefined,
    codeWork: string | undefined,
    codeEquipment: string | undefined,
    codeSystem: string | undefined,
    sizs: any,
    tehEvent: any,
    brigade: any,
    workplace: any
) => {
    try {
        const response = await axios.post<IWorkPermitAll[]>("http://localhost:8000/api/dos/post", {
            numberDos,
            name,
            title,
            note,
            outstanding,
            custromer,
            executor,
            startPlan,
            endPlan,
            startFact,
            endFact,
            status,
            codeWork,
            codeEquipment,
            codeSystem,
            sizs,
            tehEvent,
            brigade,
            workplace,
        });
        toast.success("Наряд создался");
        return response.data;
    } catch (error: any) {
        console.log(error.response.data);

        toast.error(error.response.data);
    }
};
