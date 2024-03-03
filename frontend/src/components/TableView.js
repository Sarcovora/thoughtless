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
} from '@nextui-org/react';
import { EditIcon } from './EditIcon';
import { DeleteIcon } from './DeleteIcon';
import { EyeIcon } from './EyeIcon';
import { columns, users } from './data';

import NavigationBar from './Navigation';
import MaxWidthWrapper from './MaxWidthWrapper';
import ProfileModal from './ProfileModal';

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
    // const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

    const handleUserClick = (user) => {
        onOpen();
        setSelectedUser(user);
    };

    useEffect(() => {
        getApps();
        getQuestions();
    }, []);

    function getApps() {
        // console.log('fetching apps');
        const fetchURL = `${backendURL}/apps/TPEO`;
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
        const fetchURL = `${backendURL}/questions/TPEO`;
        fetch(fetchURL, {
            method: 'GET', // Make sure to use the correct HTTP method
        })
            .then((response) => response.json())
            .then((data) => {
                setQuestions(data);
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
            // case 'role':
            //     return (
            //         <div className="flex flex-col items-start">
            //             <p className="text-bold text-sm capitalize">
            //                 {cellValue}
            //             </p>
            //             <p className="text-bold text-sm capitalize text-default-400">
            //                 {/* {user.team} */}
            //             </p>
            //         </div>
            //     );
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

    // console.log('from here');
    // console.log(applicants);

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
                            color='default'
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
                    <Table aria-label="Table of all applicant information">
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn
                                    key={column.uid}
                                    // align={
                                    //     column.uid === 'actions'
                                    //         ? 'center'
                                    //         : 'start'
                                    // }
                                >
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
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            scrollBehavior={'inside'}
                            size="full"
                        >
                            <ModalContent>
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
                                                    // isLoadingQuestions={isLoadingQuestions}
                                                    // isLoadingQuestions={false}
                                                />
                                            ) : (
                                                'No user selected'
                                            )}
                                        </ModalBody>
                                        {/* <ModalFooter> */}
                                        {/* <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            Close
                                        </Button> */}
                                        {/* <Button
                                            size='md'
                                            onPress={onClose}
                                            className='bg-black text-white'
                                        >
                                            Done
                                        </Button> */}
                                        {/* </ModalFooter> */}
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
