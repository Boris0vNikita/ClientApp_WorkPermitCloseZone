import { FC } from "react";
import { Form } from "react-router-dom";

interface ICategoryModal {
    type: "post" | "patch";
    id?: number;
    setVisibleModal: (visible: boolean) => void;
}

const CategoryModal: FC<ICategoryModal> = ({ type, id, setVisibleModal }) => {
    return (
        <div className="fixed top-0 z-50 left-0 bottom-0 right-0 w-full h-full bg-black/50 flex justify-center items-center ">
            <Form
                action="/dosimetric_outfit/categories"
                method={type}
                onSubmit={() => setVisibleModal(false)}
                className="grid gap-2 w-[300px] rounded-md bg-slate-900 p-5"
            >
                <label htmlFor="title">
                    <small>Category title</small>
                    <input className="input w-full" type="text" name="title" placeholder="Title//" />
                    <input type="hidden" name="id" value={id} />
                </label>
                <div className="flex items-center gap-2">
                    <button
                        className="disabled:hover:bg-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed flex gap-2 items-center text-white py-2 px-4 rounded-md bg-green-600 border-r-green-600 hover:bg-green-800"
                        type="submit"
                    >
                        {type == "patch" ? "Save" : "Create"}
                    </button>
                    <button
                        onClick={() => setVisibleModal(false)}
                        className=" disabled:hover:bg-gray-400 disabled:bg-gray-400 disabled:cursor-not-allowed flex gap-2 items-center text-white py-2 px-4 rounded-md bg-rose-900 border-r-rose-900 hover:bg-rose-800"
                    >
                        Close
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default CategoryModal;
