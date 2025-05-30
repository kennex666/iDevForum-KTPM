'use client';

export default function Footer() {
    return (
		<footer className="text-left text-gray-500 text-sm justify-center mt-8 border-t-1 pt-4">
			<p>© {new Date().getFullYear()} iDev4rum. All rights reserved.</p>
			<p>
				Designed by{" "}
				<a
					href="https://dtbao.io.vn/?s=idev4rum-microservice"
					className="text-blue-500"
				>
					 iDev4rum 2025
				</a>
			</p>
			<p className="text-red-500 mt-2">
				<strong>Notice:</strong> This project is intended for
				educational use and may overlap with existing copyrighted
				designs.
			</p>
		</footer>
	);
}