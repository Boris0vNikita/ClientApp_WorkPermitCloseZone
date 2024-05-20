import { FC, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Form, useLoaderData } from "react-router-dom";

import { IResponceTransactionLoader } from "../types/types";
import CategoryModal from "./CategoryModal";

const TransactionForm: FC = () => {
    const { categories } = useLoaderData() as IResponceTransactionLoader;
    const [visibleModal, setVisibleModal] = useState(false);
    return (
        <div className=" rounded-md bg-sky-600 p-4">
            <Form className="grid gap-2" method="post" action="/dosimetric_outfit/transaction">
                <label className="grid" htmlFor="title">
                    <span>Title</span>
                    <input
                        type="text"
                        className="input border-slate-700 placeholder-white/50"
                        placeholder="title..."
                        name="title"
                        required
                    />
                </label>
                <label className="grid" htmlFor="amount">
                    <span>Amount</span>
                    <input
                        type="number"
                        className="input border-slate-700 placeholder-white/50"
                        placeholder="amount..."
                        name="amount"
                        required
                    />
                </label>

                {/* SELECT */}
                {categories.length ? (
                    <label htmlFor="category" className="grid">
                        <span>Category</span>
                        <select name="category" className="input border-slate-700 bg-sky-600 " required>
                            {categories.map((ctg, idx) => (
                                <option key={idx} value={ctg.id}>
                                    {ctg.title}
                                </option>
                            ))}
                        </select>
                    </label>
                ) : (
                    <h1 className="mt-1 text-red-300 ">To be cteate a cetegory first</h1>
                )}

                {/* Add Category */}
                <button
                    onClick={() => setVisibleModal(true)}
                    className=" flex max-w-fit items-center gap-2 text-white/50 hover:text-white "
                >
                    <FaPlus />
                    <span>Manage Categories:</span>
                </button>

                {/* Radio Buttons */}
                <div className="flex gap-4 items-center">
                    <label className="flex cursor-pointer items-center gap-2">
                        <input type="radio" name="type" value={"income"} className="form-radio  text-blue-600" />
                        <span>Income</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                        <input type="radio" name="type" value={"expense"} className="form-radio text-blue-600" />
                        <span>Expense</span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    className=" max-w-fit mt-2 disabled:hover:bg-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed flex gap-2 items-center text-white py-2 px-4 rounded-md bg-green-600 border-r-green-600 hover:bg-green-800"
                    type="submit"
                >
                    Submit
                </button>
            </Form>

            {/* Add Category Modal */}
            {visibleModal && <CategoryModal type="post" setVisibleModal={setVisibleModal} />}
        </div>
    );
};

export default TransactionForm;
