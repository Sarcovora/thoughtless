import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    getKeyValue,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    RadioGroup,
    Radio,
    CircularProgress,
    Spacer,
    Link,
} from '@nextui-org/react';
import { EditIcon } from './EditIcon';
import { DeleteIcon } from './DeleteIcon';
import { EyeIcon } from './EyeIcon';
import { columns, users } from './data';

import NavigationBar from './Navigation';
import MaxWidthWrapper from './MaxWidthWrapper';
import ProfileModal from './ProfileModal';

import { useNavigate } from 'react-router-dom';

// const statusColorMap = {
//     active: 'success',
//     paused: 'danger',
//     vacation: 'warning',
// };
const statusColorMap = {
    Incomplete: 'success',
    paused: 'danger',
    vacation: 'warning',
};

export default function TableView() {
    const backendURL = 'https://thoughtless-backend.vercel.app';
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);

    const [applicants, setApplicants] = useState(null);
    const [isLoadingApps, setIsLoadingApps] = useState(true);

    const [questions, setQuestions] = useState(null);
    const [infoQuestions, setInfoQuestions] = useState(null);
    const [linkQuestions, setLinkQuestions] = useState(null);
    // const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

    const [org, setOrg] = useState(null);

    const navigate = useNavigate();

    const handleUserClick = (user) => {
        onOpen();
        setSelectedUser(user);
    };

    function gotoUpload() {
        // console.log('Upload button was clicked');
        navigate('/upload');
    }

    useEffect(() => {
        getApps();
        getQuestions();
    }, []);

    // FIXME make sure this has an error state
    function getApps() {
        // console.log('fetching apps');
        const userData = JSON.parse(localStorage.getItem('userData'));
        const org = userData?.org;
        const fetchURL = `${backendURL}/apps/${org}`;
        fetch(fetchURL, {
            method: 'GET', // Make sure to use the correct HTTP method
        })
            .then((response) => response.json())
            .then((data) => {
                setApplicants(data);
                // console.log(applicants)
                setIsLoadingApps(false);
            });
        // console.log(applicants);
    }

    function getQuestions() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const org = userData?.org;
        const fetchURL = `${backendURL}/questions/${org}`;
        fetch(fetchURL, {
            method: 'GET', // Make sure to use the correct HTTP method
        })
            .then((response) => response.json())
            .then((data) => {
                setQuestions(data.questions);
                setInfoQuestions(data.id_info);
                setLinkQuestions(data.links);
                // console.log(questions);
                // console.log(data);
                // setIsLoadingQuestions(false);
            });
    }

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <div
                        onClick={() => handleUserClick(user)}
                        className="flex flex-col items-start cursor-pointer hover:bg-gray-200 p-2 rounded-xl"
                    >
                        <User
                            // avatarProps={{ radius: 'lg', src: user.avatar }}
                            description={user.email}
                            name={cellValue}
                        ></User>
                    </div>
                );
            case 'status':
                return (
                    <div className="flex flex-col items-start">
                        <Chip
                            className="capitalize"
                            color={statusColorMap[user.status]}
                            size="sm"
                            variant="flat"
                        >
                            {cellValue}
                        </Chip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    if (isLoadingApps && applicants === null) {
        return (
            <>
                <NavigationBar />
                <MaxWidthWrapper>
                    <div className="flex items-center justify-center">
                        <CircularProgress
                            className="py-20"
                            size="lg"
                            aria-label="Loading..."
                            color="default"
                        />
                    </div>
                </MaxWidthWrapper>
            </>
        );
    } else if (!isLoadingApps && applicants) {
        // console.log(questions)
        // console.log(applicants);
        return (
            <>
                <NavigationBar />
                <MaxWidthWrapper>
                    <div className="flex justify-start">
                        <Button
                            className="bg-black text-white"
                            variant="flat"
                            // variant="solid"
                            size="md"
                            color="primary"
                            onClick={() => {
                                gotoUpload();
                            }}
                        >
                            Upload Page
                        </Button>
                    </div>
                    <Spacer y={5} />
                    <Table aria-label="Table of all applicant information">
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        {/* <TableBody items={users}> */}
                        <TableBody items={applicants}>
                            {(item) => (
                                // <TableRow key={item.id}>
                                <TableRow key={item.name}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {renderCell(item, columnKey)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex flex-col gap-2">
                        {/* <Button onPress={onOpen}>Open Modal</Button> */}
                        <Modal
                            isDismissable={false}
                            isKeyboardDismissDisabled={true}
                            backdrop="blur"
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            scrollBehavior={'inside'}
                            size="5xl"
                        >
                            <ModalContent
                                style={{
                                    margin: '0.5rem',
                                    width: 'calc(100% - 2.5rem)',
                                    height: 'calc(100% - 3rem)',
                                    maxWidth: 'none',
                                    maxHeight: 'none',
                                }}
                            >
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">
                                            {selectedUser
                                                ? selectedUser.name
                                                : 'No user selected'}
                                        </ModalHeader>
                                        <ModalBody>
                                            {selectedUser ? (
                                                <ProfileModal
                                                    selectedUser={selectedUser}
                                                    questions={questions}
                                                    id_info={infoQuestions}
                                                    links={linkQuestions}
                                                />
                                            ) : (
                                                'No user selected'
                                            )}
                                        </ModalBody>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                </MaxWidthWrapper>
            </>
        );
    } else {
        return <p> Something went wrong </p>;
    }
}
