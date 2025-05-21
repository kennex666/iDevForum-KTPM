export interface Post {
	userId?:string;
	postId?: string;
	title: string;
	description: string;
	url: string;
	author: any;
	user?: any;
	topic: any;
	createdAt: string;
	totalUpvote: number;
	totalDownvote: number;
	totalComments: number;
	coverImage?: string;
}
