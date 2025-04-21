import React from 'react';

const Card = ({ title, value, icon, color }) => {
    return (
        <div className={`card shadow border-left-${color} py-2`}>
            <div className="card-body">
                <div className="row g-0 align-items-center">
                    <div className="col me-2">
                        <div className={`text-uppercase text-${color} fw-bold text-xs mb-1`}>
                            <span>{title}</span>
                        </div>
                        <div className="text-dark fw-bold h5 mb-0">
                            <span>{value}</span>
                        </div>
                    </div>
                    <div className="col-auto">
                        <i className={`fas fa-${icon} fa-2x text-gray-300`}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;