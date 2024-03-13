import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TableView from './TableView';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
} from '@nextui-org/react';

export default function NavigationBar({ isSignedIn = true }) {
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
                <NavbarItem isActive className="pr-4">
                    <Link to="/tableview" className="nav-link">
                        Dashboard
                    </Link>
                </NavbarItem>
                {isSignedIn ? (
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
                            >
                                Sign Up
                            </Button>
                        </NavbarItem>{' '}
                    </>
                ) : null}
            </NavbarContent>
        </Navbar>
    );
}
