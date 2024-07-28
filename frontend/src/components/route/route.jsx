import React from "react";
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import LoginPage from "../signin/login";
import RegisterPage from "../signup/register";
import Dashboard from "../dash/home/home";

function RoutePath() {
    return (
        <div className="container">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage></LoginPage>} ></Route>
                    <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
                    <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RoutePath;