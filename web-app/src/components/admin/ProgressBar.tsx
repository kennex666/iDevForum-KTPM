import React from 'react';

interface ProgressBarProps {
    progress: number; 
    label?: string; // Optional label prop
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
    return (
        <div className="progress mb-4">
            <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                {progress}%
            </div>
        </div>
    );
};

export default ProgressBar;