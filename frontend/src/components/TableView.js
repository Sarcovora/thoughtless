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
} from '@nextui-org/react';
import { EditIcon } from './EditIcon';
import { DeleteIcon } from './DeleteIcon';
import { EyeIcon } from './EyeIcon';
import { columns, users } from './data';

import NavigationBar from './Navigation';
import MaxWidthWrapper from './MaxWidthWrapper';
import ProfileModal from './ProfileModal';

const statusColorMap = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning',
};

export default function TableView() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserClick = (user) => {
        onOpen();
        setSelectedUser(user);
    };

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <div onClick={() => handleUserClick(user)} className="flex flex-col items-start cursor-pointer hover:bg-gray-200 p-2 rounded-xl">
                        <User
                            avatarProps={{ radius: 'lg', src: user.avatar }}
                            description={user.email}
                            name={cellValue}
                        ></User>
                    </div>
                );
            case 'role':
                return (
                    <div className="flex flex-col items-start">
                        <p className="text-bold text-sm capitalize">
                            {cellValue}
                        </p>
                        <p className="text-bold text-sm capitalize text-default-400">
                            {user.team}
                        </p>
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
            // case 'actions':
            //     return (
            //         <div className="relative flex items-center gap-2">
            //             <Tooltip content="Details">
            //                 <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            //                     <EyeIcon />
            //                 </span>
            //             </Tooltip>
            //             <Tooltip content="Edit user">
            //                 <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            //                     <EditIcon />
            //                 </span>
            //             </Tooltip>
            //             <Tooltip color="danger" content="Delete user">
            //                 <span className="text-lg text-danger cursor-pointer active:opacity-50">
            //                     <DeleteIcon />
            //                 </span>
            //             </Tooltip>
            //         </div>
            //     );
            default:
                return cellValue;
        }
    }, []);

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
                    <TableBody items={users}>
                        {(item) => (
                            <TableRow key={item.id}>
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
                                        {selectedUser ? (selectedUser.name) : 'No user selected'}
                                    </ModalHeader>
                                    <ModalBody>
                                        {selectedUser ? <ProfileModal selectedUser={selectedUser} /> : "No user selected"}
                                    </ModalBody>
                                    <ModalFooter>
                                        {/* <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            Close
                                        </Button> */}
                                        <Button
                                            color="primary"
                                            size='md'
                                            onPress={onClose}
                                        >
                                            Done
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </MaxWidthWrapper>
        </>
    );
}
