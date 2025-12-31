import React from "react";
import { FileText } from 'lucide-react'
import { type fileListInterface } from "@/interfaces";
import { ProgressBar } from "@/reusables";

export const FileList: React.FC<fileListInterface> = ({ name, progress, size, type }) => {
    const fileSizes = ['B', 'KB', 'MB'];
    const base = 1024;
    const index = Math.floor(Math.log(size) / Math.log(base))
    const newSize = `${parseFloat((size / Math.pow(base, index)).toFixed(1))} ${fileSizes[index]}`;

    return <div className='border rounded-lg flex gap-5 items-center p-2'>
        <div>
            <FileText size={40} />
        </div>
        <div className="flex flex-col gap-2 grow text-gray-500">
            <span>
                {name}
            </span>
            <div className="flex justify-between">
                <span className="text-sm">{newSize}</span>
            </div>
            <div className="flex items-center gap-2">
                <ProgressBar progress={progress} />
                <span>{progress}%</span>
            </div>

        </div>
    </div>;
};
