
export default function Error({errorCode = "404", errorMessage = "Không tìm thấy nội dung", description = "Xin lỗi, nội dung bạn vừa yêu cầu không tồn tại!"}) {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="flex flex-col justify-center items-center gap-6">
                <div className="flex flex-col px-8 pt-4 pb-8 border border-gray-300 rounded-lg w-[30vw]">
                    {/* <img src="/assets/img/error.jpg" className="h-42 object-contain"> */}
                    <img
                        src="/assets/img/error.jpg"
                        className="h-42 object-contain"
                        alt="Error Image"
                    />
                    <h1>
                        <span className="text-lg font-bold">{errorCode}</span>
                        <span className="text-lg uppercase">
                            <span>:</span> {errorMessage}
                        </span>
                    </h1>
                    <p>{description}</p>
                </div>

                <a href="/" className="text-blue-500 text-center">
                    <div className="border border-blue-500 rounded-md px-6 py-2 flex flex-row justify-center items-center  w-[30vw]">
                        <p>Quay lại trang chủ</p>
                    </div>
                </a>
            </div>
        </div>
	);
}