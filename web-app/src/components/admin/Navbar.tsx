import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
const Navbar = () => {
    return (
        <header className="bg-white px-20 py-4 flex justify-between items-center">
            <div className="container flex items-center justify-between ">
                <button
                    className="md:hidden rounded-full mr-3 text-gray-600 hover:text-gray-800"
                    id="sidebarToggleTop"
                    type="button"
                >
                    <i className="fas fa-bars"></i>
                </button>
                <form className="hidden sm:inline-block mr-auto md:ml-3 my-2 md:my-0 max-w-full">
                    <div className="flex items-center rounded overflow-hidden shadow-sm bg-white">
                        <input
                            type="text"
                            placeholder="Search for ..."
                            className="bg-gray-100 px-4 py-2 text-sm text-gray-700 focus:outline-none border-none w-[300px] "
                        />
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-3 py-2 text-sm hover:bg-blue-600 transition-colors"
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </form>

                <ul className="flex items-center space-x-2 ml-auto">
                    <li className="sm:hidden relative">
                        <a
                            className="text-gray-600 hover:text-gray-800"
                            href="#"
                        >
                            <i className="fas fa-search"></i>
                        </a>
                    </li>
                    <li className="relative mx-1">
                        <a
                            className="text-gray-700 px-2 py-2 rounded-md hover:bg-gray-200 transition"
                            href="#"
                        >
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-md px-1.5 py-0.2">
                                3+
                            </span>
                            <i className="fas fa-bell"></i>
                        </a>
                    </li>
                    <li className="relative mx-1">
                        <a 
                            className="text-gray-700 px-2 py-2 rounded-md hover:bg-gray-200 transition mx-1 m-y-1"
                            href="#"
                        >
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-md px-1.5 py-0.2">
                                7   
                            </span>
                            <i className="fas fa-envelope"></i>
                        </a>
                    </li>
                    <div className="hidden sm:block border-l border-gray-300 h-6 mx-6"></div>
                    <li className="flex items-center">
                        <a
                            className="flex items-center space-x-2 focus:outline-none hover:bg-gray-200 rounded-md px-2 py-2 transition"
                            href="#"
                        >
                            <span  className="hidden lg:inline text-gray-600 text-sm mr-2">
                                Valerie Luna
                            </span>
                            <img
                                className="w-8 h-8 rounded-full border-2 border-gray-300"
                                src="https://placehold.co/40x40"
                                alt="profile"
                            />
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Navbar;