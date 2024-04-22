import React, { useState, useEffect } from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavigationBar from './Navigation';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spacer,
    Card,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@nextui-org/react';

import { InboxOutlined } from '@ant-design/icons';
import TwoThirdsWidthWrapper from './twoThirdsWidthWrapper';
import responses from '../scraping/responses.json';

import SelectDataType from './SelectDataType';
import UploadBox from './UploadBox';

const categorizeResponses = (responses, orgDetails) => {
    const apps = responses.map((applicant) => {
        // const app = { responses: {}, id_info: [], hyperlinks: [] };
        // FIXME make sure the org is correct
        const app = { responses: [], id_info: [], hyperlinks: [], org: 'tpeo' };

        for (const key of Object.keys(applicant)) {
            const type = orgDetails[key] || 'question';

            if (type === 'name') {
                app.name = applicant[key];
            } else if (type === 'link') {
                app.hyperlinks.push(applicant[key]);
            } else if (type === 'info') {
                app.id_info.push(applicant[key]);
            } else if (type === 'linkInfo') {
                app.id_info.push(applicant[key]);
                app.hyperlinks.push(applicant[key]);
            } else {
                // app.responses[key] = applicant[key];
                app.responses.push(applicant[key]);
            }
        }

        return app;
    });

    return apps;
};

const UploadPage = ({}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [orgDetails, setOrgDetails] = useState(null);
    const [responses, setResponses] = useState(null); // Initialize responses state to null

    const handleUploadComplete = () => {
        onOpenChange(false);
    };

    // Function to handle the JSON response from the UploadBox
    const handleUploadSuccess = (uploadedResponses) => {
        setResponses(uploadedResponses); // Update the state with the new data
        // initialize orgDetails to be an object with the keys being the columns and the values being 'question'
        // console.log(Object.keys(uploadedResponses[0]));
        const initialOrgDetails = Object.keys(uploadedResponses[0]).reduce(
            (acc, key) => ({
                ...acc,
                [key]: 'question',
            }),
            {},
        );
        // console.log(initialOrgDetails);

        setOrgDetails(initialOrgDetails);
        // setOrgDetails(Object.keys(uploadedResponses[0]).reduce((acc, key) => ({ ...acc, [key]: 'question' })));
        // console.log('RESPONSES');
        // console.log(responses);
        // console.log('ORG DETAILS');
        // console.log(orgDetails);
    };

    // create this array of objects from the responses file's keys
    const columns = responses
        ? Object.keys(responses[0]).map((key) => ({
              name: key,
          }))
        : [];

    const handleSaveAndContinue = async () => {
        // FIXME if I don't get a name field, prompt user to get a name field
        // Categorize the responses
        const appsData = categorizeResponses(responses, orgDetails);

        // Prepare the data for the /org/details POST request
        const orgDetailsData = {
            id_info: Object.keys(orgDetails).filter(
                (key) =>
                    orgDetails[key] === 'info' ||
                    orgDetails[key] === 'linkInfo',
            ), // collect all unique id_info into one array
            hyperlinks: Object.keys(orgDetails).filter(
                (key) =>
                    orgDetails[key] === 'link' ||
                    orgDetails[key] === 'linkInfo',
            ), // collect all unique hyperlinks into one array
            questions: Object.keys(orgDetails).filter(
                (key) => orgDetails[key] === 'question',
            ),
            // FIXME make sure this is the correct org
            org: 'tpeo', // this needs to be dynamically determined based on your logic
        };

        // console.log('APP DATA');
        // console.log(appsData);
        // console.log('ORG DATA');
        // console.log(orgDetailsData);

        // Send POST requests to both endpoints
        try {
            const detailsResponse = await fetch(
                'https://thoughtless-backend.vercel.app/org/details',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orgDetailsData),
                },
            );

            if (!detailsResponse.ok) {
                throw new Error('Failed to post organization details.');
            }

            const appsResponse = await fetch(
                'https://thoughtless-backend.vercel.app/apps',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(appsData),
                },
            );

            if (!appsResponse.ok) {
                throw new Error('Failed to post applications.');
            }

            // Handle successful POST requests here, such as closing the modal or notifying the user
            // console.log('Data posted successfully');
        } catch (error) {
            // Handle errors here, such as updating the UI to display an error message
            console.error(error);
        }
    };

    return (
        <>
            <NavigationBar />
            <MaxWidthWrapper>
                <div className="flex justify-start">
                    <Button
                        className="bg-black text-white"
                        variant="flat"
                        size="md"
                        color="primary"
                        onPress={onOpen}
                    >
                        Upload a Spreadsheet
                    </Button>
                    <Modal
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                        backdrop="blur"
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        motionProps={{
                            variants: {
                                enter: {
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        duration: 0.3,
                                        ease: 'easeOut',
                                    },
                                },
                                exit: {
                                    y: -20,
                                    opacity: 0,
                                    transition: {
                                        duration: 0.2,
                                        ease: 'easeIn',
                                    },
                                },
                            },
                        }}
                    >
                        <ModalContent>
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Upload a Spreadsheet
                                </ModalHeader>
                                <ModalBody>
                                    <p>
                                        Choose a csv file with application form
                                        responses from your computer or drop it
                                        below to upload
                                    </p>
                                    <UploadBox
                                        onServerResponse={handleUploadSuccess}
                                        onUploadComplete={handleUploadComplete}
                                    />
                                </ModalBody>
                                <ModalFooter></ModalFooter>
                            </>
                            {/* )} */}
                        </ModalContent>
                    </Modal>
                </div>
                <>
                    <Spacer y={5} />
                    <Card className="w-full">
                        <div className="text-lg font-bold text-left mx-5 my-3">
                            Uploaded Data
                        </div>
                        {responses ? ( // Conditionally render the table only if responses is not null
                            <Table
                                isHeaderSticky
                                // isStriped
                                aria-label="Uploaded Spreadsheet Preview"
                                removeWrapper
                                classNames={{
                                    base: 'max-h-[400px] overflow-scroll',
                                }}
                            >
                                {/* FIXME Make sure that if there are too many columns it starts scrolling */}
                                <TableHeader columns={columns}>
                                    {(column) => (
                                        <TableColumn
                                            key={column.name}
                                            className="text-center"
                                        >
                                            {column.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={responses}>
                                    {responses.map((response, index) => (
                                        <TableRow key={index}>
                                            {columns.map((column, index) => (
                                                <TableCell key={index}>
                                                    {response[column.name]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-lg font-thin text-center mx-5 mb-5">
                                Please upload some data first
                            </div>
                        )}
                    </Card>
                    <Spacer y={5} />
                    <Card className="w-full">
                        {responses && ( // Conditionally render the table only if responses is not null
                            <>
                                <div className="text-lg font-bold text-left mx-5 my-3">
                                    Labeled Data
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 p-4">
                                    {columns.map((column, index) => (
                                        <div
                                            key={index}
                                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="text-sm font-bold mb-1 text-center">
                                                    {column.name}
                                                </div>
                                                <SelectDataType
                                                    key={index}
                                                    dataName={column.name}
                                                    orgDetails={orgDetails}
                                                    setOrgDetails={
                                                        setOrgDetails
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center mt-4">
                                    <Button
                                        className="mx-auto max-w-[200px] bg-black text-white mb-3"
                                        variant="flat"
                                        size="md"
                                        color="primary"
                                        onClick={handleSaveAndContinue}
                                    >
                                        Save and Continue
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </>
            </MaxWidthWrapper>
        </>
    );
};

export default UploadPage;
