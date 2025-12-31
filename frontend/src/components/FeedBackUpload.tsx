import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { FileList } from "./FileList";
import { FileUpload } from "@/reusables";
import { type FileType } from "@/interfaces";
import { CloudUpload } from 'lucide-react'

// refer https://github.com/cosdensolutions/code/blob/master/videos/long/multi-file-input-with-progress-bar/src/components/FileUpload.tsx
// for more details.
export const FeedBackUpload: React.FC = () => {
    const [files, setFiles] = useState<FileType[]>([])
    const [uploading, setUploading] = useState<boolean>(false);

    const processFiles = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target || !e.target.files)
            return

        // add file to fileList.
        const newFiles = Array.from(e.target.files).map(file => {
            return {
                id: file.name,
                progress: 0,
                file
            }
        }
        )
        setFiles(prev => [...prev, ...newFiles])
    }

    const uploadFiles = () => {
        if (files.length === 0 || uploading) return;

        setUploading(true)

        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('files', file.file)
            try {
                // dummy call for now
                await axios.post('http://127.0.0.1:8000/upload', formData, {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || 1),
                        );
                        setFiles(prev =>
                            prev.map(prevFile =>
                                prevFile.id === file.id ? { ...file, progress } : prevFile
                            )
                        )
                    }
                })
            }
            catch (e) {
                console.error(e)
            }
        })

        Promise.all(uploadPromises);
        setUploading(false)

    }

    return <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col justify-center gap-3 w-[40%]">
            <div className="border flex flex-col justify-center items-center gap-3 p-3 rounded-lg flex-1">
                <span className="border rounded-lg p-1.5 border-gray-300">
                    <CloudUpload color="gray" />
                </span>
                <div className="font-medium cursor-pointer  text-blue-400 hover:text-blue-500 hover:underline">
                    <FileUpload accept=".pdf,.xlsx,.pdf,.docx,.txt,.json" multiple={true} onFileupload={processFiles} />
                </div>
                <span className="text-gray-400 text-sm">
                    CSV, XLSX, PDF, DOCX, TXT or JSON
                </span>
            </div>
            <div className="flex justify-end gap-3">
                <button onClick={uploadFiles}>upload</button>
                <button onClick={() => setFiles([])}>clear</button>
            </div>
            <div className="flex flex-col gap-3 max-h-90 overflow-y-scroll">
                {
                    files.length > 0 ?
                        files.map(upload => {
                            const { name, size, type } = upload.file

                            return <FileList key={upload.id} name={name} size={size} progress={upload.progress} type={type} />
                        })
                        : ''
                }
            </div >
        </div>
    </div>;
};
