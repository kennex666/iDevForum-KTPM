export interface Post {
	title: string;
	description: string;
	url: string;
	author: any;
	topic: {
		tagId: string;
		name: string;
	};
	createdAt: string;
	totalUpvote: number;
	totalDownvote: number;
	totalComments: number;
	coverImage?: string;
}
