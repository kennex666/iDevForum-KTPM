import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
        // Here you would typically make an API call to save/update the user
        console.log('Saving user:', {
            ...(selectedUser || {}),
            ...formData
        });
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
                            {users.map((user) => (
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
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
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
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="Enter email"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Role</label>
                                        <select 
                                            className="form-select"
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: Number(e.target.value)})}
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
                                            onChange={(e) => setFormData({...formData, accountState: e.target.value as any})}
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
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Enter title (optional)"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            placeholder="Enter bio (optional)"
                                        ></textarea>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
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