import React, { useState, useEffect } from 'react';

export enum PostReportState {
    PROCCESSING = 'PROCESSING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

interface IUser {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
    role: number;
    accountState: string;
}

interface IPost {
    _id: string;
    title: string;
    content: string;
}

interface IPostReport {
    postreportId: string;
    state: PostReportState;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
    postId: string;
    reporterId: string;
    inspectorId: string;
    post?: IPost;
    reporter?: IUser;
    inspector?: IUser;
}

const PostReportTable: React.FC = () => {
    const [reports, setReports] = useState<IPostReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated data - replace with actual API call
        const fetchReports = async () => {
            try {
                // Replace with actual API call
                const mockData: IPostReport[] = [
                    {
                        postreportId: '1',
                        state: PostReportState.PROCCESSING,
                        reason: 'Inappropriate content',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        postId: 'post1',
                        reporterId: 'user1',
                        inspectorId: 'user2',
                        post: {
                            _id: 'post1',
                            title: 'Sample Post 1',
                            content: 'Sample content'
                        },
                        reporter: {
                            _id: 'user1',
                            name: 'John Doe',
                            email: 'john@example.com',
                            profilePicture: 'https://picsum.photos/200',
                            role: 0,
                            accountState: 'ACTIVE'
                        },
                        inspector: {
                            _id: 'user2',
                            name: 'Admin User',
                            email: 'admin@example.com',
                            profilePicture: 'https://picsum.photos/200',
                            role: 1,
                            accountState: 'ACTIVE'
                        }
                    },
                ];
                setReports(mockData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleStatusChange = async (reportId: string, newStatus: PostReportState) => {
        try {
            // Replace with actual API call
            setReports(prevReports =>
                prevReports.map(report =>
                    report.postreportId === reportId ? { ...report, state: newStatus } : report
                )
            );
        } catch (error) {
            console.error('Error updating report status:', error);
        }
    };

    const getStatusColor = (status: PostReportState) => {
        switch (status) {
            case PostReportState.PROCCESSING:
                return 'warning';
            case PostReportState.ACCEPTED:
                return 'success';
            case PostReportState.REJECTED:
                return 'danger';
            default:
                return 'primary';
        }
    };

    if (loading) {
        return (
            <div className="card shadow-sm">
                <div className="card-body text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Post Reports Management</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover table-striped border">
                        <thead className="bg-light border-bottom">
                            <tr>
                                <th className="px-4 py-3">Post Title</th>
                                <th className="px-4 py-3">Reason</th>
                                <th className="px-4 py-3">Reporter</th>
                                <th className="px-4 py-3">Inspector</th>
                                <th className="px-4 py-3">Reported At</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.postreportId} className="align-middle border-bottom">
                                    <td className="px-4">
                                        <a href={`/posts/${report.postId}`} className="text-decoration-none">
                                            <span className="text-primary">{report.post?.title || 'Unknown Post'}</span>
                                        </a>
                                    </td>
                                    <td className="px-4">
                                        <div className="text-wrap" style={{ maxWidth: '200px' }}>
                                            {report.reason}
                                        </div>
                                    </td>
                                    <td className="px-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <img 
                                                src={report.reporter?.profilePicture || '/images/default-avatar.png'} 
                                                alt={report.reporter?.name || 'Reporter'} 
                                                className="rounded-circle"
                                                width="32"
                                                height="32"
                                            />
                                            <div>
                                                <div className="fw-bold">{report.reporter?.name || 'Unknown User'}</div>
                                                <div className="small text-muted">{report.reporter?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4">
                                        {report.inspector ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <img 
                                                    src={report.inspector.profilePicture} 
                                                    alt={report.inspector.name} 
                                                    className="rounded-circle"
                                                    width="32"
                                                    height="32"
                                                />
                                                <div>
                                                    <div className="fw-bold">{report.inspector.name}</div>
                                                    <div className="small text-muted">{report.inspector.email}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-muted">Not assigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 text-muted">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4">
                                        <select
                                            className={`form-select form-select-sm bg-${getStatusColor(report.state)} text-white`}
                                            value={report.state}
                                            onChange={(e) => handleStatusChange(report.postreportId, e.target.value as PostReportState)}
                                            style={{ minWidth: '120px' }}
                                        >
                                            <option value={PostReportState.PROCCESSING}>Processing</option>
                                            <option value={PostReportState.ACCEPTED}>Accepted</option>
                                            <option value={PostReportState.REJECTED}>Rejected</option>
                                        </select>
                                    </td>
                                    <td className="px-4">
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-sm btn-info d-flex align-items-center"
                                                title="View post details"
                                            >
                                                <i className="fas fa-eye me-2"></i>
                                                View
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger d-flex align-items-center"
                                                title="Delete report"
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
            </div>
        </div>
    );
};

export default PostReportTable;