import { FC } from "react";
import { useAuth } from "../hooks/useAuth";
import img from "../assets/404.jpeg";

interface Props {
    children: JSX.Element;
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
    const isAuth = useAuth();
    return (
        <>
            {isAuth ? (
                children
            ) : (
                <div className=" flex flex-col items-center justify-center gap-10 ">
                    <h1 className="text-2xl text-black ">
                        Для просмотра этой страницы вы должны войти в систему под своей учетной записью
                    </h1>
                    <img src={img} alt="img" className="w-1/3" />
                </div>
            )}
        </>
    );
};

export default ProtectedRoute;
