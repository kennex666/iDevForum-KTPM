export interface Bookmark {
	post: {
		postId: string;
		title: string;
		createdAt: string;
		topic: {
			tagId: string;
			name: string;
		};
		author: {
			userId: string;
			name: string;
			profilePicture: string;
		};
	};
}

export interface SidebarProps {
	currentUser?: {
		bookMarks: Bookmark[];
	};
}
