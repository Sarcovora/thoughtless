import React, { useState, useEffect } from 'react';

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
    Image,
    Chip,
    Select,
    User,
    Avatar,
    SelectItem,
} from '@nextui-org/react';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavigationBar from './Navigation';

import { columns, users } from './data'; // Import user data

const statusColorMap = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning',
};

const ProfileView = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserChange = (event) => {
        // Extract the selected user's ID from the event object
        const userId = parseInt(event.target.value, 10); // Assuming the IDs are integers

        // Find the user in the 'users' array using the extracted ID
        const user = users.find((user) => user.id === userId);

        // Update the selected user state
        setSelectedUser(user);
    };

    return (
        <>
            <NavigationBar />
            <MaxWidthWrapper>
                <div className="flex justify-start mb-3 mt-3">
                    <Select
                        items={users}
                        label="Select an applicant to view"
                        variant="flat"
                        placeholder="Select a user"
                        classNames={{
                            base: 'max-w-xs',
                            trigger: 'min-h-unit-12 py-2',
                        }}
                        onChange={handleUserChange}
                    >
                        {(user) => (
                            <SelectItem key={user.id} textValue={user.name}>
                                <div className="flex gap-2 items-center">
                                    <Avatar
                                        alt={user.name}
                                        className="flex-shrink-0"
                                        size="sm"
                                        src={user.avatar}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-small">
                                            {user.name}
                                        </span>
                                        <span className="text-tiny text-default-400">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </SelectItem>
                        )}
                    </Select>
                </div>
                {selectedUser ? (
                    <>
                        <Card>
                            <CardHeader className="flex gap-3 justify-center flex-col">
                                <Image
                                    alt="User avatar"
                                    height={60}
                                    radius="md"
                                    src={selectedUser.avatar}
                                    width={60}
                                />

                                <h1 className="text-2xl font-bold">
                                    {selectedUser.name}
                                </h1>

                                <div className="flex flex-col">
                                    <p className="text-small text-default-500">
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <p className="mb-1 font-semibold">Role:</p>
                                <p className="mb-3">{selectedUser.role}</p>

                                <Divider className="mb-3" />

                                <p className="mb-1 font-semibold">Team:</p>
                                <p className="mb-3">{selectedUser.team}</p>

                                <Divider className="mb-3" />

                                <p className="mb-1 font-semibold">Status:</p>

                                <Chip
                                    className="capitalize"
                                    color={statusColorMap[selectedUser.status]}
                                    size="md"
                                    variant="flat"
                                >
                                    {selectedUser.status}
                                </Chip>

                            </CardBody>
                            <Divider />
                            <CardFooter >
                                <Link
                                    isExternal
                                    showAnchorIcon
                                    href={selectedUser.socials.linkedin}
                                >
                                    LinkedIn
                                </Link>
                                <Link
                                    isExternal
                                    showAnchorIcon
                                    href={selectedUser.socials.github}
                                >
                                    Github
                                </Link>
                            </CardFooter>
                        </Card>
                    </>
                ) : (
                    <>
                            <h1 className="text-l font-extralight">Please select a user</h1>
                    </>
                )}
            </MaxWidthWrapper>
        </>
    );
};

export default ProfileView;
