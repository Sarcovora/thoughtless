import React, { useState } from 'react';
import { Card, Spacer, Button, Input, Row, Checkbox } from '@nextui-org/react';
import { EyeFilledIcon } from './EyeFilledIcon';
import { EyeSlashFilledIcon } from './EyeSlashFilledIcon';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavigationBar from './Navigation';

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
            <NavigationBar />
            <MaxWidthWrapper>
                <h1 className="text-4xl font-bold text-center mt-10">
                    Sign Up
                </h1>
                <p className="py-2 font-light">Welcome to the family!</p>
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
            </MaxWidthWrapper>
        </div>
    );
}
