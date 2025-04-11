interface TabBarProps {
	activeTab: string;
}
import { FaPlus } from "react-icons/fa";

const TabBar = ({ activeTab }: TabBarProps) => {
	return (
		<div className="flex flex-row bg-white space-x-10 items-center pt-3 text-nowrap scrollbar-custom px-5">
			<a className="pb-3 opacity-50">
				<FaPlus/>
			</a>
			<a
				href="/"
				className={`pb-3 ${
					activeTab === "home"
						? "border-black border-b-2"
						: "text-gray-500 hover:text-black"
				}`}
			>
				Dành cho bạn
			</a>
			<a
				href="/?tab=following"
				className={`pb-3 ${
					activeTab === "following"
						? "border-black border-b-2"
						: "text-gray-500 hover:text-black"
				}`}
			>
				Đang theo dõi
			</a>
		</div>
	);
};

export default TabBar;
