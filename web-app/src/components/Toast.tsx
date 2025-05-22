'use client';

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

type ToastProps = {
    message: string;
    type?: "success" | "error";
};

export default function Toast({ message, type = "success" }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!message) {
        return null;
    }

    const icon =
        type === "success" ? (
            <FaCheckCircle className="text-2xl text-white drop-shadow" />
        ) : (
            <FaTimesCircle className="text-2xl text-white drop-shadow" />
        );

    const bgClass =
        type === "success"
            ? "bg-gradient-to-r from-green-400 to-emerald-600"
            : "bg-gradient-to-r from-red-400 to-pink-600";

    return (
        <div
            className={`z-[999] fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 ${bgClass} text-white rounded-xl shadow-2xl min-w-[260px] transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
        >
            {icon}
            <span className="text-base font-medium">{message}</span>
        </div>
    );
}