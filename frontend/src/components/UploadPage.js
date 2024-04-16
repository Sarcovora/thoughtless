import MaxWidthWrapper from './MaxWidthWrapper';
import NavigationBar from './Navigation';

import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import TwoThirdsWidthWrapper from './twoThirdsWidthWrapper';

const UploadPage = ({}) => {
    const { Dragger } = Upload;

    const props = {
        name: 'file',
        multiple: false,
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(
                    `${info.file.name} file uploaded successfully.`,
                );
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <NavigationBar />
            <MaxWidthWrapper>
                <TwoThirdsWidthWrapper>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Please upload your csv file here.
                        </p>
                    </Dragger>
                </TwoThirdsWidthWrapper>
            </MaxWidthWrapper>
        </>
    );
};

export default UploadPage;
