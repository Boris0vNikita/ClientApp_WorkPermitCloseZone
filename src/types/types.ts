export interface IUserData {
    login: string;
    identifier: string;
}

export interface IResponseUser {
    email: string;
    id: number;
    cteatedAt: string;
    updateAt: string;
    password: string;
}

export interface IResponseUserData {
    token: string;
    user: IResponseUser;
}

export interface ITransaction {
    amount: number;
    createdAt: string;
    updateAt: string;
    title: string;
    type: string;
    id: number;
    category: ICategory;
}

export interface IUser {
    id: number;
    showname: string;
    token: string;
}

export interface ICategory {
    title: string;
    id: number;
    createdAt: string;
    updatedAt: string;
    transaction?: [];
}

export interface IResponceTransactionLoader {
    categories: ICategory[];
    transactions: ITransaction[];
    totalIncome: number;
    totalExpense: number;
}

// ///////////////////////////////////////////////////

export interface IWorkPermit {
    numberOutfits: string;
    view: string;
    name: string;
    notes: string;
    outstanding: string;
    director: string;
    maker: string;
    customer: string;
    executor: string;
    startPlan: string;
    endPlan: string;
    startActual: string;
    endActual: string;
    state: string;
}

export interface IStatusView {
    statusView: string;
}

export interface IStatusDos {
    id: number;
    nameStatus: string;
    description: string;
}

export interface IWork {
    id: string;
    title: string;
}

export interface IEquipment {
    id: string;
    title: string;
}

export interface ISystem {
    id: string;
    title: string;
}

export interface ISIZ {
    label: string;
    value: string;
}
export interface ITeh {
    label: string;
    value: string;
}

export interface IPeople {
    token: string;
    id: string;
    showname: string;
}

export interface IPeopleFio {
    fio: string;
    personnel_number: string;
}

export interface IPeopleFioNumber {
    fio: string;
    number: string;
}
export interface IIssuePeople {
    fio: string;
    number: string;
    date: string;
    reason: string;
    license: false;
}

export interface IWorkPermitAll {
    numberDos: string;
    name: string;
    title: string;
    note: string;
    outstanding: string;
    custromer: string;
    executor: string;
    startPlan: string;
    endPlan: string;
    startFact: string;
    endFact: string;
    status: string;
    codeWork: string;
    codeEquipment: string;
    codeSystem: string;
    siz: {
        id: string;
        name: string;
    }[];
    tehEvent: {
        id: string;
        name: string;
    }[];
    brigade: {
        fio: string;
        number: string;
        criteriiODK: string;
        director: boolean;
        manufacturer: boolean;
    }[];
    workplace: {
        name: string;
        room: string;
        pieceEquipment: string;
        equipment: string;
        radiationParameter: string;
        time: string;
    }[];
}

export interface Isiz {
    id: string;
    name: string;
}
export interface Iworplace {
    id: string;
    name: string;
    room: string;
    pieceEquipment: string;
    equipment: string;
    radiationParameter: string;
    time: string;
}
