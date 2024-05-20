import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout: FC = () => {
    return (
        //h-[calc(100vh-80px)]
        <div className=" h-full  bg-white font-roboto text-white">
            <Header />

            <div className="">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
