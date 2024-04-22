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
    // const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const backendURL = 'https://thoughtless-backend.vercel.app';

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState();

    const handleLogin = async (e) => {
        e.preventDefault();

        // console.log("HA YOU THOUGHT")
        const fetchURL = `${backendURL}/login`;
        const body = JSON.stringify({
            // username: username,
            email: email,
            password: password,
        });

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
                // console.log('Login successful:', data);
                navigate('/dashboard'); // Navigate to dashboard on success

                // You can store the JWT token in local storage or state management library
                const userData = JSON.stringify({
                    token: data.token,
                    username: data.data.email,
                    org: data.data.org,
                });
                localStorage.setItem('userData', userData);
            } else {
                setErrorMessage(data.msg || 'Failed to sign up');
                throw new Error(data.msg || 'Failed to sign up');
            }
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Login failed:', error);
        }
    };

    // const handleUsernameChange = (e) => {
    //     setUsername(e.target.value);
    // };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    return (
        <div>
            <NavigationBar />
            <TwoThirdsWidthWrapper>
                <Card>
                    <h1 className="text-4xl font-bold text-center mt-10">
                        Login
                    </h1>
                    <p className="py-2 font-light">Glad to have you back!</p>
                    <form onSubmit={handleLogin}>
                        <CardBody>
                            {/* <div className="flex">
                                <Input
                                    label="Userame"
                                    variant="bordered"
                                    placeholder="Choose a username"
                                    onChange={handleUsernameChange}
                                />
                            </div> */}
                            <div className="flex">
                                <Input
                                    label="Email"
                                    variant="bordered"
                                    placeholder="Enter your email"
                                    onChange={handleEmailChange}
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
                                    // className="mx-auto max-w-[66.666%]"
                                    variant="flat"
                                    // variant="solid"
                                    size="md"
                                    color="primary"
                                    type="submit"
                                >
                                    Login
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
