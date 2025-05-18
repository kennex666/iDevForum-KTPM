export const formatDate = (dateString: string) => {
	const date = new Date(dateString);

	const pad = (n: number) => n.toString().padStart(2, "0");

	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const day = pad(date.getDate());
	const month = pad(date.getMonth() + 1); // 0-indexed
	const year = date.getFullYear();

	return `${hours}:${minutes} - ${day}/${month}/${year}`;
};

export const getDateOnly = (dateString: string) => {
	const date = new Date(dateString);

	const pad = (n: number) => n.toString().padStart(2, "0");

	const day = pad(date.getDate());
	const month = pad(date.getMonth() + 1); // 0-indexed
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};


export const getReadingTime = (content: string): number => {
	const wordsPerMinute = 200;
	const text = content ? content.trim() : "";
	const wordCount = text.split(/\s+/).length;

	const minutes = Math.ceil(wordCount / wordsPerMinute);
	return minutes;
};
