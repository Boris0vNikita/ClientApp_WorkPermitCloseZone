import React, { useEffect, useState } from "react";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { IoHandRightSharp } from "react-icons/io5";
import Select from "react-select";
import * as XLSX from "xlsx";
import { IIssuePeople, IPeopleFio } from "../types/types";
import { deleteIssue, fetchFioPerson, fetchIssueAll, getTotalPage, postIssue, updateIssue } from "../API/getStatus";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { MdDelete } from "react-icons/md";

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        minWidth: 250, // Устанавливаем минимальную ширину в 200px
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#0284c7" : "white",
        color: state.isSelected ? "white" : "black",
    }),
    multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: "#0284c7",
        color: "white",
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: "white",
        ":hover": {
            backgroundColor: "#0284c7",
            color: "white",
        },
    }),
};

const MyComponent: React.FC = () => {
    const [fetchedWorks, setFetchedWorks] = useState<IPeopleFio[]>([]);
    const [selectedOption, setSelectedOption] = useState<IPeopleFio | null>(null);
    const [reason, setReason] = useState<string>("");
    //пагинация
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    //data Table
    const [dataPeople, setDataPeople] = useState<IIssuePeople[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getTotalPage();
            if (response !== undefined) {
                setTotalPage(response); // Устанавливаем общее количество страниц
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchFioPerson();
            if (data) {
                setFetchedWorks(data);
            }
        };
        fetchData();
        const getData = async () => {
            const data = await fetchIssueAll(pageNumber);
            if (data) {
                setDataPeople(data);
            }
        };
        getData();
    }, [pageNumber]); // Выполняем загрузку данных при монтировании компонента

    const handleSelectChange = (selected: IPeopleFio | null) => {
        setSelectedOption(selected);
    };
    const handlePageChange = async ({ selected }: { selected: number }) => {
        const newPageNumber = selected + 1; // Увеличиваем номер страницы на 1
        try {
            const newData = await fetchIssueAll(newPageNumber);
            if (newData) {
                setDataPeople(newData);
                setPageNumber(newPageNumber); // Обновляем номер страницы в состоянии
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReason(event.target.value);
    };
    const handleAddButtonClick = async () => {
        if (!selectedOption || !reason) return toast.error("Заполните все поля");

        const newIssueData = {
            fio: selectedOption.fio || "",
            number: selectedOption.personnel_number || "",
            date: new Date().toLocaleDateString(),
            reason: reason,
            license: true,
        };

        try {
            await postIssue(newIssueData);
            const response = await getTotalPage();
            if (response !== undefined) {
                setTotalPage(response); // Устанавливаем общее количество страниц
            }

            const newData = await fetchIssueAll(pageNumber);
            if (newData) {
                setDataPeople(newData);
            }
        } catch (error) {
            console.error("Error adding issue:", error);
        }
    };

    const updateData = async (number: string, license: boolean) => {
        await updateIssue(number, license); // Ждем завершения обновления на сервере
        const newData = await fetchIssueAll(pageNumber); // Получаем новые данные
        if (newData) {
            setDataPeople(newData); // Обновляем состояние с новыми данными
        }
    };
    const deleteData = async (number: string) => {
        await deleteIssue(number); // Ждем завершения обновления на сервере
        const newData = await fetchIssueAll(pageNumber); // Получаем новые данные
        if (newData) {
            setDataPeople(newData); // Обновляем состояние с новыми данными
        }
    };

    const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
    const downloadXLSX = () => {
        // Создание объекта рабочей книги
        const wb = XLSX.utils.book_new();

        // Создание массива данных для листа
        const wsData = [
            ["ФИО", "Табл.№", "Дата выдачи", "Основание", "Статус права"],
            ...dataPeople?.map((person) => [
                person.fio,
                person.number,
                person.date,
                person.reason,
                person.license ? "Активно" : "Неактивно",
            ]),
        ];

        // Создание листа из массива данных
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Добавление листа к рабочей книге
        XLSX.utils.book_append_sheet(wb, ws, "People");

        // Сохранение рабочей книги в файл
        XLSX.writeFile(wb, "people.xlsx");
    };

    return (
        <>
            <div className="flex justify-center font-roboto font-bold text-black text-2xl">
                <span className="mt-2 mb-2">Управление правами выдающие дознаряд</span>
            </div>
            <div className="flex border-sky-300 border-2 rounded-md p-2 shadow-md ">
                <div className="grid">
                    <span className="text-black">Сотрудник</span>
                    <Select
                        styles={customStyles}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        options={fetchedWorks} // Передаем полученные данные в качестве опций
                        getOptionLabel={(option) => option.fio}
                        getOptionValue={(option) => option.personnel_number}
                        formatOptionLabel={(option) => (
                            <div>
                                <span>{option.fio}</span>
                                <span className="text-gray-500 text-sm ml-1">({option.personnel_number})</span>
                            </div>
                        )}
                        placeholder="Выберите сотрудника"
                        isClearable
                    />
                    {selectedOption && (
                        <div className="hidden">
                            <h2 className="text-black">Selected Option:</h2>
                            <p>{selectedOption.fio}</p>
                            <p>{selectedOption.personnel_number}</p>
                        </div>
                    )}
                </div>
                <div className="grid ml-2">
                    <span className="ml-2">Основание</span>
                    <div className="flex">
                        <input
                            type="text"
                            id="email-address-icon"
                            className="input border text-black border-slate-300 placeholder-black/50 mx-2 min-w-[600px]"
                            placeholder="Основание..."
                            value={reason}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="grid justify-center items-end ">
                    <button
                        className="flex m-1 text-white py-2 px-4 rounded-md items-center bg-green-400 hover:bg-lime-500"
                        onClick={handleAddButtonClick}
                    >
                        <span className="text-sm font-medium text-white">Добавить выдающего</span>
                        <FaPlus className="mt-0.5 ml-1" size={20} />
                    </button>
                </div>
            </div>
            <div className="grid w-full">
                {/* TABLE */}
                <div className="my-5">
                    <div className="border-sky-300 border-2 shadow-md overflow-auto p-4 rounded-md">
                        <div className="justify-between ">
                            <span className="ml-auto ">Сотрудники с правом выдачи</span>
                            <div className="relative ">
                                <button
                                    className={`flex ml-auto gap-2 mt-[-20px] bg-blue-700  p-1 mb-1  rounded-md`}
                                    onClick={downloadXLSX}
                                >
                                    <BsFiletypeXlsx size={20} />
                                </button>
                            </div>
                        </div>
                        <table className="border-collapse border border-gray-300 w-full">
                            <thead>
                                <tr className=" bg-white" data-tooltip-target="tooltip-default">
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        ФИО
                                    </th>
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        Таб.№
                                    </th>
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        Дата выдачи
                                    </th>
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        Основание
                                    </th>
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        Права
                                    </th>
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataPeople?.map((person, idx) => (
                                    <tr key={idx} className=" bg-white  hover:bg-black/10 whitespace-nowrap">
                                        <td className="border text-black border-gray-300 px-4 py-2">{person.fio}</td>
                                        <td className="border text-black border-gray-300 px-4 py-2">{person.number}</td>
                                        <td className="border text-black border-gray-300 px-4 py-2">{person.date}</td>
                                        <td className="border text-black border-gray-300 px-4 py-2">{person.reason}</td>
                                        <td className="border text-black border-gray-300 px-4 py-2 text-center flex items-center justify-center">
                                            <div className="relative">
                                                <button
                                                    className={`flex ml-auto gap-2 py-2 px-4 rounded-md ${
                                                        person.license ? "text-green-500" : " text-rose-500"
                                                    }`}
                                                    onMouseEnter={() => setTooltipIndex(idx)}
                                                    onMouseLeave={() => setTooltipIndex(null)}
                                                    onClick={() => updateData(person.number, person.license)}
                                                >
                                                    <IoHandRightSharp className="cursor-pointer" size={20} />
                                                </button>
                                                {tooltipIndex === idx && (
                                                    <span className="absolute bottom-full bg-gray-800 text-white text-xs px-2 py-1 rounded-md">
                                                        {person.license ? "Забрать Права" : "Дать права"}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center  items-center justify-center">
                                            <button
                                                onClick={() => deleteData(person.number)}
                                                className="gap-2 py-2 px-4 rounded-md text-rose-500"
                                            >
                                                <MdDelete className="cursor-pointer" size={22} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ReactPaginate
                className="flex gap-3 justify-end items-center"
                activeClassName=" bg-green-500 h-6  text-white rounded-sm"
                pageLinkClassName="text-black  rounded border-sky-300 border-2 text-xs py-1 px-2 rounded-sm"
                previousClassName="text-black bg-white rounded border-sky-300 border-2 py-1 px-2 bg-sky-600 rounded-sm text-xs"
                nextClassName="text-black  py-1 px-2 rounded border-sky-300 border-2 rounded-sm text-xs"
                disabledClassName="text-black bg-gray-400 rounded border-sky-300 border-2 cursor-not-allowed"
                disabledLinkClassName="text-slate-600  cursor-not-allowed"
                pageCount={totalPage} // Замените на общее количество страниц, которое получаете с сервера
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                previousLabel={"Предыдущая"}
                nextLabel={"Следующая"}
            />
        </>
    );
};

export default MyComponent;
