import React from "react";
import Aside from "../aside";
import { getUserData } from "../../../services/storage";
import { Link } from "react-router-dom";

function Profile() {
    const userdetails = getUserData();
    return (
        <div className="row mt-1">
            <div className="col-md-3">
                <Aside />
            </div>
            <div className="col-md-9">
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel">
                            <div className="panel-default">
                                <b>Hi, {userdetails.name} </b>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-md-12">
                        <img src="" alt="..." className="img-thumbnail" />
                    </div>
                </div> */}
                <div className="row">
                    <div className="col-md-12">
                        <label htmlFor="">email : {userdetails.email}</label>
                    </div>
                </div>

                <div className="row mt-1">
                    <div className="col-md-8">
                        <Link to="/edit_user">
                            <button className="btn btn-success form-control">
                            Edit Your Profile
                            </button>
                        </Link>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;