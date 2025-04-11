export interface Post {
	title: string;
	description: string;
	url: string;
	author: {
		userId: string;
		name: string;
		profilePicture: string;
	};
	topic: {
		tagId: string;
		name: string;
	};
	date: string;
	totalUpVote: number;
	totalComments: number;
}
