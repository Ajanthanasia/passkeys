import React, { useCallback, useEffect, useRef, useState } from "react";
import Aside from "../aside";
import { getUserData } from "../../../services/storage";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";

function ViewSource() {
    const Facerecoganize_verify_Url = "http://localhost:4500/api/v1/varify_face_id/";
    const update_source_url = "http://localhost:4500/api/v1/update_source_detail/";
    const delete_source_url = "http://localhost:4500/api/v1/delete_source_detail/";
    const userdetails = getUserData();
    const webcamRef = useRef(null);
    // const location = useLocation();

    // const { details } = location.state || {};

    const [source, setSource] = useState("");
    const [password, setPassword] = useState("");
    const [source_url, setSource_url] = useState("");
    const [source_id, setSource_id] = useState("");
    const [customError, setCustomError] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [showFacePopup, setShowFacePopup] = useState(false);
    const [showFacePopupSave, setShowFacePopupSave] = useState(false);
    const [showFacePopupDelete, setShowFacePopupDelete] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const [isFaceVerified, setIsFaceVerified] = useState(false);
    const [details,setDetails]=useState([])
    const [updateDetail,setUpdateDetail]=useState([])

    const fetchData = useCallback(async () => {
        const view_source_url = "http://localhost:4500/api/v1/get_source_detail/";
        try {
            const res = await axios.get(view_source_url + userdetails.id);
            setDetails(res.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }, [userdetails.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEditClick = (index, item) => {
        setImgSrc(null);
        setCustomError(null)
        setShowFacePopup(true);
        setShowFacePopupSave(false);
        setCustomError(null);
        setEditIndex(index);
        setSource(item.source);
        setPassword(item.password);
        setSource_url(item.source_url);
        setSource_id(item.id);
    };

    const handleSaveClick = (index,item) => {
        setEditIndex(index);
        setSource(item.source);
        setPassword(item.password);
        setSource_url(item.source_url);
        setSource_id(item.id);
        setUpdateDetail({
            source:source,
            source_url:source_url,
            source_id:source_id,
            password:password
        })
        setShowFacePopup(false);
        setShowFacePopupSave(true);
        setImgSrc(null);
    };

    const handleDeleteClick =(index,item) =>{
        setSource_id(item.id);
        setShowFacePopup(false);
        setShowFacePopupSave(false);
        setShowFacePopupDelete(true);
        setImgSrc(null);

    }

    const handleBackClick = () => {
        setEditIndex(null);
    };
    const capture =  () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        uploadImage(imageSrc);
    };
    const capture_save = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        uploadImage_save(imageSrc);
    };

    const capture_delete = () =>{
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        uploadImage_delete(imageSrc);
    }
    const retake = () => {
        setImgSrc(null);
        setCustomError("");
    };

    const uploadImage = async (imageSrc) => {
        try {
            const res = await axios.post(`${Facerecoganize_verify_Url}${userdetails.id}`, { image: imageSrc });
            if (res.data.Type === "Success") {
                setIsFaceVerified(true);
                setShowFacePopup(false);
            } else {
                setCustomError(res.data.msg);
            }
        } catch (error) {
            setCustomError("Failed to upload the image. Please try again.");
        }
    };

    const uploadImage_save = async (imageSrc) => {
        try {
            const res = await axios.post(`${Facerecoganize_verify_Url}${userdetails.id}`, { image: imageSrc });
            if (res.data.Type === "Success") {
                setIsFaceVerified(true);
                setShowFacePopupSave(false);
                const updatedData = {
                    user_id: userdetails.id,
                    source:updateDetail.source,
                    password:updateDetail.password,
                    source_url:updateDetail.source_url,
                };
                const res2 = await axios.post(`${update_source_url}${source_id}`, updatedData);
                if (res2.data.Type === "Success") {
                    fetchData();
                    setIsFaceVerified(false);
                    setShowFacePopupSave(false);
                    setEditIndex(null);
                } else {
                    setCustomError(res2.data.msg);
                }
            } else {
                setCustomError(res.data.msg);
            }
        } catch (error) {
            setCustomError("Failed to upload the image. Please try again.");
        }
    };
 
    const uploadImage_delete =async (imageSrc) => {
        try {
            const res = await axios.post(`${Facerecoganize_verify_Url}${userdetails.id}`, { image: imageSrc });
            if (res.data.Type === "Success") {
                setIsFaceVerified(true);
                setShowFacePopupDelete(false);
                const deletedData = {
                    user_id: userdetails.id
                };
                const res2 = await axios.post(`${delete_source_url}${source_id}`, deletedData);
                if (res2.data.Type === "Success") {
                    fetchData();
                    setIsFaceVerified(false);
                    setShowFacePopupDelete(false);
                    setEditIndex(null);
                } else {
                    setCustomError(res2.data.msg);
                }
            } else {
                setCustomError(res.data.msg);
            }
        } catch (error) {
            setCustomError("Failed to upload the image. Please try again.");
        }
    };

    return (
        <>
            <div className="row mt-1">
                <div className="col-md-3">
                    <Aside />
                </div>
                <div className="col-md-9">
                    <table className="table caption-top bg-white rounded">
                        <caption className="text-white fs-4">Recent Orders</caption>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Source</th>
                                <th scope="col">URL</th>
                                <th scope="col">Password</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details?.map((item, index) => {
                                const isEditing = editIndex === index;

                                return (
                                    <tr key={item.id}>
                                        <th scope="row">{item.id}
                                        <input
                                                type="text"
                                                value={item.id}
                                                onChange={(e) => setSource_id(e.target.value)}
                                                hidden
                                            />
                                        </th>
                                        <td>
                                            <input
                                                type="text"
                                                value={isEditing ? source : item.source}
                                                onChange={(e) => setSource(e.target.value)}
                                                disabled={!isEditing || !isFaceVerified}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={isEditing ? source_url : item.source_url}
                                                onChange={(e) => setSource_url(e.target.value)}
                                                disabled={!isEditing || !isFaceVerified}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type={isEditing && isFaceVerified ? "text" : "password"}
                                                value={isEditing ? password : item.password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={!isEditing || !isFaceVerified}
                                            />
                                        </td>
                                        <td>
                                            {isEditing && isFaceVerified ? (
                                                <>
                                                    <button type="button" className="btn btn-success" onClick={()=>handleSaveClick(index,item)}>
                                                        Save
                                                    </button>
                                                    <button type="button" className="btn btn-secondary" onClick={handleBackClick}>
                                                        Back
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => handleEditClick(index, item)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button type="button" className="btn btn-secondary"  onClick={() => handleDeleteClick(index, item)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {showFacePopup && (
                        <div className="otp-popup">
                            <div className="otp-popup-content">
                                <code>{customError}</code>
                                {imgSrc ? (
                                    <img src={imgSrc} alt="webcam" />
                                ) : (
                                    <Webcam height={300} width={200} ref={webcamRef} />
                                )}
                                <div className="row mt-1">
                                    <div className="col-md-8">
                                        {imgSrc ? (
                                            <button className="btn btn-success form-control" onClick={retake}>
                                                Retake
                                            </button>
                                        ) : (
                                            <button className="btn btn-success form-control" onClick={capture}>
                                                Verify your face ID
                                            </button>
                                        )}
                                        <button className="btn btn-primary form-control" onClick={() => setShowFacePopup(false)}>
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showFacePopupSave && (
                        <div className="otp-popup">
                            <div className="otp-popup-content">
                                <code>{customError}</code>
                                {imgSrc ? (
                                    <img src={imgSrc} alt="webcam" />
                                ) : (
                                    <Webcam height={300} width={200} ref={webcamRef} />
                                )}
                                <div className="row mt-1">
                                    <div className="col-md-8">
                                        {imgSrc ? (
                                            <button className="btn btn-success form-control" onClick={retake}>
                                                Retake
                                            </button>
                                        ) : (
                                            <button className="btn btn-success form-control" onClick={capture_save}>
                                                Verify your face ID
                                            </button>
                                        )}
                                        <button className="btn btn-primary form-control" onClick={() => setShowFacePopupSave(false)}>
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {showFacePopupDelete && (
                        <div className="otp-popup">
                            <div className="otp-popup-content">
                                <code>{customError}</code>
                                {imgSrc ? (
                                    <img src={imgSrc} alt="webcam" />
                                ) : (
                                    <Webcam height={300} width={200} ref={webcamRef} />
                                )}
                                <div className="row mt-1">
                                    <div className="col-md-8">
                                        {imgSrc ? (
                                            <button className="btn btn-success form-control" onClick={retake}>
                                                Retake
                                            </button>
                                        ) : (
                                            <button className="btn btn-success form-control" onClick={capture_delete}>
                                                Verify your face ID
                                            </button>
                                        )}
                                        <button className="btn btn-primary form-control" onClick={() => setShowFacePopupDelete(false)}>
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default ViewSource;