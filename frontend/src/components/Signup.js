import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardFooter,
    Divider,
    Spacer,
    Button,
    Input,
    Row,
    Checkbox,
    user,
} from '@nextui-org/react';
import { EyeFilledIcon } from './EyeFilledIcon';
import { EyeSlashFilledIcon } from './EyeSlashFilledIcon';
import TwoThirdsWidthWrapper from './twoThirdsWidthWrapper';
import NavigationBar from './Navigation';

import { useNavigate } from 'react-router-dom';

// import backgroundSvg from '../assets/topographical.svg';

export default function Signup() {
    // FIXME make sure that I deal with auth tokens correctly (expiration)
    // const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [fullName, setFullName] = useState('');
    // const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [org, setOrg] = useState('');

    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const backendURL = 'https://thoughtless-backend.vercel.app';

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState();

    // const handleSignup = (e) => {
    //     e.preventDefault();
    //     // Handle signup logic here
    //     // console.log('First Name:', firstName);
    //     // console.log('Last Name:', lastName);
    //     // console.log('Full Name:', fullName);
    //     // console.log('Email:', email);

    //     // console.log('Username:', username);
    //     // console.log('Password:', password);
    //     // console.log('Org:', org);

    //     // TODO - Add logic to send the data to the backend
    //     const fetchURL = `${backendURL}/reviewer`;
    //     const body = JSON.stringify({
    //         username: username,
    //         password: password,
    //         org: org,
    //     });
    //     fetch(fetchURL, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json', // Set the headers to inform the server about the type of the content
    //         },
    //         body: body,
    //     });
    //     console.log('Signup successful' + username + " " + org);
    //     navigate('/dashboard');
    // };

    const handleSignup = async (e) => {
        e.preventDefault();

        const fetchURL = `${backendURL}/reviewer`;
        const body = JSON.stringify({
            username: username,
            password: password,
            org: org,
        });
        console.log(body);

        try {
            const response = await fetch(fetchURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            const data = await response.json(); // Parse JSON response

            if (response.ok) {
                console.log('Signup successful:', data);
                navigate('/dashboard'); // Navigate to dashboard on success

                // You can store the JWT token in local storage or state management library
                const userData = JSON.stringify({
                    token: data.token,
                    username: data.data.username,
                    org: data.data.org,
                });
                localStorage.setItem('userData', userData);
                // localStorage.setItem('username', data.data.username);
                // console.log("username " + data.data.username)
                // localStorage.setItem('org', data.data.org);
                // console.log("org " + data.data.org)
                // localStorage.setItem('token', data.token);
                // console.log("STORED TOKEN")
            } else {
                setErrorMessage(data.msg || 'Failed to sign up');
                throw new Error(data.msg || 'Failed to sign up');
            }
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Signup failed:', error);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleOrgChange = (e) => {
        setOrg(e.target.value);
    };

    return (
        <div>
            <NavigationBar />
            <TwoThirdsWidthWrapper>
                <Card>
                    <h1 className="text-4xl font-bold text-center mt-10">
                        Sign Up
                    </h1>
                    <p className="py-2 font-light">Welcome to the family!</p>
                    <form onSubmit={handleSignup}>
                        <CardBody>
                            <div className="flex">
                                <Input
                                    label="Userame"
                                    variant="bordered"
                                    placeholder="Choose a username"
                                    onChange={handleUsernameChange}
                                />
                                <Spacer x={5} />
                                <Input
                                    label="Organization"
                                    variant="bordered"
                                    placeholder="Enter your organization name"
                                    onChange={handleOrgChange}
                                />
                            </div>
                            <Spacer y={5} />
                            <Input
                                label="Password"
                                variant="bordered"
                                endContent={
                                    <button
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                type={isVisible ? 'text' : 'password'}
                                placeholder="Enter your password"
                                onChange={handlePasswordChange}
                            />
                            <Spacer y={5} />
                            <div className="ml-auto">
                                <Button
                                    className="mx-auto max-w-[66.666%] bg-black text-white"
                                    variant="flat"
                                    size="md"
                                    color="primary"
                                    type="submit"
                                >
                                    Sign up
                                </Button>
                            </div>
                            {errorMessage && (
                                <p className="py-2 font-light text-red-500 ml-auto mr-auto text-sm">
                                    {errorMessage}
                                </p>
                            )}
                        </CardBody>
                    </form>
                </Card>
            </TwoThirdsWidthWrapper>
        </div>
    );
}
