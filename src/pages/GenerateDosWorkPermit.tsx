import { useEffect, useState } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import Select from "react-select";
import { IEquipment, IPeopleFio, IPeopleFioNumber, ISystem, IWork } from "../types/types";
import {
    fetchEquipment,
    fetchFioPerson,
    fetchSystem,
    fetchWork,
    getListDos,
    getTrueIssue,
    postDos,
} from "../API/getStatus";
import { MdDelete } from "react-icons/md";
import "../index.css";
const customStyles = {
    control: (provided: any) => ({
        ...provided,
        minWidth: 250, // Устанавливаем минимальную ширину в 200px
        maxWidth: 350,
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

interface ICriteriODK {
    label: string;
    title: string;
}

const criteriODK: ICriteriODK[] = [
    { label: "E, мЗв", title: "E, мЗв" },
    { label: "n, мЗв", title: "n, мЗв" },
];
interface IPost {
    label: string;
    title: string;
}
const post = [
    { label: "Руководитель", title: "Руководитель" },
    { label: "Производитель", title: "Производитель" },
];
interface ICustomer {
    id: string;
    name: string;
}
const customers = [
    { id: "1", name: "АЭС" },
    { id: "2", name: "РосАтом" },
];
const zonas = [
    { id: "1", name: "Энергоблок №1" },
    { id: "2", name: "Комната №1" },
];
const workZonas = [
    { id: "1", name: "АЭС" },
    { id: "2", name: "Коридор" },
    { id: "3", name: "Помещение" },
];
const workEquips = [
    { id: "1", name: "Детектор" },
    { id: "2", name: "Диагностический комплект" },
    { id: "3", name: "Комплект ЗИП" },
];

interface DataTableItem {
    osn: string;
    room: string;
    equipment: string;
    equipmentText: string;
}

const initialDataTable: DataTableItem[] = [];

interface DataTableRow {
    number: number;
    supervisor: string;
    producer: string;
    personnelNumber: string;
    fullName: string;
    criterion: string;
}

interface IStateWorks {
    selectedWorkId: string | undefined;
    works: IWork[] | undefined;
    selectedWorkTitle: string | undefined;
}

interface IStateEquipment {
    selectedEquipmentId: string | undefined;
    equipments: IEquipment[] | undefined;
    selectedEquipmentTitle: string | undefined;
}

interface IStateSystem {
    selectedSystemId: string | undefined;
    systems: ISystem[] | undefined;
    selectedESystemTitle: string | undefined;
}

interface UserCriteria {
    criteriiODK: string;
    director: boolean;
    fio: string;
    manufacturer: boolean;
    number: string;
}

const GenerateDosWorkPermit = () => {
    /////////////     radiobuttons     ///////////////////////////
    const [selectedType, setSelectedType] = useState("Дознаряд");

    // Обработчик изменения выбранного типа наряда
    const handleTypeChange = (e: any) => {
        setSelectedType(e.target.value);
    };

    /////////////    title    ////////////////////
    // Состояние для хранения значения поля "Наименование"
    const [titleState, setTitle] = useState("");

    // Обработчик изменения значения поля "Наименование"
    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    };
    /////////////////    ПРИМЕЧАНИЕ (note)   ///////////////////////////
    // Состояние для хранения значения поля "Примечание"
    const [notes, setNotes] = useState("");

    // Обработчик изменения значения поля "Примечание"
    const handleNotesChange = (e: any) => {
        setNotes(e.target.value);
    };

    //////////// DATE START /////////
    // Состояние для хранения значения поля "Дата начала плана"
    const [stateStartPlan, setStartPlan] = useState("");

    // Обработчик изменения значения поля "Дата начала плана"
    const handleStartPlanChange = (e: any) => {
        setStartPlan(e.target.value);
    };

    //////////// DATE END  ////////////
    // Состояние для хранения значения поля "Дата окончания плана"
    const [stateEndPlan, setEndPlan] = useState("");

    // Обработчик изменения значения поля "Дата окончания плана"
    const handleEndPlanChange = (e: any) => {
        setEndPlan(e.target.value);
    };

    ////////

    //Combobox WORK
    const [state, setState] = useState<IStateWorks>({} as IStateWorks);

    useEffect(() => {
        const loadWorks = async () => {
            try {
                const fetchedWorks = await fetchWork();
                if (fetchedWorks && fetchedWorks.length > 0) {
                    setState({ ...state, works: fetchedWorks });
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadWorks();
    }, []);

    useEffect(() => {
        if (state.works) {
            setState({ ...state, selectedWorkId: state.works[0].id });
            setState({ ...state, selectedWorkTitle: `[${state.works[0].id}] - ${state.works[0].title}` });
        }
    }, [state.works]);

    const handleChangeWork = (e: any) => {
        setState({ ...state, selectedWorkId: e.target.value });
        const finded = state.works?.find((s) => s.id === e.target.value);
        setState({ ...state, selectedWorkTitle: `[${e.target.value}] - ${finded?.title}` });
    };

    ////////////////////Заказчик////////////////
    const [stateCustromer, setStateCustromer] = useState<{
        selectedCustomer: ICustomer | null;
        customers: ICustomer[];
    }>({
        selectedCustomer: null,
        customers: customers,
    });

    const handleChangeCustromers = (event: any) => {
        const selectedCustomerId = event.target.value;
        const selectedCustomer = stateCustromer.customers.find((customer) => customer.id === selectedCustomerId);

        setStateCustromer((prevState: any) => ({
            ...prevState,
            selectedCustomer: selectedCustomer,
        }));

        //console.log("Выбранный клиент:", selectedCustomer?.name);
    };
    ///////////Зона///////////
    const [stateZona, setStateZona] = useState<{
        selectedZona: ICustomer | null;
        zonas: ICustomer[];
    }>({
        selectedZona: null,
        zonas: zonas,
    });

    const handleChangeZona = (event: any) => {
        const selectedZonaId = event.target.value;
        const selectedZona = stateZona.zonas.find((customer) => customer.id === selectedZonaId);

        setStateZona((prevState: any) => ({
            ...prevState,
            selectedZona: selectedZona,
        }));

        //console.log("Выбранный клиент:", selectedCustomer?.name);
    };

    //////////////////Рабочее место////////////////////
    const [stateWorkZona, setStateWorkZona] = useState<{
        selectedWorkZona: ICustomer | null;
        workZonas: ICustomer[];
    }>({
        selectedWorkZona: null,
        workZonas: workZonas,
    });

    const handleChangeWorkZonas = (event: any) => {
        const selectedWorkZonaId = event.target.value;
        const selectedWorkZona = stateWorkZona.workZonas.find((customer) => customer.id === selectedWorkZonaId);

        setStateWorkZona((prevState: any) => ({
            ...prevState,
            selectedWorkZona: selectedWorkZona,
        }));

        //console.log("Выбранный клиент:", selectedCustomer?.name);
    };

    ///////////Рабочее Оборудование///////

    const [stateWorkEquip, setStateWorkEquip] = useState<{
        selectedWorkEquip: ICustomer | null;
        workEquips: ICustomer[];
    }>({
        selectedWorkEquip: null,
        workEquips: workEquips,
    });

    const handleChangeWorkEquip = (event: any) => {
        const selectedWorkEquipId = event.target.value;
        const selectedWorkEquip = stateWorkEquip.workEquips.find((customer) => customer.id === selectedWorkEquipId);

        setStateWorkEquip((prevState: any) => ({
            ...prevState,
            selectedWorkEquip: selectedWorkEquip,
        }));

        //console.log("Выбранный клиент:", selectedCustomer?.name);
    };
    //////////////////////Исполнитель///////////////////

    const [stateExecuter, setStateExecuter] = useState<{
        selectedCustomer: ICustomer | null;
        customers: ICustomer[];
    }>({
        selectedCustomer: null,
        customers: customers,
    });

    const handleChangeExecuter = (event: any) => {
        const selectedCustomerId = event.target.value;
        const selectedCustomer = stateCustromer.customers.find((customer) => customer.id === selectedCustomerId);

        setStateExecuter((prevState: any) => ({
            ...prevState,
            selectedCustomer: selectedCustomer,
        }));

        //console.log("Выбранный исполнитель:", selectedCustomer?.name);
    };
    /////////////////////

    //Combobox EQUIPMENT
    const [stateEquipment, setStateEquipment] = useState<IStateEquipment>({} as IStateEquipment);

    useEffect(() => {
        const loadWorks = async () => {
            try {
                const fetchedWorks = await fetchEquipment();
                if (fetchedWorks && fetchedWorks.length > 0) {
                    setStateEquipment({ ...stateEquipment, equipments: fetchedWorks });
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadWorks();
    }, []);

    useEffect(() => {
        if (stateEquipment.equipments) {
            setStateEquipment({ ...stateEquipment, selectedEquipmentId: stateEquipment.equipments[0].id });
            setStateEquipment({
                ...stateEquipment,
                selectedEquipmentTitle: `[${stateEquipment.equipments[0].id}] - ${stateEquipment.equipments[0].title}`,
            });
        }
    }, [stateEquipment.equipments]);

    const handleChangeEquipment = (e: any) => {
        setStateEquipment({ ...stateEquipment, selectedEquipmentId: e.target.value });
        const finded = stateEquipment.equipments?.find((s) => s.id === e.target.value);
        setStateEquipment({ ...stateEquipment, selectedEquipmentTitle: `[${e.target.value}] - ${finded?.title}` });
    };
    ////////////////

    //Combobox SYSTEM
    const [stateSystem, setStateSystem] = useState<IStateSystem>({} as IStateSystem);

    useEffect(() => {
        const loadWorks = async () => {
            try {
                const fetchedWorks = await fetchSystem();
                if (fetchedWorks && fetchedWorks.length > 0) {
                    setStateSystem({ ...stateSystem, systems: fetchedWorks });
                } else {
                    console.error("No works found.");
                }
            } catch (error) {
                console.error("Error loading works:", error);
            }
        };

        loadWorks();
    }, []);

    useEffect(() => {
        if (stateSystem.systems) {
            setStateSystem({ ...stateSystem, selectedSystemId: stateSystem.systems[0].id });
            setStateSystem({
                ...stateSystem,
                selectedESystemTitle: `[${stateSystem.systems[0].id}] - ${stateSystem.systems[0].title}`,
            });
        }
    }, [stateSystem.systems]);

    const handleChangeSystem = (e: any) => {
        setStateSystem({ ...stateSystem, selectedSystemId: e.target.value });
        const finded = stateSystem.systems?.find((s) => s.id === e.target.value);
        setStateSystem({ ...stateSystem, selectedESystemTitle: `[${e.target.value}] - ${finded?.title}` });
    };
    ////////////////

    //Select Критериев
    const [selectedCriterii, setSelectedCriterii] = useState<ICriteriODK | null>(null);

    //Select Должности
    const [selectedPost, setSelectedCPost] = useState<IPost | null>(null);

    // Добавление в таблицу руководителей - исполнителей
    const [dataTable, setDataTable] = useState<DataTableRow[]>([]);
    const [rowCounter, setRowCounter] = useState(1);

    const [fetchedWorks, setFetchedWorks] = useState<IPeopleFioNumber[]>([]);
    const [selectedOptionIssue, setSelectedOptionIssue] = useState<IPeopleFioNumber | null>(null);
    const [fetchedPeopleGroup, setFetchedPeopleGroup] = useState<IPeopleFio[]>([]);
    const [selectedOptionGroup, setSelectedOptionGroup] = useState<IPeopleFio | null>(null);
    const handleSelectChangeIssue = (selected: IPeopleFioNumber | null) => {
        setSelectedOptionIssue(selected);
    };
    const handleSelectChangeGroup = (selected: IPeopleFio | null) => {
        setSelectedOptionGroup(selected);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTrueIssue();

            if (data) {
                setFetchedWorks(data);
            }
        };
        fetchData();
        const getData = async () => {
            const data = await fetchFioPerson();
            if (data) {
                setFetchedPeopleGroup(data);
            }
        };
        getData();
    }, []);

    const [criteriiODKValues, setCriteriiODKValues] = useState(Array(dataTable.length).fill("")); // Инициализируем массив значений

    const handleCriteriiODKChange = (idx: any, value: any) => {
        const newCriteriiODKValues = [...criteriiODKValues];
        newCriteriiODKValues[idx] = value;
        setCriteriiODKValues(newCriteriiODKValues);
    };

    const handleAddButtonClick = () => {
        if (selectedOptionGroup && selectedCriterii && selectedPost) {
            const newRow: DataTableRow = {
                number: rowCounter,
                supervisor: selectedPost.label === "Руководитель" ? "+" : "",
                producer: selectedPost.label === "Производитель" ? "+" : "",
                personnelNumber: selectedOptionGroup.personnel_number,
                fullName: selectedOptionGroup.fio,
                criterion: selectedCriterii.title,
            };
            setDataTable([...dataTable, newRow]);
            setRowCounter(rowCounter + 1);
        }
    };

    // Добавление в таблицу Помещений
    const [workPlace, setWorkPlace] = useState<string>("");
    const [equip, setEquip] = useState<string>("");
    const [equipText, setEquipText] = useState<string>("");
    const [inputCriteriiODK, setInputCriteriiODK] = useState<string>("");

    //Добавление поля в таблицу по input
    const [dataTableWork, setDataTableWork] = useState<DataTableItem[]>(initialDataTable);

    const [isMainRoom, setIsMainRoom] = useState(false); // Состояние для чекбокса

    const handleCheckboxChange = (event: any) => {
        setIsMainRoom(event.target.checked);
    };
    const handleAddData = () => {
        if (!stateWorkZona.selectedWorkZona || !stateWorkEquip.selectedWorkEquip) {
            toast.error("Не все поля заполнены");
            return;
        }

        const newData: DataTableItem = {
            osn: isMainRoom ? "+" : "", // Значение для поля "Осн." определяется состоянием чекбокса
            room: stateWorkZona.selectedWorkZona.name,
            equipment: stateWorkEquip.selectedWorkEquip.name,
            equipmentText: "",
        };

        setDataTableWork((prevData) => [...prevData, newData]);

        // Очистка полей ввода после добавления (если это требуется)
        setIsMainRoom(false); // Сбрасываем состояние чекбокса

        console.log(dataTableWork);
    };
    //////////////////////////////////////
    // Переписать это код потом на главную кнопку сохранить в самом низу
    const handleEquipmentTextChange = (idx: number, newText: string) => {
        setDataTableWork((prevData) =>
            prevData.map((item, index) => (index === idx ? { ...item, equipmentText: newText } : item))
        );
    };

    const deleteData = (index: number) => {
        setDataTable((prevData) => prevData.filter((_, idx) => idx !== index));
    };
    ////////////////////////////////////////

    const globalSaveDos = async () => {
        if (
            !stateWorkZona.selectedWorkZona ||
            !stateWorkEquip.selectedWorkEquip ||
            !dataTableWork.length ||
            !selectedOptionGroup ||
            !selectedCriterii ||
            !selectedPost ||
            !dataTable.length ||
            !selectedOptionIssue
        ) {
            toast.error("Заполните все поля");
            return;
        }
        const dataDosAll = await getListDos();
        if (!dataDosAll) {
            return;
        }
        const lastDos = dataDosAll[dataDosAll.length - 1];

        // Получаем текущий номер numberDos
        const currentNumber = lastDos.numberDos;

        // Разбиваем номер на части по тире
        const [numberPart, yearPart] = currentNumber.split("-");
        // Увеличиваем номер на единицу
        const nextNumber = `${parseInt(numberPart) + 1}-${yearPart}`;
        // Получаем последний объект из массива
        const numberDos = nextNumber;

        const name = selectedType;
        const title = titleState;
        const note = notes;
        const outstanding = selectedOptionIssue.fio;
        const custromer = stateCustromer?.selectedCustomer?.name; // name выбранного заказчика
        const executor = stateExecuter?.selectedCustomer?.name; // name выбранного исполнителя
        const startPlan = stateStartPlan;
        const endPlan = stateEndPlan;
        const startFact = stateStartPlan;
        const endFact = stateEndPlan;
        const status = "Допущен к подготовке";
        const codeWork = state.selectedWorkTitle;
        const codeEquipment = stateEquipment.selectedEquipmentTitle;
        const codeSystem = stateSystem.selectedESystemTitle;
        const codeW = codeWork?.replace(/\D+/g, ""); // Удаляем все нецифровые символы
        const codeE = codeEquipment?.replace(/\D+/g, "");
        const codeS = codeSystem?.replace(/\D+/g, "");
        const sizArray = {
            id: "",
            name: "",
        };
        const texArray = {
            id: "",
            name: "",
        };
        const brigade = dataTableWork.map((data, idx) => ({
            id: (idx + 1).toString(), // начинается с 1 и +1 к следующему
            name: data.osn, // Берем значение из поля "Помещение" текущего элемента
            room: data.room, // Фиксированное значение "АЭС"
            pieceEquipment: data.equipment, // Фиксированное значение "Оборудывание"
            equipment: data.equipmentText, // Берем значение из поля "Единицы (текст)" текущего элемента
            radiationParameter: "", // оставляем пустым
            time: "", // оставляем пустым
        }));
        const workplace = dataTable.map((data, idx) => {
            let director = false;
            let manufacturer = false;

            // Проверяем наличие плюса в поле "Рук."
            if (data.supervisor.includes("+")) {
                director = true;
            }

            // Проверяем наличие плюса в поле "Произв."
            if (data.producer.includes("+")) {
                manufacturer = true;
            }

            return {
                fio: `${data.fullName}`, // Собираем ФИО из полей "Рук." и "Произв."
                number: data.personnelNumber, // Берем значение из поля "Учетные номера"
                criteriiODK: criteriiODKValues[idx], // оставляем пустым
                director: director, // Устанавливаем значение в зависимости от наличия плюса в поле "Рук."
                manufacturer: manufacturer, // Устанавливаем значение в зависимости от наличия плюса в поле "Произв."
            };
        });

        const response = await postDos(
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
            codeW,
            codeE,
            codeS,
            sizArray,
            texArray,
            workplace,
            brigade
        );
    };

    return (
        <>
            <div className="flex justify-center font-roboto font-bold text-black text-2xl">
                <h1 className="mt-2 mb-2">Создание дозиметрических нарядов</h1>
            </div>
            {/* Первый блок */}
            <div className="flex border-sky-300 border-2 rounded-md shadow-md ">
                <div className="grid rounded-md border-2 m-3 p-1 ">
                    <span className="ml-1  text-black">Тип наряда</span>
                    <div className="grid min-w-[150px] p-1 ">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                checked={selectedType === "Дознаряд"}
                                onChange={handleTypeChange}
                                value={"Дознаряд"}
                                name="type"
                                className="form-radio  text-lime-500"
                            />
                            <span className="text-black">Дознаряд</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 mt-2 ">
                            <input
                                type="radio"
                                checked={selectedType === "Дозраспряжение"}
                                onChange={handleTypeChange}
                                value={"Дозраспряжение"}
                                name="type"
                                className="form-radio text-lime-500"
                            />
                            <span className="text-black">Дозраспряжение</span>
                        </label>
                    </div>
                </div>
                <div className="grid  m-3 p-1">
                    <span className="font-roboto mr-2 text-black">Номер наряда</span>
                    <input
                        disabled
                        type="text"
                        id="numberDos"
                        className="input text-black border max-h-[35px] w-[130px]  border-gray-300 placeholder-black/50 "
                        placeholder="[x-2024]"
                    />
                </div>
                <div className="grid  m-3 p-1">
                    <span className=" font-roboto mr-2 text-black">Номер сопутствующего наряда</span>
                    <input
                        type="text"
                        id="numberSopytDos"
                        className="input border max-h-[35px] min-w-[130px] text-black  border-gray-300 placeholder-black/50 "
                        placeholder="Сопутствующий наряд..."
                    />
                </div>
                <div className="grid  m-3 p-1">
                    <span className=" font-roboto mr-2 text-black">Состояние</span>
                    <input
                        disabled
                        type="text"
                        id="numberSopytDos"
                        className="input border text-black max-h-[35px] w-[230px]  border-gray-300"
                        value={"Допущен к подготовке"}
                    />
                </div>
            </div>
            {/* Второй блок */}
            <div className=" mt-3 p-3 border-sky-300 border-2 rounded-md shadow-md">
                <div className=" grid grid-cols-4  p-2">
                    <div className="grid col-span-1">
                        <span className="ml-1 mt-2.5  text-black">Заказчик</span>
                        <span className="ml-1 mt-2.5 text-black">В период с </span>
                        <span className="ml-1 mt-2.5 text-black">Мероприятие </span>
                    </div>
                    <div className="grid col-span-1">
                        <select
                            name="custromerss"
                            className="input border-1 text-black border-gray-300 max-w-[200px] bg-white cursor-pointer"
                            onChange={handleChangeCustromers}
                            value={stateCustromer.selectedCustomer ? stateCustromer.selectedCustomer.id : ""}
                            required
                        >
                            <option value="" disabled={stateCustromer.selectedCustomer !== null} className="text-black">
                                Выберите...
                            </option>
                            {stateCustromer.customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex  mt-1  max-w-[200px]">
                            <input
                                id="date"
                                type="date"
                                className="bg-gray-50 border  border-gray-300 text-black text-sm rounded-lg  block w-full   dark:text-black"
                                placeholder="Select date"
                                value={stateStartPlan} // Связываем значение поля с состоянием
                                onChange={handleStartPlanChange} // Обработчик изменения значения поля
                            />
                        </div>

                        <input
                            type="text"
                            id="numberSopytDos"
                            className="input text-black  mt-1 border max-h-[35px] max-w-[200px] placeholder-black/50  border-gray-300"
                            placeholder="Мероприятие..."
                        />
                    </div>
                    <div className="grid col-span-1">
                        <span className="ml-1 mt-2.5  text-black">Исполнитель</span>
                        <span className="ml-1 mt-2.5 text-black">По </span>
                        <span className="ml-1 mt-2.5 text-black">В зоне </span>
                    </div>
                    <div className="grid col-span-1">
                        <select
                            name="custromerss"
                            className="input border-1 border-gray-300 max-w-[200px] bg-white text-black cursor-pointer"
                            onChange={handleChangeExecuter}
                            value={stateExecuter.selectedCustomer ? stateExecuter.selectedCustomer.id : ""}
                            required
                        >
                            <option value="" className="text-black" disabled={stateExecuter.selectedCustomer !== null}>
                                Выберите...
                            </option>
                            {stateExecuter.customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex  mt-1  max-w-[200px]">
                            <input
                                id="date"
                                type="date"
                                className="bg-gray-50 border text-black  border-gray-300 block w-full  text-sm rounded-lg   dark:text-black"
                                placeholder="Select date"
                                value={stateEndPlan} // Связываем значение поля с состоянием
                                onChange={handleEndPlanChange} // Обработчик изменения значения поля
                            />
                        </div>

                        <select
                            name="zona"
                            className="input border-1 mt-1 text-black border-gray-300 max-w-[200px] bg-white cursor-pointer"
                            onChange={handleChangeZona}
                            value={stateZona.selectedZona ? stateZona.selectedZona.id : ""}
                            required
                        >
                            <option value="" className="text-black" disabled={stateZona.selectedZona !== null}>
                                Выберите...
                            </option>
                            {stateZona.zonas.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {/* Третий блок */}
            <div className="grid mt-3 p-3 border-sky-300 border-2 rounded-md shadow-md">
                <span className="ml-1 text-black">Поручается выполнить работу</span>
                <div className="grid grid-cols-2 border-2 rounded-md  ">
                    {/*Код работы */}
                    <div className="grid items-center rounded-md p-2">
                        <div className="flex justify-start items-center ">
                            <label className="block m-2 text-sm font-medium text-black">Код Работы:</label>
                            <div>
                                <select
                                    name="work"
                                    className="input border-2 text-black border-gray-300 bg-white cursor-pointer customs-selects"
                                    onChange={handleChangeWork}
                                    value={state.selectedWorkId}
                                    required
                                >
                                    {state.works?.map((work) => (
                                        <option key={work.id} value={work.id}>
                                            {work.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-black font-roboto text-xl m-1 "> - </span>
                            <select
                                name="equip"
                                className="input border-2 text-black border-gray-300 bg-white cursor-pointer customs-selects"
                                onChange={handleChangeEquipment}
                                value={stateEquipment.selectedEquipmentId}
                                required
                            >
                                {stateEquipment.equipments?.map((equip, idx) => (
                                    <option key={idx} value={equip.id.toString()}>
                                        {equip.id}
                                    </option>
                                ))}
                            </select>
                            <span className=" text-black font-roboto text-xl m-1 "> . </span>
                            <select
                                name="system"
                                className="input border-2 text-black border-gray-300 bg-white cursor-pointer customs-selects"
                                onChange={handleChangeSystem}
                                value={stateSystem.selectedSystemId}
                                required
                            >
                                {stateSystem.systems?.map((sus, idx) => (
                                    <option key={idx} value={sus.id.toString()}>
                                        {sus.id}
                                    </option>
                                ))}
                            </select>
                            <span className=" text-black border-solid border-2  border-gray-300 rounded-md font-roboto p-[0.6rem] text-sm m-1 ">
                                00
                            </span>
                        </div>

                        <label className="mt-2 ml-1 block text-sm font-medium text-black underline">Расшифровка</label>
                        <div className="grid border-solid border-2 border-gray-300 w-[400px]  rounded-md">
                            <div className="flex items-center">
                                <label className="block m-2 text-sm font-medium text-black">Работа:</label>
                                <label className="block m-2 text-sm font-medium text-black">
                                    {state.selectedWorkTitle}
                                </label>
                            </div>
                            <div className="flex items-center">
                                <label className="block m-2 text-sm font-medium text-black">Оборудование:</label>
                                <label className="block m-2 text-sm font-medium text-black">
                                    {stateEquipment.selectedEquipmentTitle}
                                </label>
                            </div>
                            <div className="flex items-center">
                                <label className="block m-2 text-sm font-medium text-black">Система:</label>
                                <label className="block m-2 text-sm font-medium text-black">
                                    {stateSystem.selectedESystemTitle}
                                </label>
                            </div>
                        </div>
                    </div>
                    {/*Inputs */}
                    <div className="grid items-center rounded-md bg-white p-2">
                        <div className="grid grid-cols-[2fr,3fr] gap-4 mt-3  ">
                            <span className="ml-1 mt-2 mr-2 text-black">Наименование</span>
                            <input
                                type="text"
                                id="numberSopytDos"
                                className="input mt-1 border text-black max-h-[35px] w-full placeholder-black/50 border-gray-300"
                                placeholder="Наименование..."
                                value={titleState} // Связываем значение поля с состоянием
                                onChange={handleTitleChange} // Обработчик изменения значения поля
                            />

                            <span className="ml-1 mr-2 mt-2 text-black">Примечание</span>
                            <input
                                type="text"
                                id="numberSopytDos"
                                className="input mt-1 border text-black max-h-[35px] w-full placeholder-black/50 border-gray-300"
                                placeholder="Примечание..."
                                value={notes} // Связываем значение поля с состоянием
                                onChange={handleNotesChange} // Обработчик изменения значения поля
                            />

                            <span className="ml-1 mr-2 mt-2 text-black">Пункт графика</span>
                            <input
                                type="text"
                                id="numberSopytDos"
                                className="input mt-1 border max-h-[35px] w-full text-black  placeholder-black/50 border-gray-300"
                                placeholder="Пункт графика..."
                            />

                            <span className="ml-1 mr-2 mt-4 text-black">Программа РОР</span>
                            <input
                                type="text"
                                id="numberSopytDos"
                                className="input mt-1 border max-h-[35px] w-full text-black  placeholder-black/50 border-gray-300"
                                placeholder="Программа выполнения работ..."
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Четвертый блок ТАБЛИЦА */}
            <div className="border-sky-300 border-2  rounded-md mt-3 p-3 shadow-md ">
                <span className="ml-1  text-black">На следующих рабочих местах и оборудывании </span>
                {/* h-[300px] overflow-auto - чтобы скролилась таблица */}
                <div className=" border-2 rounded-md p-2  ">
                    {/* input для добавления в таблицу */}
                    <div>
                        <span className="ml-2 mr-1 text-black">Рабочее место </span>
                        <select
                            name="zona"
                            className="input border-1 mt-1 text-black border-gray-300 bg-white w-[200px]  cursor-pointer"
                            onChange={handleChangeWorkZonas}
                            value={stateWorkZona.selectedWorkZona ? stateWorkZona.selectedWorkZona.id : ""}
                            required
                        >
                            <option value="" disabled={stateWorkZona.selectedWorkZona !== null}>
                                Выберите...
                            </option>
                            {stateWorkZona.workZonas.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>

                        <span className="ml-2 mr-1  text-black">Оборудование </span>
                        <select
                            name="eqipment"
                            className="input border-1 mt-1 text-black border-gray-300 bg-white w-[300px]  cursor-pointer"
                            onChange={handleChangeWorkEquip}
                            value={stateWorkEquip.selectedWorkEquip ? stateWorkEquip.selectedWorkEquip.id : ""}
                            required
                        >
                            <option
                                value=""
                                className="text-black"
                                disabled={stateWorkEquip.selectedWorkEquip !== null}
                            >
                                Выберите...
                            </option>
                            {stateWorkEquip.workEquips.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>

                        <span className="ml-4 mr-2  text-black">Основное помещение </span>
                        <input
                            type="checkbox"
                            id="headRoom"
                            className=" w-6 h-6 mr-10 border-1 border-black  rounded-md text- text-green-500  "
                            checked={isMainRoom}
                            onChange={handleCheckboxChange}
                        />

                        <button
                            onClick={handleAddData}
                            className=" mr-1  ml-5  h-9 items-center text-white py-2 px-4 rounded-md bg-cyan-400 hover:bg-cyan-500"
                        >
                            <FaPlus />
                        </button>
                    </div>
                    {/* таблица */}
                    <div className="mt-3">
                        <table className="border-collapse border border-gray-300 w-full ">
                            <thead>
                                <tr className=" bg-white" data-tooltip-target="tooltip-default">
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        Осн.
                                    </th>
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        Помещение
                                    </th>
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        Единицы оборудования
                                    </th>
                                    <th className="font-bold text-left border text-black border-gray-300 px-4 py-2">
                                        Единицы (текст)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataTableWork.map((data, idx) => (
                                    <tr key={idx} className=" bg-white hover:bg-black/10 whitespace-nowrap">
                                        <td className="border text-black border-gray-300 px-4 py-2 text-center text-xl   ">
                                            {data.osn}
                                        </td>
                                        <td className="border text-black border-gray-300 px-4 py-2">{data.room}</td>
                                        <td className="border text-black border-gray-300 px-4 py-2">
                                            {data.equipment}
                                        </td>

                                        <td className="border text-black border-gray-300 px-4 py-2 flex justify-center ">
                                            <input
                                                value={data.equipmentText}
                                                onChange={(e) => handleEquipmentTextChange(idx, e.target.value)}
                                                type="text"
                                                className=" input border border-slate-700  placeholder-white/50 block w-full ps-10 p-2.5"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Пятый блок Состав бригады */}
            <div className="border-sky-300 border-2 rounded-md mt-3 p-3 shadow-md">
                <span className="ml-1 text-black">Состав бригады </span>
                <div className="border-2 rounded-md p-2">
                    {/* Выборы */}
                    <div className="flex items-center">
                        <span className="ml-2 mr-1 text-black">Член бригады </span>
                        <div className="grid">
                            <Select
                                styles={customStyles}
                                value={selectedOptionGroup}
                                onChange={handleSelectChangeGroup}
                                options={fetchedPeopleGroup} // Передаем полученные данные в качестве опций
                                getOptionLabel={(option) => option.fio}
                                getOptionValue={(option) => option.personnel_number}
                                formatOptionLabel={(option) => (
                                    <div>
                                        <span>{option.fio}</span>
                                        <span className="text-gray-500 text-sm ml-1">({option.personnel_number})</span>
                                    </div>
                                )}
                                placeholder="Выберите пользователя"
                                isClearable
                            />
                            {selectedOptionGroup && (
                                <div className="hidden">
                                    <h2>Selected Option:</h2>
                                    <p>{selectedOptionGroup.fio}</p>
                                    <p>{selectedOptionGroup.personnel_number}</p>
                                </div>
                            )}
                        </div>

                        <span className=" ml-2 mr-1 text-black">Критерий ОДК </span>
                        <Select
                            styles={customStyles}
                            value={selectedCriterii}
                            onChange={(option: any) => setSelectedCriterii(option)}
                            options={criteriODK}
                            noOptionsMessage={() => "Нет доступных вариантов"}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.title}
                            formatOptionLabel={(option) => (
                                <div>
                                    <span>{option.label}</span>
                                </div>
                            )}
                            placeholder="Выберите критерий"
                            isClearable
                        />

                        <Select
                            styles={customStyles}
                            value={selectedPost}
                            onChange={(option: any) => setSelectedCPost(option)}
                            options={post}
                            noOptionsMessage={() => "Нет доступных вариантов"}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.title}
                            formatOptionLabel={(option) => (
                                <div>
                                    <span>{option.label}</span>
                                </div>
                            )}
                            placeholder="Выберите роль"
                            isClearable
                            className="ml-5"
                        />

                        <button
                            onClick={handleAddButtonClick}
                            className="mr-1 ml-5 h-9 items-center text-white py-2 px-4 rounded-md bg-cyan-400 hover:bg-cyan-500"
                        >
                            <FaPlus />
                        </button>
                    </div>
                    {/* Таблица */}
                    <div className="mt-3">
                        <table className="border-collapse border border-gray-300 w-full">
                            <thead>
                                <tr className="bg-white" data-tooltip-target="tooltip-default">
                                    <th className="font-bold text-black text-left border border-gray-300 px-4 py-2">
                                        №
                                    </th>
                                    <th className="font-bold text-black text-left border border-gray-300 px-4 py-2">
                                        Рук.
                                    </th>
                                    <th className="font-bold text-black text-left border border-gray-300 px-4 py-2">
                                        Произв.
                                    </th>
                                    <th className="font-bold text-black text-left border border-gray-300 px-4 py-2">
                                        Учетные номера
                                    </th>
                                    <th className="font-bold text-black text-left border border-gray-300 px-4 py-2">
                                        ФИО (Таб. №)
                                    </th>
                                    <th className="font-bold text-black text-left border border-gray-300 px-4 py-2">
                                        Критерий ОДК {selectedCriterii ? `(${selectedCriterii.label})` : ""}
                                    </th>
                                    <th className="font-bold text-black text-left border border-gray-300 px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataTable.map((data, idx) => (
                                    <tr key={idx} className=" bg-white hover:bg-black/10 whitespace-nowrap">
                                        <td className="border text-black border-gray-300 px-4 py-2 ">{data.number}</td>
                                        <td className="border text-black border-gray-300 px-4 py-2 text-center ">
                                            {data.supervisor}
                                        </td>
                                        <td className="border text-black border-gray-300 px-4 py-2 text-center ">
                                            {data.producer}
                                        </td>
                                        <td className="border text-black border-gray-300 px-4 py-2">
                                            {data.personnelNumber}
                                        </td>
                                        <td className="border text-black border-gray-300 px-4 py-2">
                                            {data.fullName} ({data.personnelNumber})
                                        </td>
                                        <td className="border text-black border-gray-300 px-4 py-2">
                                            <input
                                                onChange={(e) => handleCriteriiODKChange(idx, e.target.value)}
                                                type="text"
                                                className="input border border-slate-700 placeholder-white/50 block w-full ps-10 p-2.5"
                                            />
                                        </td>
                                        <td className="border text-black border-gray-300 px-4 py-2">
                                            <div className="text-center  items-center justify-center">
                                                <button
                                                    onClick={() => deleteData(idx)}
                                                    className="gap-2  py-2 px-4 rounded-md text-rose-500"
                                                >
                                                    <MdDelete className="cursor-pointer" size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Шестой блок */}
            <div className="border-sky-300 border-2 rounded-md mt-3 p-3 shadow-md">
                <span className="ml-1 text-black">Выдающий </span>
                <div className="flex border-2 rounded-md p-2">
                    <div className="grid">
                        <span className="text-black">Сотрудник</span>
                        <Select
                            styles={customStyles}
                            value={selectedOptionIssue}
                            onChange={handleSelectChangeIssue}
                            options={fetchedWorks} // Передаем полученные данные в качестве опций
                            getOptionLabel={(option) => option.fio}
                            getOptionValue={(option) => option.number}
                            formatOptionLabel={(option) => (
                                <div>
                                    <span>{option.fio}</span>
                                    <span className="text-gray-500 text-sm ml-1">({option.number})</span>
                                </div>
                            )}
                            placeholder="Выберите пользователя"
                            isClearable
                        />
                        {selectedOptionIssue && (
                            <div className="hidden">
                                <h2>Selected Option:</h2>
                                <p>{selectedOptionIssue.fio}</p>
                                <p>{selectedOptionIssue.number}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex mt-3 justify-center ">
                <button
                    className={`flex  gap-2  text-white py-2 px-4 rounded-md 
                        bg-green-500 hover:bg-green-700
                 `}
                    onClick={() => globalSaveDos()}
                >
                    <span>Сохранить </span>
                    <FaSave className="mt-0.5" />
                </button>
            </div>
        </>
    );
};

export default GenerateDosWorkPermit;
