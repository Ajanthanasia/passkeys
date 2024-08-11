export const storeUserData=(data)=>{
    localStorage.setItem('userdetails',JSON.stringify({
        'id':data.id,
        'name': data.name,
        'email': data.email,
        'Is_activate_image_recoganize':data.Is_activate_image_recoganize,
        'Is_activate_Fingerprint_recoganize':data.Is_activate_Fingerprint_recoganize
      }));
    }
export const getUserData=()=>{
    return (JSON.parse(localStorage.getItem('userdetails')));
}

export const RemoveUserData = () => {
    return localStorage.removeItem('userdetails')
}

export const UpdateUser = (data) => {
    localStorage.setItem('UpdateDetails',JSON.stringify({
        'id':data.id,
        'name': data.name,
        'email': data.email,
        'Is_activate_image_recoganize':data.Is_activate_image_recoganize,
        'Is_activate_Fingerprint_recoganize':data.Is_activate_Fingerprint_recoganize
      }));
    }

// export const UpdateGetData = () =>{
//     return (JSON.parse(localStorage.getItem('UpdateDetails')));
// }