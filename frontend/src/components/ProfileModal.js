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
    CircularProgress,
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

const ProfileModal = ({ selectedUser, questions }) => {
    const backendURL = 'https://thoughtless-backend.vercel.app';
    const org = 'TPEO'; // FIXME make sure I'm pulling this from the signed in org
    const reviewer = 'Ben'; // FIXME make sure I'm pulling this from the signed in reviewer
    // console.log('selectedUser', selectedUser.name);

    const [feedback, setFeedback] = useState(null);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);

    useEffect(() => {
        getFeedback();
    }, []);

    function getFeedback() {
        const fetchURL = `${backendURL}/feedback/${org}/${selectedUser.name}/${reviewer}`;
        fetch(fetchURL, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                setFeedback(data);
                setIsLoadingFeedback(false);
            });
    }

    console.log(questions);

    return (
        <>
            {/* <MaxWidthWrapper> */}
            {selectedUser ? (
                <>
                    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
                        <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2 overflow-auto">
                            {/* left side */}
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

                                            {/* FIXME make sure I'm pulling the correct fields */}
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
                                {questions.map((question, index) => (
                                    <QuestionsWithResponse
                                        selectedUser={selectedUser}
                                        questions={questions}
                                        questionId={index}
                                    />
                                ))}

                                <CardPadding />
                            </div>

                            {/* right side */}
                            <div
                                className={`shrink-0 flex-[0.4] lg:w-96 ${
                                    isLoadingFeedback
                                        ? 'flex items-center justify-center'
                                        : ''
                                } overflow-y-auto px-6`}
                            >
                                {isLoadingFeedback ? (
                                    // Loading state
                                    <CircularProgress
                                        className="py-20"
                                        size="lg"
                                        aria-label="Loading..."
                                        color="default"
                                    />
                                ) : (
                                    // Loaded State
                                    <>
                                        <h1 className="font-bold text-center">
                                            Review & Comment
                                        </h1>
                                        <Divider className="my-4" />
                                        <Accordion selectionMode="multiple">
                                            {questions.map(
                                                (question, index) => (
                                                    <AccordionItem
                                                        key={index}
                                                        aria-label={`Question ${
                                                            index + 1
                                                        }`}
                                                        title={`Question ${
                                                            index + 1
                                                        }`}
                                                    >
                                                        <RubricRatings
                                                            feedback={feedback}
                                                            questionId={index}
                                                            reviewer={reviewer}
                                                            org={org}
                                                            applicant={
                                                                selectedUser.name
                                                            }
                                                        />
                                                    </AccordionItem>
                                                ),
                                            )}
                                        </Accordion>
                                    </>
                                )}
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
