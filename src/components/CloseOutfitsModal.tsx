import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateStatus } from "../API/getStatus";
import { IWorkPermitAll } from "../types/types";

interface ICategoryModal {
    type: "post" | "patch";
    id: string;
    setVisibleModal: (visible: boolean) => void;
}

const CloseOutfitsModal: FC<ICategoryModal> = ({ type, id, setVisibleModal }) => {
    const [stateDate, setStateDate] = useState("");
    const handleDateChange = (event: any) => {
        setStateDate(event.target.value);
    };
    useEffect(() => {}, []);

    const updateData = async () => {
        await updateStatus(id, stateDate.toString()); // Ждем завершения обновления на сервере
        setVisibleModal(false);
        toast.success("Наряд успешно закрыт");
    };

    return (
        <div className="fixed top-0 z-50 left-0 bottom-0 right-0 w-full h-full bg-black/50 flex justify-center items-center ">
            <div className="grid gap-2 w-[270px] justify-center rounded-md bg-white border-gray-600 border-2 p-5">
                <label htmlFor="title">
                    <span className=" text-black underline m-2">Закрыть дознаряд</span>
                    <div className="flex  ">
                        <label className="block m-2 text-sm font-medium text-black">Номер дознаряда:</label>
                        <label className="block m-2 text-sm font-medium text-black">{id}</label>
                    </div>
                    <div className="flex ">
                        <label className="block m-2 text-sm font-medium text-black">Дата/Время закрытия:</label>
                    </div>
                    <div className="flex  max-w-[170px]">
                        <input
                            id="date"
                            type="date"
                            className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-white-700 dark:border-white-600 dark:text-black"
                            placeholder="Выберите дату"
                            value={stateDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </label>
                <div className="flex items-center mt-2 gap-2">
                    <button
                        onClick={() => updateData()}
                        className="disabled:hover:bg-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed flex gap-2 items-center text-white py-2 px-4 rounded-md bg-green-600 border-r-green-600 hover:bg-green-800"
                        type="submit"
                    >
                        Закрыть наряд
                    </button>
                    <button
                        onClick={() => setVisibleModal(false)}
                        className=" disabled:hover:bg-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed flex gap-2 items-center text-white py-2 px-4 rounded-md bg-rose-900 border-r-rose-900 hover:bg-rose-800"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseOutfitsModal;
