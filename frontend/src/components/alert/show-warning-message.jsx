import React, { useState } from "react";

function ShowWarningMessage(params) {
    const [message, setMessage] = useState("");

    setTimeout(() => {
        setMessage(params.msg);
    }, 500);
    return (
        <div className="row">
            {message === "" ?
                ""
                :
                <div className="col-md-12">
                    <button className="btn btn-warning form-control">
                        {message}
                    </button>
                </div>
            }
        </div>
    );
}

export default ShowWarningMessage;