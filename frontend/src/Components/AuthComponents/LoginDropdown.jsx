import React, { useEffect, useRef, useState, useContext } from 'react'
import { IoTriangle } from "react-icons/io5";
import { useAuth } from '../AuthComponents/AuthContext';

const LoginDropdown = (props) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (!result.success) {
            alert('Error: ' + result.error);
            setError(result.error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div
            className='flex flex-col justify-center px-6 py-6 fixed right-16 top-16 bg-green-200 rounded-lg z-50
            shadow-2xl border border-gray-800 w-80
            transition-all duration-300 ease-out transform
            max-sm:px-4 max-sm:py-4 max-sm:right-3 max-sm:w-74'
        >
            <h2 className="mt-2 text-center text-xl font-bold tracking-tight z-50">
                Sign in to your account
            </h2>

            <div className="mt-6 w-full z-50">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="off"
                            value={formData.email}
                            className="block w-full rounded-lg bg-custom-black border border-gray-600 px-3 py-2.5 text-black 
                                     placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2
                                     transition-all duration-200 hover:border-gray-500"
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            {/* <a href="#" className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors duration-200">
                                Forgot password?
                            </a> */}
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={formData.password}
                            className="block w-full rounded-lg bg-custom-black border border-gray-600 px-3 py-2.5 text-black 
                                     placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2
                                     transition-all duration-200 hover:border-gray-500"
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-lg bg-green-700 px-3 py-2.5 text-sm font-semibold text-white 
                                     hover:bg-green-800 focus:outline-none 
                                     transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                                     cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <p className="mt-5 text-center text-sm text-gray-400">
                    Not a member?
                    <button
                        className="font-semibold text-green-700 hover:text-green-800 transition-colors duration-200 hover:underline cursor-pointer bg-transparent border-none p-0"
                        onClick={() => props.inverseDropdownshow()}
                    >Create an Account</button>
                </p>
            </div>
        </div>
    )
}

export default LoginDropdown