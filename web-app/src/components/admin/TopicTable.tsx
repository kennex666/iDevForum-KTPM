import { api, apiParser } from '@/constants/apiConst';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Toast from '../Toast';

interface ITopic {
    tagId: string;
    name: string;
    hashtag: string;
    createdAt: Date;
    updatedAt: Date;
}

const TopicTable: React.FC = () => {
    const [topics, setTopics] = useState<ITopic[]>([]);
    const [toat , setToat] = useState<{ message: string; type?: 'success' | 'error' }>({
        message: '',
        type: 'success',
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<ITopic | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        hashtag: ''
    });

    useEffect(() => {
        // Simulated data - replace with actual API call
        const fetchTopics = async () => {
            try {
                // Replace with actual API call
                const response = await axios.get(apiParser(api.apiPath.topic));
                const mockData: ITopic[] = response.data.data.map((topic: any) => ({
                    tagId: topic.tagId,
                    name: topic.name,
                    hashtag: topic.hashtag,
                    createdAt: new Date(topic.createdAt),
                    updatedAt: new Date(topic.updatedAt)
                }));
                setTopics(mockData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching topics:', error);
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const handleOpenModal = (topic?: ITopic) => {
        if (topic) {
            setIsEditing(true);
            setSelectedTopic(topic);
            setFormData({
                name: topic.name,
                hashtag: topic.hashtag.replace('#', '')
            });
        } else {
            setIsEditing(false);
            setSelectedTopic(null);
            setFormData({
                name: '',
                hashtag: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedTopic(null);
        setFormData({
            name: '',
            hashtag: ''
        });
    };

    const handleSave = async () => {
        // Here you would typically make an API call to save/update the topic
        console.log('Saving topic:', {
            ...(selectedTopic || {}),
            name: formData.name,
            hashtag: formData.hashtag
        });

		const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("accessToken="))
				?.split("=")[1];
		if (!token) return;
        const result = await axios(
            `${apiParser(api.apiPath.topic)}` + (isEditing ? `/${selectedTopic?.tagId}` : '/save'),
            {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    name: formData.name,
                    hashtag: `#${formData.hashtag}`
                }
            }
        )

        if(result.data.errorCode !== 200) {
            alert(result.data.errorMessage);
            return;
        }
        if (isEditing) {
            setTopics((prev) =>
                prev.map((topic) =>
                    topic.tagId === selectedTopic?.tagId
                        ? { ...topic, name: formData.name, hashtag: `#${formData.hashtag}` }
                        : topic
                )
            );

            setToat({
                message: `Topic ${formData.name} updated successfully!`,
                type: 'success'
            });
        }
        else {
            setTopics((prev) => [
                ...prev,
                {
                    tagId: result.data.data.tagId,
                    name: formData.name,
                    hashtag: `#${formData.hashtag}`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);

            setToat({
                message: `Topic ${formData.name} added successfully!`,
                type: 'success'
            });
        }
        handleCloseModal();
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
                <h6 className="m-0 font-weight-bold text-primary">Topics Management</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover table-striped border">
                        <thead className="bg-light border-bottom">
                            <tr>
                                <th className="px-4 py-3">Tag ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Hashtag</th>
                                <th className="px-4 py-3">Created At</th>
                                <th className="px-4 py-3">Updated At</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map((topic) => (
                                <tr key={topic.tagId} className="align-middle border-bottom">
                                    <td className="px-4 py-3">
                                        <span className="badge bg-secondary">{topic.tagId}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="fw-bold">{topic.name}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="badge bg-primary">{topic.hashtag}</span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">
                                        {new Date(topic.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-muted">
                                        {new Date(topic.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-sm btn-info d-flex align-items-center shadow-sm"
                                                title="Edit topic"
                                                onClick={() => handleOpenModal(topic)}
                                            >
                                                <i className="fas fa-edit me-2"></i>
                                                Edit
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger d-flex align-items-center shadow-sm"
                                                title="Delete topic"
                                                onClick={async () => {
                                                    const token = document.cookie
                                                        .split("; ")
                                                        .find((row) => row.startsWith("accessToken="))
                                                        ?.split("=")[1];
                                                    if (!token) return;
                                                    const result = await axios(
                                                        `${apiParser(api.apiPath.topic)}/${topic.tagId}`,
                                                        {
                                                            method: 'DELETE',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                Authorization: `Bearer ${token}`,
                                                            },
                                                        }
                                                    )
                                                    if(result.data.errorCode !== 200) {
                                                        alert(result.data.errorMessage);
                                                        return;
                                                    }
                                                    setTopics((prev) =>
                                                        prev.filter((t) => t.tagId !== topic.tagId)
                                                    );
                                                    setToat({
                                                        message: `Topic ${topic.name} have ID ${topic.tagId} deleted successfully!`,
                                                        type: 'success'
                                                    });
                                                }}
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

                {/* Add Topic Button */}
                <div className="mt-4 d-flex justify-content-end">
                    <button 
                        className="btn btn-primary d-flex align-items-center shadow-sm"
                        title="Add new topic"
                        onClick={() => handleOpenModal()}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add New Topic
                    </button>
                </div>
            </div>

            <Toast message={toat.message} type={toat.type} />
            {/* Topic Modal (Add/Edit) */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{isEditing ? 'Edit Topic' : 'Add New Topic'}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Topic Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter topic name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                        <div className="form-text">Choose a clear and descriptive name for the topic</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Hashtag</label>
                                        <div className="input-group">
                                            <span className="input-group-text">#</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter hashtag (without #)"
                                                value={formData.hashtag}
                                                onChange={(e) => setFormData({...formData, hashtag: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-text">The hashtag will be used for topic categorization</div>
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
                                    disabled={!formData.name || !formData.hashtag}
                                >
                                    <i className="fas fa-save me-2"></i>
                                    {isEditing ? 'Update Topic' : 'Save Topic'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default TopicTable;