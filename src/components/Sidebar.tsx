import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { FaFileCirclePlus, FaClipboardList, FaKey, FaUser } from "react-icons/fa6";
import control from "../assets/control.png";
import logo from "../assets/logo.png";
import ros from "../assets/Rosatom12.png";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { CiLogout } from "react-icons/ci";

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

    // Вытаскием логин пользователя из хука useUser
    const userData = useUser();
    /*
     {isAuth ? (
        //         <button
        //             onClick={logoutHandler}
        //             className="btn bg-rose-900 border-r-rose-900 hover:bg-rose-800 flex gap-2 items-center text-white py-2 px-4 rounded-md"
        //         >
        //             <span>Выйти</span>
        //             <FaSignOutAlt />
        //         </button>
        //     ) : (
        //         <Link to={"auth"} className="py-2 text-white/50 hover:text-white ml-auto ">
        //             Войти
        //         </Link>
        //     )}
     */

    const Menus = [
        { title: "Создать дознаряд", src: <FaFileCirclePlus size={20} />, path: "generate" },
        { title: "Список дознарядов", src: <FaClipboardList size={20} />, path: "" },
        { title: "Выдача прав", src: <FaKey size={20} />, path: "issue" },
        { title: "Настройки", src: <IoMdSettings size={20} />, path: "", gap: true },
        { title: `${userData?.showname}`, src: <FaUser size={20} />, path: "", gap: true },
        { title: "Выйти", src: <CiLogout size={20} />, path: "auth", gap: true },
    ];

    const navigateHadler = (path: string) => {
        if (path == "auth") {
            navigate(`/${path}`);
        } else {
            navigate(`/dosimetric_outfit/${path}`);
        }
    };

    return (
        <div className="flex w-auto h-screen">
            <div className={` ${open ? "w-72" : "w-20"} bg-dark-purple bg-stak-blue p-5  relative duration-300`}>
                <img
                    src={control}
                    className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full transform transition-transform duration-300 ${
                        !open ? "rotate-180" : ""
                    }`}
                    onClick={() => setOpen(!open)}
                />
                <div className={`flex gap-x-4 items-center ${open && "mb-5"}  `}>
                    <img
                        src={ros}
                        className={`ml-1 max-w-[30px] max-h-[30px] transform transition-transform duration-500 ${
                            open ? "rotate-[360deg] " : "mb-2"
                        }`}
                    />
                    <h1
                        className={`text-white origin-left font-medium text-xl transition-transform duration-200 ${
                            !open ? "scale-0" : "scale-100"
                        }`}
                    >
                        <div className="flex">
                            <div className="w-0.5 bg-white h-15 ml-2 mt-1 mr-2"></div>
                            <div className="flex-col mt-2">
                                <h1 className="text-white font-roboto">ПСЗ</h1>
                                <h1 className="text-white font-roboto">Росатом</h1>
                            </div>
                        </div>
                    </h1>
                </div>
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <li
                            onClick={() => navigateHadler(Menu.path)}
                            key={index}
                            className={`flex rounded-md p-2 cursor-pointer hover:bg-almost-blue text-white text-sm gap-x-4 transition-all duration-300 
                            ${Menu.gap ? "mt-9" : "mt-2"} ${open ? "items-center" : "justify-center"} ${
                                index === 0 ? "bg-light-white" : ""
                            }`}
                        >
                            {Menu.src}
                            <span className={`${!open ? "hidden" : "block"} origin-left duration-200`}>
                                {Menu.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div
                className={`pr-5 pl-10 pb-5 bg-white  overflow-y-auto overflow-x-hidden transition-all duration-300 ${
                    open ? "w-full" : "w-full"
                }`}
            >
                <Outlet />
            </div>
        </div>
    );
};
export default Sidebar;

// bg-dark-purple
