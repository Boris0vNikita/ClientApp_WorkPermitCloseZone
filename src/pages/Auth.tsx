import { FC, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { setTokenToLocalStorage } from "../helpers/localstorage.helper";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import ros from "../assets/Rosatom12.png";

const Auth: FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const data = await AuthService.login({ login: email, identifier: password });

            if (data) {
                setTokenToLocalStorage("token", data.token);

                dispatch(login(data));
                toast.success(`Вы авторизованы.`);
                navigate("/dosimetric_outfit");
            }
        } catch (err: any) {
            const error = err.response?.data.message;
            toast.error(error.toString());
        }
    };

    const registrationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const data = await AuthService.registration({ login: email, identifier: password });
            if (data) {
                toast.success("Аккаунт создан");
                setIsLogin(isLogin);
            }
        } catch (err: any) {
            const error = err.response?.data.message;
            toast.error(error.toString());
        }
    };

    return (
        <div className="mt-40 flex flex-col justify-center items-center  text-white ">
            <div className="bg-medium-blue rounded-md p-10 ">
                <div className={`flex gap-x-4 items-center justify-center   `}>
                    <img
                        src={ros}
                        className={`ml-1 max-w-[40px] max-h-[40px] transform transition-transform duration-500 `}
                    />
                    <h1 className={`text-white origin-left font-medium text-xl transition-transform duration-200 `}>
                        <div className="flex">
                            <div className="w-0.5 bg-white h-15 ml-2 mt-1 mr-2"></div>
                            <div className="flex-col mt-2">
                                <h1 className="text-white font-roboto">ПСЗ</h1>
                                <h1 className="text-white font-roboto">Росатом</h1>
                            </div>
                        </div>
                    </h1>
                </div>
                {/* <h1 className="text-center text-xl mt-5  mb-10">{isLogin ? "Войти" : "Регистрация"}</h1> */}
                <h1 className="text-center text-xl mt-5  mb-10">{"Войти"}</h1>
                <form
                    //  onSubmit={isLogin ? loginHandler : registrationHandler}
                    onSubmit={loginHandler}
                    className="flex w1/3 flex-col mx-auto gap-5"
                >
                    <input
                        type="text"
                        className="input"
                        placeholder="Логин"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Пароль"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="mx-auto flex gap-2 bg-green-600 items-center text-white py-2 px-4 rounded-md border-r-green-600 hover:bg-green-800">
                        Отправить
                    </button>
                </form>

                {/* <div className="flex justify-center mt-5">
                    {isLogin ? (
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="mx-auto flex gap-2  items-center  py-2 px-4 rounded-md bg-gray-600 text-slate-300 hover:text-white"
                        >
                            Создайте Аккаунт?
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="mx-auto flex gap-2  items-center  py-2 px-4 rounded-md bg-gray-600 text-slate-300 hover:text-white"
                        >
                            Уже имеете Аккаунт?
                        </button>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default Auth;
