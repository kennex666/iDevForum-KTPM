import { redirect } from "next/navigation";

export default function Home() {
    // Chuyển hướng đến /login
    redirect("/home");
}