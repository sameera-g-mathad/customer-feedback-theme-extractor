import React from "react";
import { type fileUploadInterface } from "@/interfaces";

export const FileUpload: React.FC<fileUploadInterface> = ({ accept, multiple, onFileupload }) => {
    return <>
        <input type='file' id='file' className="hidden" accept={accept} multiple={multiple} onChange={onFileupload} />
        <label htmlFor="file">Click to upload</label>
    </>;
};

FileUpload.displayName = 'FileUpload'