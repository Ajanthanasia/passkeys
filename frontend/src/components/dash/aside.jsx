import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RemoveUserData } from "../../services/storage";

const Aside = () => {
    const navigate = useNavigate();  

    const logout= ()=>{

        RemoveUserData();
        return navigate("/");
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
                <a href="finger">
                    <button className="btn btn-info form-control">
                        Finger Print
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