import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

export default function NavigationBar() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [org, setOrg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.token;
        setUsername(userData?.username);
        setOrg(userData?.org);
        setIsSignedIn(!!token); // If token is not null or undefined, set isSignedIn to true
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        setIsSignedIn(false);
        navigate('/');
    };

    return (
        <Navbar maxWidth="full">
            <NavbarBrand>
                <Link to="/" className="flex">
                    <p className="nav-link font-bold text-inherit">
                        thoughtless.
                    </p>
                </Link>
            </NavbarBrand>
            <NavbarContent
                className="hidden sm:flex gap-4"
                justify="center"
            ></NavbarContent>
            <NavbarContent justify="end">
                {isSignedIn && (
                    <>
                        <NavbarItem isActive className="pr-4">
                            <Link to="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="">
                            <Button onClick={handleLogout} variant="light">Logout</Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button
                                as={Link}
                                color="primary"
                                to="/dashboard"
                                variant="flat"
                                className="nav-button bg-black text-white"
                                // variant="solid"
                                // className="nav-button"
                            >
                                Hello {username}!
                            </Button>
                        </NavbarItem>
                    </>
                )}
                {!isSignedIn && (
                    <>
                        <NavbarItem className="hidden lg:flex">
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button
                                as={Link}
                                color="primary"
                                to="/signup"
                                variant="flat"
                                className="nav-button bg-black text-white"
                                // variant="solid"
                                // className="nav-button"
                            >
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
        </Navbar>
    );
}
