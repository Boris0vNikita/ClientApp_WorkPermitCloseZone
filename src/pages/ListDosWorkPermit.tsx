import { useEffect, useState } from "react";
import { FaEllipsisV, FaFile, FaSearch, FaTimes } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import CloseOutfitsModal from "../components/CloseOutfitsModal";

import { ISIZ, IStatusDos, IWorkPermit, IWorkPermitAll } from "../types/types";
import { useDispatch } from "react-redux";
import { setWorkPermit } from "../store/workPermit/workPermitSlice";
import { setStatusView } from "../store/status/statusSlice";
import { FaFilePen } from "react-icons/fa6";
import { BsFiletypeXlsx } from "react-icons/bs";
import * as XLSX from "xlsx";
import { fetchStatus, getListDos } from "../API/getStatus";
import { handleRadiationParameterChanges } from "../services/radHazardCal";

const data: IWorkPermit[] = [
    {
        numberOutfits: "212",
        view: "Дознаряд",
        name: "работа 2",
        notes: "работать аккуратно",
        outstanding: "пользователь 1",
        director: "пользователь 2",
        maker: "пользователь 2",
        customer: "Китай",
        executor: "АЭС",
        startPlan: "2024.04.03",
        endPlan: "2024.04.03",
        startActual: "2024.04.03",
        endActual: "2024.04.03",
        state: "Закрыт",
    },
    {
        numberOutfits: "213",
        view: "Дознаряд",
        name: "работа 2",
        notes: "работать аккуратно",
        outstanding: "пользователь 1",
        director: "пользователь 2",
        maker: "пользователь 2",
        customer: "АЭС",
        executor: "АЭС",
        startPlan: "2024.04.03",
        endPlan: "2024.04.03",
        startActual: "2024.04.03",
        endActual: "2024.04.03",
        state: "Закрыт",
    },
    {
        numberOutfits: "214",
        view: "Дознаряд",
        name: "работа 2",
        notes: "работать аккуратно",
        outstanding: "пользователь 1",
        director: "пользователь 2",
        maker: "пользователь 2",
        customer: "АЭС",
        executor: "АЭС",
        startPlan: "2024.04.03",
        endPlan: "2024.04.03",
        startActual: "2024.04.03",
        endActual: "2024.04.03",
        state: "В работе",
    },
    {
        numberOutfits: "215",
        view: "Дознаряд",
        name: "работа 9",
        notes: "работать аккуратно",
        outstanding: "пользователь 1",
        director: "пользователь 2",
        maker: "пользователь 2",
        customer: "АЭС",
        executor: "АЭС",
        startPlan: "2024.04.03",
        endPlan: "2024.04.03",
        startActual: "2024.04.03",
        endActual: "2024.04.03",
        state: "В Ожидании",
    },
    {
        numberOutfits: "210",
        view: "Дознаряд",
        name: "работа 5",
        notes: "работать аккуратно",
        outstanding: "пользователь 1",
        director: "пользователь 2",
        maker: "пользователь 2",
        customer: "Росатом",
        executor: "АЭС",
        startPlan: "2024.04.03",
        endPlan: "2024.04.03",
        startActual: "2024.04.03",
        endActual: "2024.04.03",
        state: "В Ожидании",
    },
];

const Tooltip: React.FC<{ text: string; children: any }> = ({ text, children }) => {
    return (
        <span className="tooltip" title={text}>
            {children}
        </span>
    );
};
interface ISiz {
    id: string;
    name: string;
}
interface IBrigade {
    fio: string;
    number: string;
    criteriiODK: string;
    director: boolean;
    manufacturer: boolean;
}

interface IStateDos {
    numberDos: string | undefined;
    name: string | undefined;
    title: string | undefined;
    note: string | undefined;
    outstanding: string | undefined;
    custromer: string | undefined;
    executor: string | undefined;
    startPlan: string | undefined;
    endPlan: string | undefined;
    startFact: string | undefined;
    endFact: string | undefined;
    status: string | undefined;
    codeWork: string | undefined;
    codeEquipment: string | undefined;
    codeSystem: string | undefined;
    siz: ISiz[] | undefined;
    tehEvent: ISiz[] | undefined;
    brigade: IBrigade[] | undefined;
}

const ListDosOutfit: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [statusData, setStatusData] = useState<IStatusDos[] | undefined>([]);
    const [visibleModal, setVisibleModal] = useState(false);

    const [state, setState] = useState<IWorkPermitAll[]>([]);

    useEffect(() => {
        (async () => {
            const status = await fetchStatus();
            setStatusData(status);
        })();

        //Принимаю данные для загрузки в таблицу
        const loadDataTable = async () => {
            try {
                const fetchedWorks = await getListDos();

                if (fetchedWorks && fetchedWorks.length > 0) {
                    setState(fetchedWorks);
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadDataTable();
    }, [visibleModal]);

    const [selectedOutfitNumber, setSelectedOutfitNumber] = useState("");

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [selectedState, setSelectedState] = useState<string>("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedState(event.target.value);
    };

    const sortedData = () => {
        // Фильтрация данных по поисковому запросу
        let filteredData = state.filter((item) =>
            Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Если выбрано состояние для фильтрации, применяем его
        if (selectedState) {
            filteredData = filteredData.filter((item) => item.status === selectedState);
        }

        return filteredData;
    };

    /////////////////////// MENU ////////////////////////////
    const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});

    const toggleMenu = (transactionId: string) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [transactionId]: !prevState[transactionId],
        }));
    };

    const closeMenu = (transactionId: string) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [transactionId]: false,
        }));
    };
    const handleDocumentClick = (event: MouseEvent) => {
        // закрываем меню, если клик произошел вне меню
        Object.keys(menuVisible).forEach((key) => {
            if (menuVisible[key] && menuRefs[key]) {
                const menuRef = menuRefs[key];
                if (menuRef && menuRef.contains && !menuRef.contains(event.target as Node)) {
                    closeMenu(key);
                }
            }
        });
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleDocumentClick);
        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, [menuVisible]);
    // Refs for menu elements
    const menuRefs: { [key: string]: HTMLDivElement | null } = {};

    ////////////////////////////////////////////////////

    // Модальное окно на закрытие наряда
    const handlePrintButtonClick = (numberOutfits: string) => {
        setSelectedOutfitNumber(numberOutfits);
        setVisibleModal(true);
    };

    const downloadXLSX = () => {
        // Создание объекта рабочей книги
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Извлечение данных из таблицы HTML
        const table: HTMLTableElement | null = document.querySelector("table");
        if (!table) return; // Проверка наличия таблицы

        const rows: NodeListOf<HTMLTableRowElement> = table.querySelectorAll("tr");

        // Создание массива данных для листа
        const wsData: any[][] = [];

        // Добавление заголовков
        const headerRow: any[] = [];
        table.querySelectorAll("th").forEach((header) => {
            headerRow.push(header.textContent?.trim() ?? "");
        });
        wsData.push(headerRow);

        rows.forEach((row) => {
            const rowData: any[] = [];
            row.querySelectorAll("td").forEach((cell) => {
                rowData.push(cell.textContent?.trim() ?? ""); // Используем nullish coalescing для обработки пустых значений
            });
            wsData.push(rowData);
        });

        // Создание листа из массива данных
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);

        // Добавление листа к рабочей книге
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Сохранение рабочей книги в файл
        XLSX.writeFile(wb, "table_data.xlsx");
    };

    const viewDosList = (transaction: any) => {
        // Получаем массив значений radiationParameter для всех рабочих мест
        const radiationParameters = transaction.workplace.map((p: any) => p.radiationParameter);

        // Проходим по каждому значению и вызываем функцию handleRadiationParameterChanges
        radiationParameters.forEach((parameter: any, index: any) => {
            // Вызываем функцию handleRadiationParameterChanges
            const calculatedTime = handleRadiationParameterChanges(parameter);

            // Обновляем свойство time в объекте workplace в объекте transaction
            transaction.workplace[index].time = calculatedTime;
        });
        console.log(transaction);

        // После обновления объекта transaction, передаем его в функцию dispatch
        dispatch(setWorkPermit(transaction));
        dispatch(setStatusView({ statusView: "Просмотр" }));
        closeMenu(transaction.numberDos);
        navigate("/dosimetric_outfit/create", {
            replace: true,
        });
    };

    return (
        <>
            <div className="flex justify-center font-roboto font-bold text-black text-2xl">
                <h1 className="mt-2 mb-2">Дознаряды</h1>
            </div>

            <div className="flex items-center rounded-md border-sky-300 border-2 p-3 shadow-md ">
                <label className="block m-2 text-sm font-medium text-black">Список дозиметрических нарядов</label>

                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <FaSearch className="text-black/50" />
                    </div>

                    <input
                        value={searchTerm}
                        onChange={handleSearchChange}
                        type="text"
                        id="search"
                        className="input border border-slate-700 text-black  placeholder-black/50 block w-full ps-10 p-2.5"
                        placeholder="Поиск..."
                    />
                </div>

                <span className=" text-black ml-5 mr-5">Сортировка по статусу</span>
                <select
                    value={selectedState}
                    onChange={handleSelectChange}
                    className="input min-w-[150px] border-slate-700 text-black "
                >
                    <option value="" className="text-black">
                        Все состояния
                    </option>
                    {Array.from(new Set(statusData?.map((item) => item.nameStatus))).map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
            </div>

            <div className="my-5 ">
                <div className="border-sky-300 border-2 overflow-auto mt-1  p-6 rounded-md shadow-md">
                    <div className=" ">
                        <button
                            onClick={downloadXLSX}
                            className={`flex  ml-auto gap-2 mt-[-20px] bg-blue-700  p-1 mb-1  rounded-md`}
                        >
                            <BsFiletypeXlsx size={20} />
                        </button>
                    </div>
                    <table className="w-full border-collapse border border-gray-300 ">
                        <thead>
                            <tr className="cursor-pointer  bg-white " data-tooltip-target="tooltip-default">
                                <th className="font-bold text-left border text-black border-gray-300 px-4 py-2 ">
                                    <Tooltip text="Сортировка">№ наряда</Tooltip>
                                </th>
                                <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                    <Tooltip text="Сортировка">Вид</Tooltip>
                                </th>
                                <th className="font-bold text-left border text-black min-w-[350px] border-gray-300 px-4 py-2">
                                    <Tooltip text="Сортировка">Наименование</Tooltip>
                                </th>
                                {/* <th className="font-bold text-left border border-gray-300 px-4 py-2">Примечание</th> */}
                                <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                    Выдающий
                                </th>
                                {/* <th className="font-bold text-left border border-gray-300 px-4 py-2">Руководитель</th>
                                <th className="font-bold text-left border border-gray-300 px-4 py-2">Производитель</th> */}
                                <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                    Заказчик
                                </th>
                                <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                    Исполнитель
                                </th>
                                {/*<th className="font-bold text-left border border-gray-300 px-4 py-2">
                                    <Tooltip text="Сортировка">Начало план.</Tooltip>
                                </th>
                                <th className="font-bold text-left border border-gray-300 px-4 py-2">
                                    <Tooltip text="Сортировка">Окончание план.</Tooltip>
                                </th>
                                <th className="text-bold text-left border border-gray-300 px-4 py-2">
                                    <Tooltip text="Сортировка">Начала работы факт.</Tooltip>
                                </th>
                                <th className="text-bold text-left border border-gray-300 px-4 py-2">
                                    <Tooltip text="Сортировка">Окончание работы факт.</Tooltip>
                                </th>*/}
                                <th className="text-bold text-left border text-black border-gray-300 px-4 py-2 ">
                                    <Tooltip text="Сортировка">Состояние</Tooltip>
                                </th>
                                <th className="text-bold text-left border border-gray-300 px-4 py-2 "></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData().map((transaction, idx) => (
                                <tr key={idx} className="cursor-pointer bg-white  hover:bg-black/10 whitespace-nowrap ">
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {transaction.numberDos}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">{transaction.name}</td>
                                    <td className="border text-black border-gray-300 px-4 py-2">{transaction.title}</td>
                                    {/* <td className="border border-gray-300 px-4 py-2">{transaction.note}</td> */}
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {transaction.outstanding}
                                    </td>
                                    {/*  */}
                                    {/* <td className="border border-gray-300 px-4 py-2">
                                        {" "}
                                        {transaction.brigade.find((member) => member.director)?.fio || ""}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {transaction.brigade.find((member) => !member.director)?.fio || ""}
                                    </td> */}
                                    {/*  */}
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {transaction.custromer}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {transaction.executor}
                                    </td>
                                    {/* <td className="border border-gray-300 px-4 py-2">{transaction.startPlan}</td>
                                    <td className="border border-gray-300 px-4 py-2">{transaction.endPlan}</td>
                                    <td className="border border-gray-300 px-4 py-2">{transaction.startFact}</td>
                                    <td className="border border-gray-300 px-4 py-2">{transaction.endFact}</td> */}
                                    <td
                                        className={`border text-black border-gray-300 px-4 py-2 text-sm font-bold  ${
                                            transaction.status === "В работе"
                                                ? "text-yellow-500  "
                                                : transaction.status === "Подготовлен"
                                                ? "text-orange-500"
                                                : transaction.status === "В Ожидании"
                                                ? "text-blue-500"
                                                : transaction.status === "Закрыт"
                                                ? "text-gray-500"
                                                : transaction.status === "Допущен к подготовке"
                                                ? "text-green-500"
                                                : ""
                                        }`}
                                    >
                                        {transaction.status}
                                    </td>

                                    <td className="border border-gray-300 px-4 py-2 ">
                                        <div className="relative">
                                            <button
                                                className="flex ml-auto gap-2  text-white py-2 px-4 rounded-md bg-gray-500 hover:bg-gray-800"
                                                onClick={() => toggleMenu(transaction.numberDos.toString())}
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            {/* МЕНЮ по кнопке */}
                                            {menuVisible[transaction.numberDos] && (
                                                <div
                                                    className="absolute z-10 top-full right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
                                                    ref={(ref) => (menuRefs[transaction.numberDos] = ref)}
                                                >
                                                    <ul className="">
                                                        <li>
                                                            <div className="bg-gray-200   rounded-md ">
                                                                <button
                                                                    onClick={() => viewDosList(transaction)}
                                                                    className="w-full text-left py-2 px-4 text-black  hover:bg-white/50 "
                                                                >
                                                                    <FaFile className="inline-block mr-2" /> Просмотр
                                                                </button>
                                                            </div>
                                                        </li>
                                                        {transaction.status == "Допущен к подготовке" && (
                                                            <li>
                                                                <div className="bg-gray-200   rounded-md  ">
                                                                    <button
                                                                        className="w-full text-black text-left py-2 px-4 hover:bg-white/50"
                                                                        onClick={() => {
                                                                            dispatch(
                                                                                setStatusView({
                                                                                    statusView: "Подготовка",
                                                                                })
                                                                            );
                                                                            dispatch(setWorkPermit(transaction));
                                                                            closeMenu(transaction.numberDos);
                                                                            navigate("/dosimetric_outfit/create", {
                                                                                replace: true,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <FaFilePen className="inline-block mr-2" />{" "}
                                                                        Подготовка
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        )}

                                                        {transaction.status === "В Ожидании" && (
                                                            <li>
                                                                <div className="bg-gray-200 rounded-md  ">
                                                                    <button
                                                                        className="w-full text-left text-black py-2 px-4 hover:bg-white/50"
                                                                        onClick={() => {
                                                                            handlePrintButtonClick(
                                                                                transaction.numberDos
                                                                            );
                                                                            closeMenu(transaction.numberDos);
                                                                        }}
                                                                    >
                                                                        <FaTimes className="inline-block mr-2" />{" "}
                                                                        Закрытие наряда
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    className="flex gap-3  justify-end mt-4 items-center "
                    activeClassName=" bg-green-500 h-6  text-white rounded-sm"
                    pageLinkClassName="text-black  rounded border-sky-300 border-2 text-xs py-1 px-2 rounded-sm"
                    previousClassName="text-black bg-white rounded border-sky-300 border-2 py-1 px-2 bg-sky-600 rounded-sm text-xs"
                    nextClassName="text-black  py-1 px-2 rounded border-sky-300 border-2 rounded-sm text-xs"
                    disabledClassName="text-black bg-gray-400 rounded border-sky-300 border-2 cursor-not-allowed"
                    disabledLinkClassName="text-slate-600  cursor-not-allowed"
                    pageCount={1}
                    pageRangeDisplayed={1}
                    marginPagesDisplayed={2}
                    previousLabel={"Предыдущая"}
                    nextLabel={"Следующая"}
                />
            </div>

            {/* Add Category Modal */}
            {visibleModal && (
                <CloseOutfitsModal type="post" id={selectedOutfitNumber} setVisibleModal={setVisibleModal} />
            )}
        </>
    );
};

export default ListDosOutfit;
