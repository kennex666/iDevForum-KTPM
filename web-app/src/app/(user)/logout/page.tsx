'use client'
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage(){
    const router = useRouter();
    const {user, setUser } = useUser();
    
    useEffect(
        () => {
            if (user) {
                setUser(null); // Clear user data
                // cookie remove
                document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
            router.push("/"); // Redirect to home page
        },
        [user, setUser, router] // Dependencies for useEffect
    )
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p>Chờ chút...</p>
        </div>
    );
}