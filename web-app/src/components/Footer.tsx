'use client';

export default function Footer() {
    return (
		<footer className="text-left text-gray-500 text-sm justify-center p-4">
			<p>© {new Date().getFullYear()} iDev4rum. All rights reserved.</p>
			<p>
				Designed by{" "}
				<a
					href="https://dtbao.io.vn/?s=idev4rum-microservice"
					className="text-blue-500"
				>
					Duong Thai Bao
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