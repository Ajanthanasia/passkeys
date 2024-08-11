import React from "react";
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import LoginPage from "../signin/login";
import RegisterPage from "../signup/register";
import Dashboard from "../dash/home/home";
import Facerecoganize from "../signin/facerecoganize";
import Profile from "../dash/profile/profile";
import FaceId from "../dash/face-id/face-id";
import Finger from "../dash/finger/finger";
import EditUser from "../dash/profile/editUser"

function RoutePath() {
    return (
        <div className="container">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage></LoginPage>} ></Route>
                    <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
                    <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
                    <Route path="/profile" element={<Profile></Profile>}></Route>
                    <Route path="/face-id" element={<FaceId></FaceId>}></Route>
                    <Route path="/Login_By_face_ID" element={<Facerecoganize></Facerecoganize>}></Route>
                    <Route path="/finger" element={<Finger></Finger>}></Route>
                    <Route path="/edit_user" element={<EditUser></EditUser>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RoutePath;