import { FC } from "react";

import img from "../assets/404.jpeg";
import { Link } from "react-router-dom";

const ErrorPage: FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 font-roboto text-white flex justify-center items-center flex-col gap-10 ">
            <img src={img} alt="img" className="max-w-[500px] max-h-[500px]" />
            <Link to={"/dosimetric_outfit"} className="bg-sky-500 rounded-md px-6 py-2 hover:bg-sky-600">
                Back
            </Link>
        </div>
    );
};

export default ErrorPage;
