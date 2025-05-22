interface TabBarProps {
	activeTab: string;
	setActiveTab: any;
}
import { FaPlus } from "react-icons/fa";

const TabBar = ({ activeTab, setActiveTab }: TabBarProps) => {
	return (
		<div className="flex flex-row bg-white space-x-10 items-center pt-3 text-nowrap scrollbar-custom px-5">
			<a className="opacity-50">
				<FaPlus />
			</a>
			<div
				onClick={() => {
					setActiveTab("home");
				}}
				className={`${
					activeTab === "home"
						? "border-black border-b-2"
						: "text-gray-500 hover:text-black"
				}`}
			>
				Dành cho bạn
			</div>
			<div
				onClick={() => {
					setActiveTab("following");
				}}
				className={`${
					activeTab === "following"
						? "border-black border-b-2"
						: "text-gray-500 hover:text-black"
				}`}
			>
				Đang theo dõi
			</div>
		</div>
	);
};

export default TabBar;
