import React, { useState } from 'react';

interface Post {
    _id: string;
    postId: string;
    title: string;
    description: string;
    content: string;
    url: string;
    status: string;
    totalComments: number;
    totalUpvote: number;
    totalDownvote: number;
    totalShare: number;
    totalView: number;
    userId: string;
    tagId: string;
    createdAt: string;
    updatedAt: string;
}

interface PostsTableProps {
    posts: Post[];
}

enum PostStatus {
    PUBLISHED = 'PUBLISHED',
    DELETED = 'DELETED',
    SUPERSEDED = 'SUPERSEDED',
}

const PostsTable: React.FC<PostsTableProps> = ({ posts }: any) => {
    const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});

    const handleStatusChange = (postId: string, newStatus: string) => {
        setSelectedStatus(prev => ({
            ...prev,
            [postId]: newStatus
        }));
        // Here you can add API call to update the status
        console.log(`Updating post ${postId} status to ${newStatus}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case PostStatus.PUBLISHED:
                return 'success';
            case PostStatus.DELETED:
                return 'danger';
            case PostStatus.SUPERSEDED:
                return 'warning';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="card shadow">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Posts Management</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover table-striped border">
                        <thead className="bg-light border-bottom">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Views</th>
                                <th className="px-4 py-3">Comments</th>
                                <th className="px-4 py-3">Created At</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post: any, index) => (
                                <tr key={index} className="align-middle border-bottom">
                                    <td className="px-4 py-3">
                                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            <span className="fw-bold text-primary">{post.title}</span>
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{post.description}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            className={`form-select form-select-sm bg-${getStatusColor(selectedStatus[post._id] || post.status)} text-white`}
                                            value={selectedStatus[post._id] || post.status}
                                            onChange={(e) => handleStatusChange(post._id, e.target.value)}
                                            style={{ minWidth: '120px' }}
                                        >
                                            {Object.values(PostStatus).map((status) => (
                                                <option key={status} value={status} className={`bg-${getStatusColor(status)}`}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="badge bg-info rounded-pill">{post.totalView}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="badge bg-primary rounded-pill">{post.totalComments}</span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{post.createdAt}</td>
                                    <td className="px-4 py-3">
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-sm btn-info d-flex align-items-center shadow-sm"
                                                title="Edit post"
                                            >
                                                <i className="fas fa-edit me-2"></i>
                                                Edit
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger d-flex align-items-center shadow-sm"
                                                title="Delete post"
                                            >
                                                <i className="fas fa-trash me-2"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="table-light">
                            <tr>
                                <td className="px-4"><strong>Title</strong></td>
                                <td className="px-4"><strong>Description</strong></td>
                                <td className="px-4"><strong>Status</strong></td>
                                <td className="px-4"><strong>Views</strong></td>
                                <td className="px-4"><strong>Comments</strong></td>
                                <td className="px-4"><strong>Created At</strong></td>
                                <td className="px-4"><strong>Actions</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="mt-4 d-flex justify-content-end">
                    <button 
                        className="btn btn-primary d-flex align-items-center shadow-sm"
                        title="Add new post"
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add New Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostsTable;