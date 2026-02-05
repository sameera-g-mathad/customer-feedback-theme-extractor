import React from "react";
import { motion } from "framer-motion";
import { type progressBarInterface } from "@/interfaces";

export const ProgressBar: React.FC<progressBarInterface> = ({ progress }) => {
    return <div className="w-full flex items-center gap-2">
        <div className="h-2 w-full rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-blue-500 transition-all duration-200"
                style={{ width: `${progress}%` }}>
            </div>
        </div>
        <div>
            <motion.span
                key={progress}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-slate-500 text-right"
            >
                {progress}%
            </motion.span>
        </div>
    </div>;
};

ProgressBar.displayName = 'ProgressBar'