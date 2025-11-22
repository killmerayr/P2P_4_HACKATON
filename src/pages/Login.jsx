import Register from "./Register"
import { Link } from 'react-router-dom';

export default function Login() {
    return(
        <div className="min-h-screen bg-gradient-to-r from-white to-yellow-300 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <h2 className="text-2xl text-gray-800 font-bold text-center mb-6">Вход в аккаунт</h2>

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    />
                    <button className="w-full bg-yellow-500 text-white py-3 tounded-lg hover:bg-yellow-700 transition font-semibold">
                        Войти
                    </button>
                </div>

                <p className="text-center mt-2 text-gray-700 px-2 py-2">
                    Нет акаунта?
                    <Link to="/register" className="text-semibold text-yellow-600 hover:underline hover:text-yellow-700 transition-color ml-1 px-1">
                     Зарегистрироваться 
                    </Link>
                </p>
            </div>
        </div>
    );
}