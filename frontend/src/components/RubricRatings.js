import {
    Slider,
    Textarea,
    Listbox,
    ListboxItem,
    Select,
    SelectItem,
} from '@nextui-org/react';
import React, { useState } from 'react';
import {} from '@nextui-org/react';
import { ListboxWrapper } from './ListboxWrapper';

const RubricRatings = ({ feedback, questionId, applicant }) => {
    // const ratings = feedback.feedbackArray;
    // const comments = feedback.commentsArray;

    const [ratings, setRatings] = useState(feedback.feedbackArray);
    const [comments, setComments] = useState(feedback.commentsArray);

    // console.log(ratings);
    // console.log(comments)

    const userData = JSON.parse(localStorage.getItem('userData'));
    const org = userData?.org;
    const reviewer = userData?.username;
    // console.log(reviewer);
    // console.log(org);
    // console.log(applicant);
    // console.log(ratings);
    // console.log(comments);

    const backendURL = 'https://thoughtless-backend.vercel.app';

    function updateFeedback() {
        // console.log(reviewer);
        // console.log(org);
        // console.log(applicant);
        // console.log(ratings);
        // console.log(comments);
        const fetchURL = `${backendURL}/feedback`;
        console.log(fetchURL)
        // ratings is a 2d array. Unpack that into a 1d array
        const flatRatings = ratings.flat();
        // console.log(fetchURL)
        const body = JSON.stringify({
            reviewer: reviewer,
            org: org,
            app: applicant,
            feedback_array: flatRatings,
            comments_array: comments,
        });
        console.log(body);
        fetch(fetchURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the headers to inform the server about the type of the content
            },
            body: body,
        });
    }
    // const [selectedKeys, setSelectedKeys] = React.useState(new Set(['text']));

    // const selectedValue = React.useMemo(
    //     () => Array.from(selectedKeys).join(', '),
    //     [selectedKeys],
    // );

    const handleCommentsChange = (e) => {
        const newComments = [...comments]; // Create a copy of the comments array
        newComments[questionId] = e.target.value; // Update the value for the specific questionId
        setComments(newComments); // Update the state
        updateFeedback();
    };

    const rubric = [
        {
            label: '1. Unclear and Incomplete',
            value: 1,
            description:
                'The answer is vague, lacks relevant details, and does not address the question.',
        },
        {
            label: '2. Somewhat Relevant',
            value: 2,
            description:
                'The answer addresses the question but lacks clarity and/or sufficient detail.',
        },
        {
            label: '3. Clear but Basic',
            value: 3,
            description:
                'The answer is clear and relevant but only touches on the most obvious points.',
        },
        {
            label: '4. Detailed and Insightful',
            value: 4,
            description:
                'The answer provides clear, relevant, and well-thought-out points with good insight.',
        },
        {
            label: '5. Exceptionally Articulate',
            value: 5,
            description:
                'The answer goes above and beyond, offering exceptional clarity, relevance, and deep insight.',
        },
    ];

    return (
        <>
            <Slider
                size="md"
                step={1}
                color="foreground"
                label="Response rating"
                showSteps={false}
                maxValue={5}
                minValue={1}
                className="max-w-md"
                defaultValue={ratings[questionId]}
                onChange={(value) => {
                    console.log("BEFORE")
                    console.log(ratings)
                    ratings[questionId] = value;
                    console.log("AFTER")
                    console.log(ratings)
                    updateFeedback();
                }}
            />
            {/* <Select
                isRequired
                label="Rating"
                placeholder="Select a rating"
                defaultSelectedKeys={[]}
                className="max-w-xs"
            >
                {rubric.map((itemRating) => (
                    <SelectItem key={itemRating.value} value={itemRating.value}>
                        {itemRating.label}
                    </SelectItem>
                ))}
            </Select> */}
            {/* <div className="flex flex-col gap-2 max-w-md">
                <ListboxWrapper className="max-w-md">
                    <Listbox
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                    >
                        <ListboxItem key="1"><strong>1. Unclear and Incomplete: </strong>The answer is vague, lacks relevant details, and does not address the question.</ListboxItem>
                        <ListboxItem key="2">Number</ListboxItem>
                        <ListboxItem key="3">Date</ListboxItem>
                        <ListboxItem key="4">Single Date</ListboxItem>
                        <ListboxItem key="5">Iteration</ListboxItem>
                    </Listbox>
                </ListboxWrapper>
                <p className="text-small text-default-500">
                    Selected value: {selectedValue}
                </p>
            </div> */}
            <Textarea
                minRows={1}
                maxRows={3}
                variant={'flat'}
                label="Comments"
                labelPlacement="outside"
                placeholder={
                    (comments[questionId] && comments[questionId].length > 0)
                        ? comments[questionId]
                        : 'Additional comments here'
                }
                // value={
                //     comments[questionId].length > 0 ? comments[questionId] : ''
                // }
                value={comments[questionId] || ''} // Use the value from the state
                // onValueChange={(value) => {
                //     comments[questionId] = value;
                //     updateFeedback();
                // }}
                onChange={handleCommentsChange} // Update the state when the value changes
                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
            />
        </>
    );

    // Handler for when the rating changes
    // const handleRatingChange = (value) => {
    //     const newRatings = [...ratings]; // Create a copy of the ratings array
    //     newRatings[questionId] = value; // Update the value for the specific questionId
    //     setRatings(newRatings); // Update the state
    //     updateFeedback();
    // };

    // // Handler for when the comments change
    // const handleCommentsChange = (e) => {
    //     const newComments = [...comments]; // Create a copy of the comments array
    //     newComments[questionId] = e.target.value; // Update the value for the specific questionId
    //     setComments(newComments); // Update the state
    //     updateFeedback();
    // };

    // return (
    //     <>
    //         <Slider
    //             // ... other props
    //             //             size="md"
    //             //             step={1}
    //             //             color="foreground"
    //             //             label="Response rating"
    //             // showSteps={false}
    //             maxValue={5}
    //             minValue={1}
    //             //             className="max-w-md" // FIXME could be the problem with scrollbar
    //             defaultValue={ratings[questionId]}
    //             onChange={(value) => handleRatingChange(value)}
    //         />
    //         <Textarea
    //             minRows={1}
    //             maxRows={3}
    //             variant={'flat'}
    //             label="Comments"
    //             labelPlacement="outside"
    //             placeholder={
    //                 comments[questionId].length > 0
    //                     ? comments[questionId]
    //                     : 'Additional comments here'
    //             }
    //             value={comments[questionId] || ''} // Use the value from the state
    //             onChange={handleCommentsChange} // Update the state when the value changes
    //         />
    //     </>
    // );
};

export default RubricRatings;
