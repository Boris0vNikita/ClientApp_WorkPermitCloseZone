import { FC, useEffect, useState, useRef } from "react";
import { FaTrash, FaEllipsisV } from "react-icons/fa";
import { Form, useLoaderData } from "react-router-dom";
import { IResponceTransactionLoader, ITransaction } from "../types/types";
import { formatDate } from "../helpers/date.helper";
import { formatToUSD } from "../helpers/currency.helper";
import { instance } from "../API/axios.api";
import ReactPaginate from "react-paginate";

interface ITransactionTable {
    limit: number;
}

const TransactionTable: FC<ITransactionTable> = ({ limit = 3 }) => {
    const { transactions } = useLoaderData() as IResponceTransactionLoader;

    // Paginator
    const [data, setData] = useState<ITransaction[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchTransactions = async (page: number) => {
        const response = await instance.get(`/transactions/pagination?page=${page}&limit=${limit}`);
        setData(response.data);
        setTotalPages(Math.ceil(transactions.length / limit));
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage, transactions]);

    // State for managing menu visibility for each transaction
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

    return (
        <>
            <ReactPaginate
                className="flex gap-3  justify-end mt-4 items-center "
                activeClassName="bg-sky-600 rounded-sm"
                pageLinkClassName="text-black text-xs py-1 px-2  rounded-sm "
                previousClassName="text-black py-1 px-2 bg-sky-600 rounded-sm text-xs"
                nextClassName="text-black py-1 px-2 bg-sky-600 rounded-sm text-xs"
                disabledClassName="text-black cursor-not-allowed"
                disabledLinkClassName="text-slate-600 cursor-not-allowed"
                pageCount={totalPages}
                pageRangeDisplayed={1}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
            />
            <div className="bg-sky-600  px-4 py-3 rounded-md mt-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <td className="font-bold">№</td>
                            <td className="font-bold">Title</td>
                            <td className="font-bold ">Amount($)</td>
                            <td className="font-bold">Category</td>
                            <td className="font-bold">Date</td>
                            <td className="text-right">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((transaction, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{transaction.title}</td>
                                <td className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                                    {transaction.type === "income"
                                        ? `+ ${formatToUSD.format(transaction.amount)}`
                                        : `- ${formatToUSD.format(transaction.amount)}`}
                                </td>
                                <td>{transaction.category?.title || "Other"}</td>
                                <td> {formatDate(transaction.createdAt)} </td>
                                <td>
                                    <div className="relative">
                                        <button
                                            className="flex ml-auto gap-2  text-white py-2 px-4 rounded-md bg-red-500 hover:bg-rose-800"
                                            onClick={() => toggleMenu(transaction.id.toString())}
                                        >
                                            <FaEllipsisV />
                                        </button>
                                        {menuVisible[transaction.id] && (
                                            <div
                                                className="absolute z-50 top-full right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
                                                ref={(ref) => (menuRefs[transaction.id] = ref)}
                                            >
                                                <ul>
                                                    <li>
                                                        <Form method="delete" action="/dosimetric_outfit/transaction">
                                                            <input type="hidden" name="id" value={transaction.id} />
                                                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                                                Delete
                                                            </button>
                                                        </Form>
                                                    </li>
                                                    <li>
                                                        <Form method="delete" action="/dosimetric_outfit/transaction">
                                                            <input type="hidden" name="id" value={transaction.id} />
                                                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                                                Delete
                                                            </button>
                                                        </Form>
                                                    </li>
                                                    <li>
                                                        <Form method="delete" action="/dosimetric_outfit/transaction">
                                                            <input type="hidden" name="id" value={transaction.id} />
                                                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                                                Delete
                                                            </button>
                                                        </Form>
                                                    </li>
                                                    {/* Add more menu items as needed */}
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
        </>
    );
};

export default TransactionTable;
