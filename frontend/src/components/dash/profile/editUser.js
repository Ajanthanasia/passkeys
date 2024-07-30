import React, { useEffect, useState } from "react";
import Aside from "../aside";
import { getUserData, storeUserData ,RemoveUserData} from "../../../services/storage";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


function EditUser() {
    const userdetails = getUserData();
    const navigate = useNavigate();
    const [username, setUsername] = useState(userdetails.name);
    const [registerButtonClass, setRegisterButtonClass] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [customError, setCustomError] = useState("");
    const [inputs,setInputs]=useState(userdetails)

    const updateURL = "http://localhost:4500/api/v1/Update_userDetails";

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setUsernameError("");
            setCustomError("");

            if (username === "") {
                setUsernameError("This field is required");
            }
            if (username) {
                const res = await axios.post(`${updateURL}`, {
                    username: username,
                    email: userdetails.email,
                });
                if (res.data.Type == "Success") {
                    RemoveUserData();
                    storeUserData(res.data)
                    navigate("/dashboard");
                }
                else if (res.data.Type != "Success") {
                    setCustomError(res.data.msg)
                }
            }

        } catch (error) {
            setCustomError(error)
            console.log(error);
        }
    }

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
                                <h3>Update your account </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-12">
                            <b><label htmlFor="">Name</label></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <code>{usernameError}</code>
                            <code>{customError}</code>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-md-12">
                            <button type="submit" className='btn btn-primary form-control'>
                                Update
                            </button>
                        </div>
                    </div>
                </form>
                <div className="row">
                    <div className="col-md-12">
                        <Link to="/profile">
                            <button className="btn btn-secondary form-control">
                                back
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>




    );
}

export default EditUser;