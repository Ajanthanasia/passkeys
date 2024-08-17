import React, { useState } from "react";
import Aside from "../aside";
import { getUserData } from "../../../services/storage";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function AddSource() {
    const add_source = "http://localhost:4500/api/v1/register_source";
    const navigate = useNavigate();
    const userdetails = getUserData();

    const [source, setSource] = useState("");
    const [password, setPassword] = useState("");
    const [source_url, setSource_url] = useState("");

    const [customError, setCustomError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");

    const checkPasswordStrength = (password) => {
        if (password.length <= 4) {
            return "Weak password";
        } else if (password.length < 8) {
            return "Medium password";
        } else {
            const hasUpperCase = /[A-Z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (hasUpperCase && hasNumber && hasSpecialChar) {
                return "Strong password";
            } else {
                return "Medium password";
            }
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCustomError("");
        if (!source) return setCustomError("Source is required");
        if (!password) return setCustomError("Password is required");
        if (!source_url) return setCustomError("URL is required");

        try {
            const res = await axios.post(add_source, {
                user_id: userdetails.id,
                source: source,
                password: password,
                source_url: source_url,
            });
            if (res.data.Type === "Success") {
                navigate("/view_source");
            } else {
                setCustomError(res.data.msg);
            }
        } catch (error) {
            setCustomError("An error occurred during registration");
        }
    };

    return (
        <div className="row mt-1">
            <div className="col-md-3">
                <Aside />
            </div>
            <div className="col-md-9">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-8">
                            <b><label>Source</label></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your source...."
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <b><label>URL</label></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="www.yourURL.com"
                                value={source_url}
                                onChange={(e) => setSource_url(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <b><label>Password</label></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your password..."
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <p>Password strength: {passwordStrength}</p>
                            <code>{customError}</code>
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col-md-8">
                            <button type="submit" className="btn btn-primary form-control">
                                Add Source
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSource;
