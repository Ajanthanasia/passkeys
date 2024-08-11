import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserData } from "../../../services/storage";

import Webcam from "react-webcam";
import Aside from "../aside";



function Dashboard() {
    const userdetails = getUserData()
    const navigate = useNavigate();
    // const WebcamComponent = () => <Webcam />;


    return (
        <>
            <div className="row mt-1">
                <div className="col-md-3">
                    <Aside />
                </div>
                <div className="col-md-9">
                    <h1>Hello ! {userdetails.name} Welcome to Face recoganize System </h1>
                    <h4 className="text-bold " >{userdetails.email}</h4>
                    {/* <div className="row mt-1">
                        <div className="col-md-8">
                            <Link to="/register_facerecoganize">
                                <button className="btn btn-success form-control">
                                    For Activate the face recoganize system
                                </button>
                            </Link>
                        </div>
                    </div> */}
                </div>
            </div>

        </>
    );
}

export default Dashboard;