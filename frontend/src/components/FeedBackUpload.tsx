import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FileList } from "./FileList";
import { FileUpload } from "@/reusables";
import { type FileType } from "@/interfaces";
import { CloudUpload } from "lucide-react";


export const FeedBackUpload: React.FC = () => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    const processFiles = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target || !e.target.files) return;

        const newFiles = Array.from(e.target.files).map((file) => ({
            id: file.name,
            progress: 0,
            file,
        }));

        setFiles((prev) => [...prev, ...newFiles]);
    };

    const uploadFiles = async () => {
        if (files.length === 0 || uploading) return;

        setUploading(true);

        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append("files", file.file);

            try {
                await axios.post("http://127.0.0.1:8000/upload", formData, {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || 1)
                        );

                        setFiles((prev) =>
                            prev.map((prevFile) =>
                                prevFile.id === file.id
                                    ? { ...file, progress }
                                    : prevFile
                            )
                        );
                    },
                });
            } catch (e) {
                console.error(e);
            }
        });

        await Promise.all(uploadPromises);
        setUploading(false);
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:w-[50%] w-full gap-6"
        >
            {/* Upload Area */}
            <motion.div
                // variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                className="border border-dashed flex flex-col justify-center items-center gap-3 h-64 rounded-2xl bg-card hover:shadow-card transition-shadow"
            >
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
                    className="border rounded-lg p-2 border-slate-300"
                >
                    <CloudUpload className="text-slate-500" />
                </motion.span>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="font-medium cursor-pointer text-blue-400 hover:text-blue-500 hover:underline"
                >
                    <FileUpload
                        accept=".pdf,.xlsx,.pdf,.docx,.txt,.json"
                        multiple
                        onFileupload={processFiles}
                    />
                </motion.div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {["CSV", "XLSX", "PDF", "DOCX", "TXT", "JSON"].map((type) => (
                        <span
                            key={type}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-slate-300 text-slate-600"
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                // variants={fadeUp}
                className="flex justify-end gap-3"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={uploading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                    onClick={uploadFiles}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border"
                    onClick={() => setFiles([])}
                >
                    Clear
                </motion.button>
            </motion.div>

            {/* File List */}
            <motion.div
                className="flex flex-col gap-3"
            >
                <AnimatePresence>
                    {files.map((upload) => {
                        const { name, size } = upload.file;

                        return (
                            <motion.div
                                key={upload.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FileList
                                    name={name}
                                    size={size}
                                    progress={upload.progress}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};
