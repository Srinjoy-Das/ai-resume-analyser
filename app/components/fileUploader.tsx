import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {

    const [file, setFile] = useState<File | null>(null);

    const maxFileSize = 20 * 1024 * 1024;

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0] || null;

        setFile(selectedFile);
        onFileSelect?.(selectedFile);

    }, [onFileSelect]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    });

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();

        setFile(null);
        onFileSelect?.(null);
    };

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">

                    {file ? (
                        <div
                            className="uploader-selected-file flex items-center justify-between bg-white rounded-xl p-3"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <img
                                src="/images/pdf.png"
                                alt="pdf"
                                className="size-10 object-contain"
                            />

                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                                        {file.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="p-2 cursor-pointer"
                                onClick={handleRemoveFile}
                            >
                                <img
                                    src="/icons/cross.svg"
                                    alt="remove"
                                    className="w-4 h-4"
                                />
                            </button>

                        </div>

                    ) : (

                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center">
                                <img
                                    src="/icons/info.svg"
                                    className="size-20"
                                />
                            </div>

                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    Click to Upload
                                </span>{" "}
                                or Drag 'n' Drop
                            </p>

                            <p className="text-lg text-gray-500">
                                PDF (max {formatSize(maxFileSize)})
                            </p>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;