import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import { api, apiParser } from "@/constants/apiConst";

import { useUser } from "@/context/UserContext";

interface IUser {
    _id: string;
    name: string;
    role: number;
    accountState: "EXPIRED" | "BANNED" | "RESTRICTED" | "ACTIVE" | "WAIT_FOR_ACTIVATION";
    coverPicture: string;
    description: string;
    username: string;
    email: string;
    title: string;
    profilePicture: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
}

interface UserTableProps {
    users: IUser[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
    const { user, isLogin } = useUser()
    const [userList, setUserList] = useState<IUser[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        role: 0,
        accountState: 'WAIT_FOR_ACTIVATION' as const,
        title: '',
        bio: '',
        description: ''
    });

    // const regexPatterns = {
    //     name: /^[\p{L}\s\d.-]{1,50}$/u,
    //     username: /^[a-zA-Z0-9_-]{6,30}$/,
    //     email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    //     title: /^[\p{L}\s\d.,-]{0,100}$/u,
    //     bio: /^[\p{L}\s\d.,!?@#$%^&*()_+-]{0,500}$/u,
    //     description: /^[\p{L}\s\d.,!?@#$%^&*()_+-]{0,1000}$/u,
    // };


    useEffect(() => {
        setUserList(users);
    }, [users]);

    const handleOpenModal = (user?: IUser) => {
        if (user) {
            setIsEditing(true);
            setSelectedUser(user);
            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                accountState: user.accountState,
                title: user.title || '',
                bio: user.bio || '',
                description: user.description || ''
            });
        } else {
            setIsEditing(false);
            setSelectedUser(null);
            setFormData({
                name: '',
                username: '',
                email: '',
                role: 0,
                accountState: 'WAIT_FOR_ACTIVATION',
                title: '',
                bio: '',
                description: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedUser(null);
    };

    const handleSave = () => {
        if (isEditing) {
            console.log('Updating user:', formData);
            handleEditUser(selectedUser!._id);
        } else {
            handlerAddNewUser();
        }

        handleCloseModal();
    };

    const getAccountStateColor = (state: string) => {
        switch (state) {
            case 'ACTIVE':
                return 'success';
            case 'BANNED':
                return 'danger';
            case 'RESTRICTED':
                return 'warning';
            case 'EXPIRED':
                return 'secondary';
            default:
                return 'info';
        }
    };

    const getRoleBadge = (role: number) => {
        return role === 1 ?
            <span className="badge bg-primary">Admin</span> :
            <span className="badge bg-secondary">User</span>;
    };


    const handlerAddNewUser = async () => {
        const url = apiParser(api.apiPath.user.createByAdmin);
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];
        if (!token) return;
        try {
            const response = await axios.post(url, {
                ...formData,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.errorCode !== 200) {
                console.error("Error creating user:", response.data.errorMessage);
                return;
            }
            console.log("User created successfully:", response.data);
            setUserList((prevUsers) => [...prevUsers, response.data.data]);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!userId) return;
        if (userId === user._id) {
            alert("You cannot delete yourself!");
            return;
        }
        const confirmed = window.confirm("Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.");
        if (!confirmed) return;

        const url = apiParser(api.apiPath.user.delete.replace(':id', userId));
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];
        if (!token) return;
        try {
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.errorCode !== 200) {
                console.error("Error deleting user:", response.data.errorMessage);
                return;
            }
            setUserList((prevUsers) => prevUsers.filter((user) => user._id !== userId));

        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    const handleEditUser = async (userId: string) => {
        if (!userId) return;
        const url = apiParser(api.apiPath.user.update.replace(':id', userId));
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];
        if (!token) return;
        console.log("Form data to update:", formData);
        try {
            const response = await axios.put(url, {
                updateData: {
                    ...formData,
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.errorCode !== 200) {
                console.error("Error updating user:", response.data.errorMessage);
                return;
            }
            setUserList((prevUsers) => prevUsers.map((user) => user._id === userId ? response.data.data : user));
        }
        catch (error) {
            console.error("Error updating user:", error);
        }
    }



    return (
        <div className="card shadow">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Users Management</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover table-striped border">
                        <thead className="bg-light border-bottom">
                            <tr>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Created At</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user) => (
                                <tr key={user._id} className="align-middle">
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <img
                                                className="rounded-circle me-3"
                                                width="40"
                                                height="40"
                                                src={user.profilePicture || 'https://picsum.photos/200'}
                                                alt={user.name}
                                            />
                                            <div>
                                                <div className="fw-bold">{user.name}</div>
                                                <small className="text-muted">@{user.username}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`badge bg-${getAccountStateColor(user.accountState)}`}>
                                            {user.accountState}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{user.title || '-'}</td>
                                    <td className="px-4 py-3 text-muted">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-info d-flex align-items-center shadow-sm"
                                                onClick={() => handleOpenModal(user)}
                                                title="Edit user"
                                            >
                                                <i className="fas fa-edit me-2"></i>
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger d-flex align-items-center shadow-sm"
                                                title="Delete user"
                                                onClick={() => handleDeleteUser(user._id)}
                                            >
                                                <i className="fas fa-trash me-2"></i>
                                                Delete
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 d-flex justify-content-end">
                    <button
                        className="btn btn-primary d-flex align-items-center shadow-sm"
                        onClick={() => handleOpenModal()}
                        title="Add new user"
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add New User
                    </button>
                </div>
            </div>

            {/* User Modal (Add/Edit) */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{isEditing ? 'Edit User' : 'Add New User'}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter full name"
                                            minLength={1}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="Enter username"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Enter email"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) })}
                                        >
                                            <option value={0}>User</option>
                                            <option value={1}>Admin</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Account State</label>
                                        <select
                                            className="form-select"
                                            value={formData.accountState}
                                            onChange={(e) => setFormData({ ...formData, accountState: e.target.value as any })}
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="BANNED">Banned</option>
                                            <option value="RESTRICTED">Restricted</option>
                                            <option value="EXPIRED">Expired</option>
                                            <option value="WAIT_FOR_ACTIVATION">Wait for Activation</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter title (optional)"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Enter bio (optional)"
                                        ></textarea>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter description (optional)"
                                        ></textarea>
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
                                    disabled={!formData.name || !formData.username || !formData.email}
                                >
                                    <i className="fas fa-save me-2"></i>
                                    {isEditing ? 'Update User' : 'Save User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

UserTable.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            role: PropTypes.number.isRequired,
            accountState: PropTypes.oneOf(["EXPIRED", "BANNED", "RESTRICTED", "ACTIVE", "WAIT_FOR_ACTIVATION"]).isRequired,
            coverPicture: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            profilePicture: PropTypes.string.isRequired,
            bio: PropTypes.string.isRequired,
            createdAt: PropTypes.instanceOf(Date).isRequired,
            updatedAt: PropTypes.instanceOf(Date).isRequired,
        })
    ).isRequired,
};

export default UserTable;