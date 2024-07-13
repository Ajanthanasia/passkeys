import React from "react";
import {
    BrowserRouter,
    Link,
    Route,
    Routes,
} from "react-router-dom";
import LoginPage from "../signin/login";
import RegisterPage from "../signup/register";

function RoutePath() {
    return (
        <div className="container">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage></LoginPage>} ></Route>
                    <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RoutePath;