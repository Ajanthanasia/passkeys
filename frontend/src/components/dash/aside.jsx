import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RemoveUserData } from "../../services/storage";
import { getUserData } from "../../services/storage";
import axios from 'axios';

const Aside = () => {
    const navigate = useNavigate();  
    const view_source="http://localhost:4500/api/v1/get_source_detail/"
    const userdetails = getUserData();
    
    const logout= ()=>{

        RemoveUserData();
        return navigate("/");
    }

    const view_all_source = async (e) =>{
        e.preventDefault();        
        navigate("/view_source");
    }
    return (
        <div className="row">
            <div className="col-md-12 mb-1">
                <a href="/dashboard">
                    <button className="btn btn-info form-control">
                        Home
                    </button>
                </a>
            </div>
            <div className="col-md-12 mb-1">
                <a href="profile">
                    <button className="btn btn-info form-control">
                        Profile
                    </button>
                </a>
            </div>
            <div className="col-md-12 mb-1">
                <button className="btn btn-info form-control">
                    Email Verify
                </button>
            </div>
            <div className="col-md-12 mb-1">
                <a href="/face-id">
                    <button className="btn btn-info form-control">
                        Face ID
                    </button>
                </a>
            </div>
            <div className="col-md-12 mb-1">
                <a href="/password_change">
                    <button className="btn btn-info form-control">
                        Change Password
                    </button>
                </a>
            </div>
            <div className="col-md-12 mb-1">
                <a href="/add_source">
                    <button className="btn btn-info form-control">
                        Add Source
                    </button>
                </a>
            </div>
            <div className="col-md-12 mb-1">
                <a href="">
                    <button className="btn btn-info form-control" onClick={view_all_source}>
                        View Source
                    </button>
                </a>
            </div>
            <div className="col-md-12 mb-1">
                <button className="btn btn-danger form-control" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
export default Aside;