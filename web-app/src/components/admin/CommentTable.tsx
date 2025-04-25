import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ items, handleDeleteComment }: { items: any[]; handleDeleteComment: (id: string) => void }) => {
    return (
        <div className="table-responsive">
            <table className="table my-0">
                <thead>
                    <tr>
                        <th>Người bình luận</th>
                        <th>Nội dung</th>
                        <th>Bài viết</th>
                        <th>Ngày bình luận</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td className="d-flex align-items-center">
                                <img
                                    className="rounded-circle me-2"
                                    width="30"
                                    height="30"
                                    src={item.user?.avatar || 'https://picsum.photos/200'}
                                    alt={item.id}
                                />
                                {item.user?.name || 'Người dùng ẩn danh'}
                            </td>
                            <td>{item.content}</td>
                            <td>
                                <a href={item.post?.url || '#'} target="_blank" rel="noopener noreferrer">
                                    {item.post?.title || 'Không có tiêu đề'}
                                </a>
                            </td>
                            <td>{item.createdAt}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteComment(item.id)}
                                >
                                    <i className="fas fa-trash"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <th>Người bình luận</th>
                        <th>Nội dung</th>
                        <th>Bài viết</th>
                        <th>Ngày bình luận</th>
                        <th>Thao tác</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

Table.propTypes = {
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

export default Table;