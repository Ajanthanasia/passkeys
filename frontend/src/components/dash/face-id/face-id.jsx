import React, { useCallback, useRef, useState } from "react";
import Aside from "../aside";
import { getUserData } from "../../../services/storage";
import Webcam from "react-webcam";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function FaceId() {
    const Facerecoganize_Register_Url = "http://localhost:4500/api/v1/register_face_recog";
    const userdetails = getUserData();
    // const updateData=UpdateGetData()
    const [nickname, setNickname] = useState(userdetails.name);
    const [customError, setCustomError] = useState("");
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const navigate = useNavigate(); 
    

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(imageSrc);
        setImgSrc(imageSrc);
        uploadImage(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

    const uploadImage = async (imageSrc) => {
        try {
            const res = await axios.post(Facerecoganize_Register_Url, {
                image: imageSrc,
                user_id: userdetails.id,
                name: nickname,
            });
            alert("succesfuly register the Face Validation")
            // updateData.Is_activate_image_recoganize
            navigate("/dashboard");
            
        } catch (error) {
            setCustomError("Failed to upload the image. Please try again.");
            console.error("Upload image error: ", error);
        }
    };

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
                                <b>Hi, {userdetails.name}</b>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    {imgSrc ? (
                        <img src={imgSrc} alt="webcam" />
                    ) : (
                        <Webcam height={600} width={600} ref={webcamRef} />
                    )}
                    <div className="btn-container">
                        {imgSrc ? (
                            <button className="btn btn-success form-control" onClick={retake}>Retake photo</button>
                        ) : (
                            <button className="btn btn-success form-control" onClick={capture}>Capture photo</button>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <b><label htmlFor="">Nickname</label></b>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your nickname..."
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <code>{customError}</code>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <label htmlFor="">Your photos</label>
                    </div>
                    <div className="col-md-12">
                        <img src="" alt="..." className="img-thumbnail" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FaceId;
