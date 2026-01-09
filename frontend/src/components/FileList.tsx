import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { type fileListInterface } from "@/interfaces";
import { ProgressBar } from "@/reusables";


export const FileList: React.FC<fileListInterface> = ({
    name,
    progress,
    size,
}) => {
    const fileSizes = ["B", "KB", "MB"];
    const base = 1024;
    const index = Math.floor(Math.log(size) / Math.log(base));
    const newSize = `${parseFloat(
        (size / Math.pow(base, index)).toFixed(1)
    )} ${fileSizes[index]}`;

    const [filename, extention] = name.split('.')
    return (
        <motion.div
            //   variants={container}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.01 }}
            className="border border-slate-300 shadow rounded-xl p-3 bg-white hover:shadow-sm transition-shadow"
        >
            {/* Row 1: Icon + meta */}
            <div className="flex items-center gap-4">
                <span className="border border-slate-200 bg-slate-200 rounded-lg p-2">
                    <FileText size={20} className="text-slate-600 shrink-0" />

                </span>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 grow min-w-0">
                    <span className="font-medium text-sm text-slate-700 truncate">
                        {filename}
                    </span>

                    <span className="text-sm text-slate-400">
                        {newSize}
                    </span>


                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {extention}
                    </span>

                </div>
            </div>

            {/* Row 2: Progress */}
            <div className="flex items-center gap-2 mt-3">
                <ProgressBar progress={progress} />
            </div>
        </motion.div>
    );
};
