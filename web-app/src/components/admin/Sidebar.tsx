import React from 'react';
import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';
const Sidebar = () => {
    return (
        <nav className="flex flex-col w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-600 p-0 text-white">
            <div className="flex flex-col h-full p-0">
                <a className="flex items-center justify-center py-4 text-white no-underline m-0" href="#">
                    <div className="transform -rotate-15">
                        <i className="fas fa-laugh-wink text-2xl text-white"></i>
                    </div>
                    <div className="mx-3 text-xl font-bold">
                        <span>iDev4rum</span>
                    </div>
                </a>
                <hr className="border-t border-white opacity-30 my-0" />
                <ul className="flex flex-col text-white" id="accordionSidebar">
                    <li className="list-none">
                        <Link className="block px-[16px] py-[16px] bg-blue-500 text-white no-underline transition-colors duration-150 hover:bg-blue-500 font-bold flex items-center gap-2" href="dash-board">
                            <i className="fas fa-tachometer-alt text-white w-5 h-5"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="list-none">
                        <Link className="block px-[16px] py-[16px] text-white no-underline transition-colors duration-150 hover:bg-blue-500 flex items-center gap-2" href="profile">
                            <i className="fas fa-user text-white w-5 h-5"></i>
                            <span>Profile</span>
                        </Link>
                    </li>
                    <li className="list-none">
                        <Link className="block px-[16px] py-[16px] text-white no-underline transition-colors duration-150 hover:bg-blue-500 flex items-center gap-2" href="/manage-user">
                            <i className="fas fa-table text-white w-5 h-5"></i>
                            <span>Table</span>
                        </Link>
                    </li>
                    <li className="list-none">
                        <Link className="block px-[16px] py-[16px] text-white no-underline transition-colors duration-150 hover:bg-blue-500 flex items-center gap-2" href="/login">
                            <i className="far fa-user-circle text-white w-5 h-5"></i>
                            <span>Login</span>
                        </Link>
                    </li>
                    <li className="list-none">
                        <Link className="block px-[16px] py-[16px] text-white no-underline transition-colors duration-150 hover:bg-blue-500 flex items-center gap-2" href="/register">
                            <i className="fas fa-user-circle text-white w-5 h-5"></i>
                            <span>Register</span>
                        </Link>
                    </li>
                    <li className="list-none">
                        <Link className="block px-[16px] py-[16px] text-white no-underline transition-colors duration-150 hover:bg-blue-500 flex items-center gap-2" href="/forgot-password">
                            <i className="fas fa-key text-white w-5 h-5"></i>
                            <span>Forgotten Password</span>
                        </Link>
                    </li>
                    <li className="list-none">
                        <Link className="block px-[16px] py-[16px] text-white no-underline transition-colors duration-150 hover:bg-blue-500 flex items-center gap-2" href="/404">
                            <i className="fas fa-exclamation-circle text-white w-5 h-5"></i>
                            <span>Page Not Found</span>
                        </Link>
                    </li>
                    <li className="list-none">
                        <Link className="block px-[16px] py-[16px] text-white no-underline transition-colors duration-150 hover:bg-blue-500 flex items-center gap-2" href="/blank">
                            <i className="fas fa-window-maximize text-white w-5 h-5"></i>
                            <span>Blank Page</span>
                        </Link>
                    </li>
                </ul>
                <div className="text-center hidden md:inline mt-auto mb-24">
                    <button
                        id="sidebarToggle"
                        type="button"
                        className="w-10 h-10 circle bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out rounded-full"
                    >
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Sidebar;