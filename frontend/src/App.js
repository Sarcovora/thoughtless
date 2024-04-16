import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TableView from './components/TableView';
import ProfileView from './components/ProfileView';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UploadPage from './components/UploadPage';

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
} from '@nextui-org/react';

import { NextUIProvider } from '@nextui-org/react';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/tableview" element={<TableView />} />
                    <Route path="/dashboard" element={<TableView />} />
                    <Route path="/profileview" element={<ProfileView />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
