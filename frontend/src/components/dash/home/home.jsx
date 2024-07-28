import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserData } from "../../../services/storage";
import React from "react";
import Webcam from "react-webcam";



function Dashboard() {
    const userdetails = getUserData()
    const navigate = useNavigate();  
    const WebcamComponent = () => <Webcam />;

   return(<>
   hellow
   <p className="text-bold " >{userdetails.name}</p>
   </>)
}

export default Dashboard;