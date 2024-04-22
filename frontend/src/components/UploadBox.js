import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';

import { Button, Card } from '@nextui-org/react';

import TwoThirdsWidthWrapper from './twoThirdsWidthWrapper';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import necessary plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

const generateUploadbox = () => {
    return renderToString(
        <div className="flex items-center space-x-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-file-up"
                className="mr-2"
            >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" /> <path d="M12 12v6" />
                <path d="m15 15-3-3-3 3" />
            </svg>
            Select or drop a CSV
        </div>,
    );
};

const UploadBox = ({ onServerResponse, onUploadComplete }) => {
    const [files, setFiles] = useState([]);

    const handleProcessFile = (
        fieldName,
        file,
        metadata,
        load,
        error,
        progress,
        abort,
    ) => {
        const formData = new FormData();
        formData.append('filename', file, file.name);
        formData.append('org', 'tpeo'); // FIXME Replace 'tpeo' with the actual value you need to send.

        const request = new XMLHttpRequest();
        request.open('POST', 'https://thoughtless-backend.vercel.app/file');

        request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
        };

        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                const response = request.responseText;
                load(response);
                const responseJson = JSON.parse(response);
                onServerResponse(responseJson); // Pass the response up to the parent component
                onUploadComplete();
                console.log(responseJson);
            } else {
                error(request.responseText);
            }
        };

        request.send(formData);

        return {
            abort: () => {
                request.abort();
                abort();
            },
        };
    };

    return (
        // <div className="mx-auto lg:max-w-[50%] max-w-[66.666%] px-2.5 md:px-20">
        <div className="mx-auto w-full max-w-[100%]">
            <FilePond
                files={files}
                allowMultiple={false}
                maxFiles={1}
                onupdatefiles={setFiles}
                name="files"
                acceptedFileTypes={['text/csv']}
                server={{
                    process: handleProcessFile,
                }}
                labelIdle={generateUploadbox()}
            />
        </div>
    );
};

export default UploadBox;
ReactDOM.render(<UploadBox />, document.getElementById('root'));
