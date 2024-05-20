import { FC } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBtc, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { toast } from "react-toastify";
import img from "../assets/Rosatom12.png";

const Header: FC = () => {
    const isAuth = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        removeTokenFromLocalStorage("token");
        toast.success("You logged out");
        navigate("/auth");
    };
    return (
        <></>
        //flex h-[80px] items-center overflow-hidden p-4 shadow-sm bg-medium-blue backdrop-blur-sm
        // <header className="flex h-[80px] items-center overflow-hidden p-4 shadow-sm bg-stak-blue backdrop-blur-sm border-b-2 border-solid border-white  ">
        //     <Link to="/dosimetric_outfit" className=" flex justify-center">
        //         {/* <FaBtc size={20} /> */}

        //         <img src={img} alt="img" className="max-w-[50px] max-h-[50px]" />
        //         <div className="w-0.5 bg-white h-15 ml-2 mt-1 mr-2"></div>
        //         <div className="flex-col mt-2">
        //             <h1 className="text-white font-roboto">ПСЗ</h1>
        //             <h1 className="text-white font-roboto">Росатом</h1>
        //         </div>
        //     </Link>

        //     {/* MENU */}
        //     {isAuth && (
        //         <nav className="ml-auto mr-10">
        //             {/* <ul className=" flex items-center gap-2 ">
        //                 <li>
        //                     <FaUser size={20} />
        //                 </li>
        //                 <li>
        //                     <h1 className=" text-black font-roboto">{user}</h1>
        //                 </li>
        //                 <li>
        //                     <NavLink
        //                         to={"/dosimetric_outfit/categories"}
        //                         className={({ isActive }) => (isActive ? "text-white" : "text-white/50")}
        //                     >
        //                         Categories
        //                     </NavLink>
        //                 </li>
        //                 <li>
        //                     <NavLink
        //                         to={"/dosimetric_outfit/transaction"}
        //                         className={({ isActive }) => (isActive ? "text-white" : "text-white/50")}
        //                     >
        //                         Transactions
        //                     </NavLink>
        //                 </li>
        //             </ul> */}
        //         </nav>
        //     )}

        //     {/* Actions */}
        //     {isAuth ? (
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
        // </header>
    );
};

export default Header;
