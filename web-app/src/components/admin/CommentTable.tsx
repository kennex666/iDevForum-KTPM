import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Toast from '../Toast';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user?: {
        name: string;
        avatar: string;
    };
    post?: {
        title: string;
        url: string;
    };
}

interface CommentTableProps {
    items: Comment[];
    handleDeleteComment: (id: string) => void;
}

const CommentTable: React.FC<CommentTableProps> = ({ items, handleDeleteComment }) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa bình luận này?');
        if (!confirmDelete) return;
        try {
            setDeletingId(id);
            await handleDeleteComment(id);
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setDeletingId(null);
            setToast({
                message: `Xóa bình luận ${id} thành công!`,
                type: 'success',
            });
        }
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th className="px-4">Người bình luận</th>
                        <th className="px-4">Nội dung</th>
                        <th className="px-4">Bài viết</th>
                        <th className="px-4">Ngày bình luận</th>
                        <th className="px-4">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.commentId} className="align-middle">
                            <td className="px-4">
                                <div className="d-flex align-items-center">
                                    <img
                                        className="rounded-circle me-2"
                                        width="40"
                                        height="40"
                                        src={item.user?.avatar || 'https://picsum.photos/200'}
                                        alt={item.id}
                                    />
                                    <span className="fw-bold">{item.user?.name || 'Người dùng ẩn danh'}</span>
                                </div>
                            </td>
                            <td className="px-4">
                                <div className="text-wrap" style={{ maxWidth: '300px' }}>
                                    {item.content}
                                </div>
                            </td>
                            <td className="px-4">
                                <a 
                                    href={item.post?.post.url || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-decoration-none"
                                >
                                    <span className="text-primary">{item.post?.post.title || 'Không có tiêu đề'}</span>
                                </a>
                            </td>
                            <td className="px-4 text-muted">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4">
                                <button
                                    className={`btn btn-sm ${deletingId === item.id ? 'btn-secondary' : 'btn-danger'}`}
                                    onClick={() => handleDelete(item.commentId)}
                                    disabled={deletingId === item.id}
                                >
                                    {deletingId === item.id ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            Đang xóa...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-trash me-1"></i>
                                            Xóa
                                        </>
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="table-light">
                    <tr>
                        <th className="px-4">Người bình luận</th>
                        <th className="px-4">Nội dung</th>
                        <th className="px-4">Bài viết</th>
                        <th className="px-4">Ngày bình luận</th>
                        <th className="px-4">Thao tác</th>
                    </tr>
                </tfoot>
            </table>

            <Toast
                message={toast?.message || ''}
                type={toast?.type || 'success'}
            />
        </div>
    );
};

CommentTable.propTypes = {
    employees: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            office: PropTypes.string.isRequired,
            age: PropTypes.number.isRequired,
            startDate: PropTypes.string.isRequired,
            salary: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default CommentTable;