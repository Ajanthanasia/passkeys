import React from "react";
import Aside from "../aside";

function Finger() {
    return (
        <div className="row mt-1">
            <div className="col-md-3">
                <Aside />
            </div>
            <div className="col-md-9">
                <div className="panel">
                    <div className="panel-default">
                        <b>Hi, </b>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Finger;