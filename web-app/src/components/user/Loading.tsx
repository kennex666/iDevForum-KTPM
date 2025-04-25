export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            <h1 className="text-2xl font-semibold">Loading...</h1>
            <p className="text-gray-500">Please wait while we fetch the data.</p>
        </div>
    );
}