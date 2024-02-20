import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TableView from "./components/TableView"; 
import Home from "./components/Home";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

import { NextUIProvider } from "@nextui-org/react";

function App() {
  return (
    <div className="App"> 
      <Router>
        <Routes> 
            <Route path="/" element={<Home/> } /> 
            <Route path="/tableview" element={<TableView/> } /> 
        </Routes> 
      </Router>
    </div>  
  );
}

export default App;
