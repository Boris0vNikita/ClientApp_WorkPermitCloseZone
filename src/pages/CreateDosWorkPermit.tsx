import { useEffect, useState } from "react";
import { FaCheckCircle, FaFileUpload, FaPlus, FaSave, FaTimesCircle, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWorkPermit } from "../hooks/useWorkPermit";
import { useStatusView } from "../hooks/useStatusView";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { MdCancel } from "react-icons/md";

import { IEquipment, ISIZ, ISystem, ITeh, IWork, IWorkPermitAll } from "../types/types";
import { fetchEquipment, fetchSIZ, fetchSystem, fetchTeh, fetchWork, updatePreparation } from "../API/getStatus";
import { handleRadiationParameterChanges } from "../services/radHazardCal";

interface ICategory {
    id: number;
    title: string;
}

const categories: ICategory[] = [
    { id: 1, title: "Закрыт" },
    { id: 2, title: "В работе" },
    { id: 3, title: "В ожидании" },
];

const numbers = [
    { id: "01", title: "Категория 1" },
    { id: "02", title: "Категория 2" },
    { id: "03", title: "Категория 3" },
];

interface DataTableItem {
    workplace: string;
    room: string;
    equipmentUnit: string;
    equipment: string;
    radiationParameter: string;
    permissibleTime: string;
}
const initialData: DataTableItem[] = [
    {
        workplace: "Рабочее место 1",
        room: "АЭС",
        equipmentUnit: "Оборудывание",
        equipment: "Текст",
        radiationParameter: "",
        permissibleTime: "0:00",
    },
    {
        workplace: "Рабочее место 2",
        room: "АЭС",
        equipmentUnit: "Оборудывание",
        equipment: "Текст",
        radiationParameter: "",
        permissibleTime: "0:00",
    },

    {
        workplace: "Рабочее место 3",
        room: "АЭС",
        equipmentUnit: "Оборудывание",
        equipment: "Текст",
        radiationParameter: "",
        permissibleTime: "0:00",
    },
    // Add more initial data as needed
];

interface IStateSIZ {
    selectedSIZId: string | undefined;
    siz: ISIZ[] | undefined;
    selectedSIZTitle: string | undefined;
}
interface IStateTeh {
    selectedTehId: string | undefined;
    teh: ITeh[] | undefined;
    selectedTehTitle: string | undefined;
}

const CreateDosOutfit: React.FC = () => {
    //Combobox SIZ
    const [stateSiz, setStateSiz] = useState<IStateSIZ>({} as IStateSIZ);

    useEffect(() => {
        const loadWorks = async () => {
            try {
                const fetchedWorks = await fetchSIZ();
                if (fetchedWorks && fetchedWorks.length > 0) {
                    setStateSiz((prevState) => ({ ...prevState, siz: fetchedWorks }));
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadWorks();
    }, []);

    const handleChangeWork = (selectedOptions: any) => {
        setStateSiz((prevState) => ({
            ...prevState,
            selectedSIZTitle: selectedOptions.map((option: any) => option.value).join(", "),
        }));
    };
    ////////////////
    //Combobox ТЕх мероприятия
    const [stateTeh, setStateTeh] = useState<IStateTeh>({} as IStateTeh);

    useEffect(() => {
        const loadWorks = async () => {
            try {
                const fetchedWorks = await fetchTeh();
                if (fetchedWorks && fetchedWorks.length > 0) {
                    setStateTeh((prevState) => ({ ...prevState, teh: fetchedWorks }));
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadWorks();
    }, []);

    const handleChangeTeh = (selectedOptions: any) => {
        setStateTeh((prevState) => ({
            ...prevState,
            selectedTehTitle: selectedOptions.map((option: any) => option.value).join(", "),
        }));
    };
    ////////////////
    //Получение данных в расшифроку
    const [stateWork, setStateWork] = useState<IWork[]>();
    const [stateEquip, setStateEquip] = useState<IEquipment[]>();
    const [stateSys, setStateSys] = useState<ISystem[]>();

    useEffect(() => {
        const loadWorks = async () => {
            try {
                const fetchedWorks = await fetchWork();
                if (fetchedWorks && fetchedWorks.length > 0) {
                    setStateWork(fetchedWorks);
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadWorks();
        const loadEquips = async () => {
            try {
                const fetchedWorks = await fetchEquipment();
                if (fetchedWorks && fetchedWorks.length > 0) {
                    setStateEquip(fetchedWorks);
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadEquips();
        const loadSystem = async () => {
            try {
                const fetchedWorks = await fetchSystem();
                if (fetchedWorks && fetchedWorks.length > 0) {
                    setStateSys(fetchedWorks);
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadSystem();
    }, []);

    /////////
    const navigate = useNavigate();
    const objectWorkPermit = useWorkPermit();
    const status = useStatusView();
    const [selectState, setSelectState] = useState<ICategory | undefined>({} as ICategory);

    useEffect(() => {
        const category = categories.find((c) => c.title === objectWorkPermit?.status);
        setSelectState(category);
    }, [objectWorkPermit?.status]);

    const [selectedNumber, setSelectedNumber] = useState(numbers[0]);

    const handleChange = (e: any) => {
        const selectedId = e.target.value;
        const selected = numbers.find((number) => number.id === selectedId);
        if (selected) {
            setSelectedNumber(selected);
        }
    };
    const [inputValues, setInputValues] = useState(Array(objectWorkPermit?.workplace.length).fill("")); // Создаем состояние для хранения введенных значений из input

    const handleInputChange = (index: any, value: any) => {
        const newInputValues = [...inputValues]; // Создаем копию массива введенных значений
        newInputValues[index] = value; // Обновляем значение по индексу
        setInputValues(newInputValues); // Обновляем состояние
    };

    const buttonClick: any = async () => {
        if (status.statusView == "Просмотр") {
            navigate("/dosimetric_outfit/", {
                replace: true,
            });
        } else {
            if (
                stateSiz.selectedSIZTitle &&
                stateSiz.selectedSIZTitle.trim() !== "" &&
                stateTeh.selectedTehTitle &&
                stateTeh.selectedTehTitle.trim() !== ""
            ) {
                const sizArray = stateSiz.selectedSIZTitle.split(", ").map((sizTitle, index) => ({
                    id: `0${index + 1}`, // Генерация уникального идентификатора или использование другого метода для генерации идентификатора
                    name: sizTitle,
                }));
                const texArray = stateTeh.selectedTehTitle.split(", ").map((texTitle, index) => ({
                    id: `0${index + 1}`, // Генерация уникального идентификатора или использование другого метода для генерации идентификатора
                    name: texTitle,
                }));

                const workplaces = objectWorkPermit?.workplace.map((item, index) => ({
                    id: (index + 1).toString(), // ID рабочего места
                    radiationParameter: inputValues[index],
                }));

                await updatePreparation(objectWorkPermit?.numberDos, noteValue, workplaces, sizArray, texArray);

                navigate("/dosimetric_outfit/", {
                    replace: true,
                });
                toast.success("Сохранено");
            } else {
                toast.error("Заполните все поля");
            }
        }
    };

    const formatOptionLabel = ({ label, value }: ISIZ) => (
        <div>
            {label} - {value}
        </div>
    );

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#0284c7" : "white",
            color: state.isSelected ? "white" : "black",
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: "#e2e8f0",
            color: "white",
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: "white",
            ":hover": {
                backgroundColor: "#ef4444",
                color: "white",
            },
        }),
        singleValue: (provided: any) => ({
            // Добавлено для изменения стиля выбранного элемента
            ...provided,
            color: "#666666", // Серый цвет для выбранного элемента
        }),
    };

    const [radiationParameters, setRadiationParameters] = useState<string[]>([]);

    const handleRadiationParameterChange = (index: number, value: string) => {
        const calRad = handleRadiationParameterChanges(value) || "";
        setRadiationParameters((prevRadiationParameters) => {
            const updatedRadiationParameters = [...prevRadiationParameters];
            updatedRadiationParameters[index] = calRad;
            return updatedRadiationParameters;
        });
    };

    const [noteValue, setNoteValue] = useState("");

    const handleChangeArea = (event: any) => {
        setNoteValue(event.target.value);
    };

    return (
        <>
            <div className="flex justify-center font-roboto font-bold text-black text-2xl">
                <h1 className="mt-2 mb-2">Подготовка дозиметрических нарядов</h1>
            </div>
            <div className="grid grid-cols-6">
                {/* первая колонка */}
                <div className="grid mr-5 col-span-2">
                    {/* первый блок */}
                    <div className="grid rounded-md border-sky-300 border-2 p-1 mb-5 shadow-md ">
                        <div className="flex justify-start ">
                            <label className="block m-2 text-sm font-medium text-black">Дозиметрический наряд №</label>
                            <label className="block m-2 text-sm font-medium text-black underline ">
                                {objectWorkPermit?.numberDos}
                            </label>
                        </div>
                        <div className="flex justify-start ">
                            <label className="block m-2 text-sm font-medium text-black">Дата открытия</label>
                            <label className="block m-2 text-sm font-medium text-black underline ">
                                {objectWorkPermit?.startPlan}
                            </label>
                        </div>
                        <div className="flex justify-start ">
                            <label className="block m-2 text-sm font-medium text-black">Дата закрытия</label>
                            {objectWorkPermit?.status === "Закрыт" ? (
                                <label className="block m-2 text-sm font-medium text-black underline ">
                                    {objectWorkPermit?.endPlan}
                                </label>
                            ) : (
                                ""
                            )}
                        </div>

                        <div className="flex justify-start items-center ">
                            <label className="block m-2 text-sm font-medium text-black">Состояние</label>
                            <label className="block m-2 text-sm font-medium text-black">
                                {objectWorkPermit?.status}
                            </label>
                        </div>
                    </div>
                    {/*Код работы */}
                    <div className="grid items-center rounded-md border-sky-300 border-2 p-2 shadow-md">
                        <div className="flex justify-start items-center ">
                            <label className="block m-2 text-sm font-medium text-black">Код Работы:</label>
                            <span className="border-solid border-2 text-black border-slate-300 rounded-md font-roboto p-[0.6rem] text-sm m-1 ">
                                {objectWorkPermit?.codeWork}
                            </span>
                            <span className=" font-roboto text-xl m-1 text-black "> - </span>
                            <span className=" border-solid border-2 text-black border-slate-300 rounded-md font-roboto p-[0.6rem] text-sm m-1 ">
                                {objectWorkPermit?.codeEquipment}
                            </span>
                            <span className=" font-roboto text-xl m-1 text-black "> . </span>
                            <span className=" border-solid border-2 text-black  border-slate-300 rounded-md font-roboto p-[0.6rem] text-sm m-1 ">
                                {objectWorkPermit?.codeSystem}
                            </span>
                            <select
                                disabled={status.statusView == "Просмотр"}
                                name="number"
                                className="input border-2 border-slate-300 text-black bg-white cursor-pointer customs-selects "
                                onChange={handleChange}
                                value={selectedNumber.id.toString()}
                                required
                            >
                                {numbers.map((number, idx) => (
                                    <option key={idx} value={number.id.toString()}>
                                        {number.id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <label className="mt-2 ml-1 block text-sm font-medium text-black underline">Расшифровка</label>
                        <div className="grid border-solid border-2 border-gray-300 rounded-md">
                            <div className="flex items-center">
                                <label className="block m-2 text-sm font-medium text-black">Работа:</label>
                                <label className="block m-2 text-sm font-medium text-black">
                                    {stateWork &&
                                        stateWork.find((work) => work.id === objectWorkPermit?.codeWork)?.title}
                                </label>
                            </div>
                            <div className="flex items-center">
                                <label className="block m-2 text-sm font-medium text-black">Оборудование:</label>
                                <label className="block m-2 text-sm font-medium text-black">
                                    {stateEquip &&
                                        stateEquip.find((work) => work.id === objectWorkPermit?.codeEquipment)?.title}
                                </label>
                            </div>
                            <div className="flex items-center">
                                <label className="block m-2 text-sm font-medium text-black">Система:</label>
                                <label className="block m-2 text-sm font-medium text-black">
                                    {stateSys &&
                                        stateSys.find((work) => work.id === objectWorkPermit?.codeSystem)?.title}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid col-span-4">
                    {/* TABLE */}
                    <div className="grid rounded-md border-sky-300 border-2 shadow-md">
                        <label className="block ml-3 mt-2 mb-0 text-sm font-medium text-black">Члены бригады:</label>
                        <div className="my-5 max-w-full overflow-x-auto">
                            <div className="bg-white pr-4 pl-4 pt-0 rounded-md">
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-white">
                                            <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                                Табельный номер
                                            </th>
                                            <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                                ФИО
                                            </th>
                                            <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                                Критерий ОДК (Е, мЗв)
                                            </th>
                                            <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                                ОДК
                                            </th>
                                            <th className="text-bold text-left border text-black border-gray-300 px-4 py-2">
                                                Доп ТДК
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {objectWorkPermit?.brigade.map((transaction, idx) => (
                                            <tr key={idx} className="bg-white">
                                                <td className="border text-black border-gray-300 px-4 py-2">
                                                    {transaction.number}
                                                </td>
                                                <td className="border text-black border-gray-300 px-4 py-2">
                                                    {transaction.fio}
                                                </td>
                                                <td className="border text-black border-gray-300 px-4 py-2">
                                                    {transaction.criteriiODK}
                                                </td>
                                                <td className="border text-black border-gray-300 px-4 py-2">
                                                    Стандарт
                                                </td>
                                                <td className="border text-black border-gray-300 px-4 py-2">
                                                    Стандарт
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Примечания и комбобоксы */}
                    <div className="grid grid-cols-2  rounded-md border-sky-300 border-2 mt-5 shadow-md">
                        <div className="grid items-center p-1">
                            <div className="grid mb-10  ">
                                <div className="">
                                    {status.statusView === "Просмотр" ? (
                                        <pre className="text-black font-bold rounded-md p-1 mb-1">
                                            {objectWorkPermit &&
                                                objectWorkPermit.siz &&
                                                objectWorkPermit.siz.map((item, index) => (
                                                    <span key={index}>{item.name}, </span>
                                                ))}
                                        </pre>
                                    ) : (
                                        <pre className="text-black font-bold rounded-md p-1 mb-1">
                                            {stateSiz.selectedSIZTitle}
                                        </pre>
                                    )}
                                    <Select
                                        isDisabled={status.statusView == "Просмотр"}
                                        isMulti
                                        options={stateSiz.siz}
                                        value={stateSiz.siz?.filter((option) =>
                                            stateSiz.selectedSIZTitle?.includes(option.value)
                                        )}
                                        onChange={handleChangeWork}
                                        styles={customStyles}
                                        placeholder="Выберите СИЗ"
                                        noOptionsMessage={() => "Нет доступных вариантов"}
                                        formatOptionLabel={formatOptionLabel} // Если вам нужно изменить отображение опции
                                    />
                                </div>
                                <div className="mt-5">
                                    {status.statusView === "Просмотр" ? (
                                        <pre className="text-black font-bold rounded-md p-1 mb-1">
                                            {objectWorkPermit?.tehEvent &&
                                                Array.isArray(objectWorkPermit.tehEvent) &&
                                                objectWorkPermit.tehEvent.map((item, index) => (
                                                    <span key={index}>{item.name}, </span>
                                                ))}
                                        </pre>
                                    ) : (
                                        <pre className="text-black font-bold  rounded-md p-1 mb-1">
                                            {stateTeh.selectedTehTitle}
                                        </pre>
                                    )}

                                    <Select
                                        isDisabled={status.statusView == "Просмотр"}
                                        isMulti
                                        options={stateTeh.teh}
                                        value={stateTeh.teh?.filter((option) =>
                                            stateTeh.selectedTehTitle?.includes(option.value)
                                        )}
                                        onChange={handleChangeTeh}
                                        styles={customStyles}
                                        placeholder="Выберите Тех мероприятие"
                                        noOptionsMessage={() => "Нет доступных вариантов"}
                                        formatOptionLabel={formatOptionLabel}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <label className="block m-2 text-sm font-medium text-black">
                                Примечания оперативного персонала ОРБ:
                            </label>
                            <textarea
                                disabled={status.statusView == "Просмотр"}
                                value={status.statusView === "Просмотр" ? objectWorkPermit?.note : noteValue}
                                onChange={handleChangeArea}
                                id="message"
                                rows={4}
                                className=" max-h-[130px] min-h-[130px] max-w-[300px] mt-2 mb-5 ml-2  block  w-full text-sm text-black bg-white rounded-lg border border-slate-300"
                                placeholder="примечания..."
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
            {/* Последний объект */}
            <div className="grid rounded-md border-sky-300 border-2 mt-5 p-3 shadow-md">
                <label className=" mt-0 ml-1  block text-sm font-medium text-black underline">
                    Список рабочих мест
                </label>
                {/* <div className="flex m-1 justify-start items-center ">
                    <label className=" block text-sm font-medium text-black ">Параметр радиационной обстановки:</label>
                    <input
                        disabled={status.statusView == "Просмотр"}
                        type="text"
                        id="email-address-icon"
                        className="input border border-slate-700  placeholder-black/50 mx-2 "
                        placeholder="Код операционной величины..."
                    />
                    <input
                        disabled={status.statusView == "Просмотр"}
                        type="text"
                        id="email-address-icon"
                        className="input border border-slate-700  placeholder-black/50   "
                        placeholder="Агент воздействия..."
                    />

                    <button
                        disabled={status.statusView == "Просмотр"}
                        className="flex mr-1  ml-5  h-9 items-center text-white py-2 px-4 rounded-md bg-cyan-400 hover:bg-cyan-500"
                    >
                        <FaPlus />
                    </button>
                    <button
                        disabled={status.statusView == "Просмотр"}
                        className="flex m-1 h-9 items-center  text-white py-2 px-4 rounded-md bg-red-500 hover:bg-rose-800"
                    >
                        <FaTrash />
                    </button>
                    <button
                        disabled={status.statusView == "Просмотр"}
                        className="flex m-1 text-white py-2 px-4 rounded-md bg-green-400 hover:bg-lime-500"
                    >
                        <span className="text-sm font-medium text-white">Скрипт</span>
                        <FaFileUpload className="mt-1 ml-1" />
                    </button>
                </div> */}
                <div className="overflow-x-auto">
                    <table className=" mt-1 table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-white">
                                <th className="border text-black border-gray-300 px-4 py-2">Основное рабочее место</th>
                                <th className="border text-black border-gray-300 px-4 py-2">Помещение</th>
                                <th className="border text-black border-gray-300 px-4 py-2">Единица оборудования</th>
                                <th className="border text-black border-gray-300 px-4 py-2">Оборудование</th>
                                <th className="border text-black border-gray-300 px-4 py-2">
                                    Параметр радиации P (е, мЗв){" "}
                                </th>
                                <th className="border text-black border-gray-300 px-4 py-2">
                                    Допустимое время (мин:сек)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {objectWorkPermit?.workplace.map((item, index) => (
                                <tr key={index} className={"bg-white"}>
                                    <td className="border text-black text-center border-gray-300 px-4 py-2">
                                        {item.name}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">{item.room}</td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {item.pieceEquipment}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">{item.equipment}</td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {status.statusView === "Подготовка" ? (
                                            <input
                                                key={`input-${index}`}
                                                type="number"
                                                step="any"
                                                onChange={(e) => {
                                                    handleInputChange(index, e.target.value);
                                                    handleRadiationParameterChange(index, e.target.value);
                                                }}
                                                className="input  border border-slate-700 placeholder-black/50 block w-full ps-10 p-2.5"
                                            />
                                        ) : (
                                            <input
                                                disabled={status.statusView === "Просмотр"}
                                                value={item.radiationParameter}
                                                key={`input-${index}`}
                                                type="number"
                                                step="any"
                                                className="input  border border-slate-700 placeholder-black/50 block w-full ps-10 p-2.5"
                                            />
                                        )}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {status.statusView === "Подготовка" ? radiationParameters[index] : item.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Кнопка сохранить */}
            <div className="grid justify-center items-center mt-2">
                <button
                    onClick={buttonClick}
                    className={`flex ml-auto  gap-2  text-white py-2 px-4 rounded-md ${
                        status.statusView == "Просмотр"
                            ? "bg-rose-500 hover:bg-rose-700"
                            : "bg-green-500 hover:bg-green-700"
                    } `}
                >
                    <span>{status.statusView == "Просмотр" ? "Назад" : "Сохранить"} </span>
                    {status.statusView == "Просмотр" ? <MdCancel className="mt-1" /> : <FaSave className="mt-0.5" />}
                </button>
            </div>
        </>
    );
};

export default CreateDosOutfit;
