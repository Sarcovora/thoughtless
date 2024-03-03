import { Slider, Textarea } from '@nextui-org/react';
import React, { useState } from 'react';

const RubricRatings = ({ feedback, questionId, reviewer, org, applicant }) => {
    // const ratings = feedback.feedbackArray;
    // const comments = feedback.commentsArray;

    const [ratings, setRatings] = useState(feedback.feedbackArray);
    const [comments, setComments] = useState(feedback.commentsArray);
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
        // console.log(fetchURL)
        const body = JSON.stringify({
            reviewer,
            org,
            app: applicant,
            feedback_array: ratings,
            comments_array: comments,
        });
        // console.log(body);
        fetch(fetchURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the headers to inform the server about the type of the content
            },
            body: body,
        });
    }

    const handleCommentsChange = (e) => {
        const newComments = [...comments]; // Create a copy of the comments array
        newComments[questionId] = e.target.value; // Update the value for the specific questionId
        setComments(newComments); // Update the state
        updateFeedback();
    };

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
                className="max-w-md" // FIXME could be the problem with scrollbar
                defaultValue={ratings[questionId]}
                onChange={(value) => {
                    ratings[questionId] = value;
                    updateFeedback();
                }}
            />
            <Textarea
                minRows={1}
                maxRows={3}
                variant={'flat'}
                label="Comments"
                labelPlacement="outside"
                placeholder={
                    comments[questionId].length > 0
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
