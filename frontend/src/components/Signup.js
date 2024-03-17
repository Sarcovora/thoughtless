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
} from '@nextui-org/react';
import { EyeFilledIcon } from './EyeFilledIcon';
import { EyeSlashFilledIcon } from './EyeSlashFilledIcon';
import TwoThirdsWidthWrapper from './twoThirdsWidthWrapper';
import NavigationBar from './Navigation';

// import backgroundSvg from '../assets/topographical.svg';

export default function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSignup = (e) => {
        e.preventDefault();
        // Handle signup logic here
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Full Name:', fullName);
        console.log('Email:', email);
        console.log('Password:', password);
    };
    return (
        <div>
            {/* <style>{` */}
            {/*     body { */}
            {/*         background-image: url(${backgroundSvg}); */}
            {/*         background-repeat: no-repeat; */}
            {/*         background-size: cover; */}
            {/*         background-position: center; */}
            {/*     } */}
            {/**/}
            {/*     .card-container { */}
            {/*         background-color: transparent; */}
            {/*     } */}
            {/* `}</style> */}
            <NavigationBar />
            <TwoThirdsWidthWrapper>
                <Card
                // isBlurred
                // className="border-none bg-background/60 dark:bg-default-100/50"
                // shadow="sm"
                >
                    <h1 className="text-4xl font-bold text-center mt-10">
                        Sign Up
                    </h1>
                    <p className="py-2 font-light">Welcome to the family!</p>
                    <CardBody>
                        <div className="flex">
                            <Input
                                placeholder="Your first name"
                                label="First Name"
                                variant="bordered"
                            />
                            <Spacer x={5} />
                            <Input
                                placeholder="Your last name"
                                label="Last Name"
                                variant="bordered"
                            />
                        </div>
                        <Spacer y={5} />
                        <Input
                            placeholder="Your email"
                            label="Email"
                            variant="bordered"
                        />
                        <Spacer y={5} />
                        <Input
                            label="Password"
                            variant="bordered"
                            placeholder="Enter your password"
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
                        />
                        <Spacer y={5} />
                        <div className="ml-auto">
                            <Button
                                className="mx-auto max-w-[66.666%] bg-black text-white"
                                variant="flat"
                                size="md"
                                color="primary"
                            >
                                Sign up
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </TwoThirdsWidthWrapper>
        </div>
    );
}
