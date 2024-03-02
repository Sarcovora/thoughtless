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
    Accordion,
    AccordionItem,
    Slider,
	Textarea,
} from '@nextui-org/react';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavigationBar from './Navigation';

import { columns, users } from './data'; // Import user data
import RubricRatings from './RubricRatings';
import QuestionsWithResponse from './QuestionsWithResponse';
import CardPadding from './CardPadding';

const statusColorMap = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning',
};

const ProfileModal = (selectedUser) => {
    selectedUser = selectedUser.selectedUser;

    return (
        <>
            {/* <MaxWidthWrapper> */}
            {selectedUser ? (
                <>
                    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
                        <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
                            {/* left side */}
                            {/* <div className="flex-1 xl:flex"> */}
                            <div className="flex-1 xl:flex flex-col overflow-auto">
                                <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
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
                                        {/* <Divider /> */}
                                        <CardBody>
                                            {/* <p className="mb-1 font-semibold">
                                                Role:
                                            </p>
                                            <p className="mb-3">
                                                {selectedUser.role}
                                            </p> */}

                                            {/* <Divider className="mb-3" />

                                            <p className="mb-1 font-semibold">
                                                Team:
                                            </p>
                                            <p className="mb-3">
                                                {selectedUser.team}
                                            </p> */}


                                            <Divider className="mb-3" />

                                            <p className="mb-1 font-semibold">
                                                Status:
                                            </p>

                                            <Chip
                                                className="capitalize"
                                                color={
                                                    statusColorMap[
                                                        selectedUser.status
                                                    ]
                                                }
                                                size="md"
                                                variant="flat"
                                            >
                                                {selectedUser.status}
                                            </Chip>
                                        </CardBody>
                                        <Divider />
                                        <CardFooter>
                                            {/* <Link
                                                isExternal
                                                showAnchorIcon
                                                href={
                                                    selectedUser.socials
                                                        .linkedin
                                                }
                                            >
                                                LinkedIn
                                            </Link>
                                            <Link
                                                isExternal
                                                showAnchorIcon
                                                href={
                                                    selectedUser.socials.github
                                                }
                                            >
                                                Github
                                            </Link> */}
                                        </CardFooter>
                                    </Card>

                                </div>
                                <QuestionsWithResponse selectedUser={selectedUser} questionId={1} />
                                <QuestionsWithResponse selectedUser={selectedUser} questionId={2} />
                                <QuestionsWithResponse selectedUser={selectedUser} questionId={3} />
                                <QuestionsWithResponse selectedUser={selectedUser} questionId={4} />
                                <QuestionsWithResponse selectedUser={selectedUser} questionId={5} />
                                <QuestionsWithResponse selectedUser={selectedUser} questionId={6} />

                                <CardPadding />

                            </div>

                            {/* right side */}
                            {/* <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t0"> */}
                            <div className="shrink-0 flex-[0.4] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t0">
                                <Accordion selectionMode="multiple">
                                    <AccordionItem
                                        key="1"
                                        aria-label="Question 1"
                                        title="Question 1"
                                    >
                                        <RubricRatings />
                                    </AccordionItem>
                                    <AccordionItem
                                        key="2"
                                        aria-label="Question 2"
                                        title="Question 2"
                                    >
                                        <RubricRatings />
                                    </AccordionItem>
                                    <AccordionItem
                                        key="3"
                                        aria-label="Question 3"
                                        title="Question 3"
                                    >
                                        <RubricRatings />
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-l font-extralight">
                        Please select a user
                    </h1>
                </>
            )}
            {/* </MaxWidthWrapper> */}
        </>
    );
};

export default ProfileModal;
