import React, { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {

    return (
        <div className="panel panel-default">
            <div className="row">
                <div className="col-md-8">
                    <span className="btn btn-default form-control">Register your account</span>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <b><label htmlFor="">Name</label></b>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <b><label htmlFor="">Email</label></b>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter email"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <b><label htmlFor="">Password</label></b>
                    <input type="text" className="form-control" />
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <b><label htmlFor="">Confirm Password</label></b>
                    <input type="text" className="form-control" />
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-md-8">
                    <button className="btn btn-primary form-control">
                        Sign Up
                    </button>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-md-8">
                    <Link to="/">
                        <button className="btn btn-secondary form-control">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;