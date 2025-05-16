import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ items }: any) => {
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
                                    src={item.avatar}
                                    alt={item.commenter}
                                />
                                {item.commenter}
                            </td>
                            <td>{item.content}</td>
                            <td>{item.post}</td>
                            <td>{item.commentDate}</td>
                            <td>
                                <button className="btn btn-danger btn-sm">Xóa</button>
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