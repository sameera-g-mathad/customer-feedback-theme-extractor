import React from "react";
import { type progressBarInterface } from "@/interfaces";

export const ProgressBar: React.FC<progressBarInterface> = ({ progress }) => {
    return <div className="h-3 w-full rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }}>
        </div>
    </div>;
};

ProgressBar.displayName = 'ProgressBar'