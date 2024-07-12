import React from "react";
import { Link } from "react-router-dom";

function LoginPage() {
    return (
        <div className="panel panel-default">
            <div className="row">
                <div className="col-md-8">
                    <span className="btn btn-default form-control">Welcome to Passkeys</span>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <b><label htmlFor="">Email</label></b>
                    <input type="text" className="form-control" />
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <b><label htmlFor="">Password</label></b>
                    <input type="text" className="form-control" />
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-md-8">
                    <button className="btn btn-primary form-control">
                        Login
                    </button>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-md-8">
                    <Link to="/register">
                        <button className="btn btn-success form-control">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;