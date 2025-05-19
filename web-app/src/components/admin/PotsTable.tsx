import { api, apiParser } from '@/constants/apiConst';
import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../Toast';

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
    PUBLISHED = 'PUBLISHED', // Trang thai dang duoc hien thi
    DELETED = 'DELETED', // Trang thai da bi xoa
    SUSPENDED = 'SUSPENDED', // Trang thai da bi tam ngung
}

const PostsTable: React.FC<PostsTableProps> = ({ posts }: any) => {
    const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});
    const [showModal, setShowModal] = useState(false);
    const [temp, setTemp] = useState(posts);
    const [message, setMessage] = useState('');
    // formData là 1 post
    const [formData, setFormData] = useState<Post>({
        _id: '',
        postId: '',
        title: '',
        description: '',
        content: '',
        url: '',
        status: PostStatus.PUBLISHED,
        totalComments: 0,
        totalUpvote: 0,
        totalDownvote: 0,
        totalShare: 0,
        totalView: 0,
        userId: '',
        tagId: '',
        createdAt: '',
        updatedAt: ''
    });

    const handleStatusChange = async (postId: string, newStatus: string) => {
        setSelectedStatus((prev: { [key: string]: string }) => ({
            ...prev,
            [postId]: newStatus
        }));
        // Here you can add API call to update the status
        console.log(`Updating post ${postId} status to ${newStatus}`); 
        const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("accessToken="))
                ?.split("=")[1];
        if (!token) return;
        const response = await axios(`${apiParser(api.apiPath.post.updateStatus)}/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: {
                status: newStatus,
            }
        });
        setMessage('Post updated successfully!');
        setTimeout(() => {
            setMessage('');
        }, 3000);
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

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            _id: '',
            postId: '',
            title: '',
            description: '',
            content: '',
            url: '',
            status: PostStatus.PUBLISHED,
            totalComments: 0,
            totalUpvote: 0,
            totalDownvote: 0,
            totalShare: 0,
            totalView: 0,
            userId: '',
            tagId: '',
            createdAt: '',
            updatedAt: ''
        });
    }

    const handleSave = async () => {
        // Here you can add API call to save the form data
        console.log('Saving form data:', formData);
        
         const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("accessToken="))
                ?.split("=")[1];
        if (!token) return;
        const response = await axios(`${apiParser(api.apiPath.post.updateStatus)}/${formData._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: {
                ...formData,
            }
        });
        const p  = temp.map((post: any) => {
            if (post._id == formData._id) {
                return {
                    ...post,
                    title: formData.title,
                    description: formData.description,
                    content: formData.content,
                    url: formData.url,
                    status: formData.status,
                };
            }
            return post;
            }
        );
        setMessage('Post updated successfully!');
        setTimeout(() => {
            setMessage('');
        }, 3000);
        setTemp(p);
        setShowModal(false);
    }

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
                            {posts.map((temp: any, index: number) => (
                                <tr key={index} className="align-middle border-bottom">
                                    <td className="px-4 py-3">
                                        <a href={temp.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            <span className="fw-bold text-primary">{temp.title}</span>
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{temp.description}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            className={`form-select form-select-sm bg-${getStatusColor(selectedStatus[temp._id] || temp.status)} text-white`}
                                            value={selectedStatus[temp._id] || temp.status}
                                            onChange={(e) => handleStatusChange(temp._id, e.target.value)}
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
                                        <span className="badge bg-info rounded-pill">{temp.totalView}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="badge bg-primary rounded-pill">{temp.totalComments}</span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{temp.createdAt}</td>
                                    <td className="px-4 py-3">
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-sm btn-info d-flex align-items-center shadow-sm"
                                                title="Edit post"
                                                onClick={() => {
                                                    setFormData({
                                                        _id: temp._id,
                                                        postId: temp.postId,
                                                        title: temp.title,
                                                        description: temp.description,
                                                        content: temp.content,
                                                        url: temp.url,
                                                        status: temp.status,
                                                        totalComments: temp.totalComments,
                                                        totalUpvote: temp.totalUpvote,
                                                        totalDownvote: temp.totalDownvote,
                                                        totalShare: temp.totalShare,
                                                        totalView: temp.totalView,
                                                        userId: temp.userId,
                                                        tagId: temp.tagId,
                                                        createdAt: temp.createdAt,
                                                        updatedAt: temp.updatedAt
                                                    });
                                                    console.log('Selected post data:', formData);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <i className="fas fa-edit me-2"></i>
                                                Edit
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
            </div>

            {/* Modal for editing post */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Edit Post</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form className="row g-3">
                                    <div className="col-md-12">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Enter title"
                                            minLength={1}
                                            required
                                            style={{ backgroundColor: '#fff' }}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder="Enter description"
                                            style={{ backgroundColor: '#fff' }}
                                        ></textarea>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Content</label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            value={formData.content}
                                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                                            placeholder="Enter content"
                                            style={{ backgroundColor: '#fff' }}
                                        ></textarea>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">URL</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.url}
                                            onChange={(e) => setFormData({...formData, url: e.target.value})}
                                            placeholder="Enter URL"
                                            style={{ backgroundColor: '#fff' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value as PostStatus})}
                                            style={{ backgroundColor: '#fff' }}
                                        >
                                            {Object.values(PostStatus).map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Read-only fields */}
                                    <div className="col-md-6">
                                        <label className="form-label">Post ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.postId}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">User ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.userId}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Tag ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.tagId}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Created At</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.createdAt}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Updated At</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.updatedAt}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Views</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.totalView}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Comments</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.totalComments}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Upvotes</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.totalUpvote}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Downvotes</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.totalDownvote}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Shares</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.totalShare}
                                            readOnly
                                            style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary d-flex align-items-center"
                                    onClick={handleSave}
                                    disabled={!formData.title}
                                >
                                    <i className="fas fa-save me-2"></i>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toast message={message} />
        </div>
    );
};

export default PostsTable;