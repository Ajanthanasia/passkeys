export const storeUserData=(data)=>{
    localStorage.setItem('userdetails',JSON.stringify({
        'id':data.id,
        'name': data.name,
        'email': data.email,
      }));
    }
export const getUserData=()=>{
    return (JSON.parse(localStorage.getItem('userdetails')));
}

// export const RemoveUserData = () => {
//     return localStorage.removeItem('userdetails')
// }

// export const UpdateUser = (data) => {
//     localStorage.setItem('UpdateDetails',JSON.stringify({
//         'id': data.id,
//         'username': data.username,
//         'firstname': data.firstname,
//         'lastname': data.lastname,
//         'address': data.address,
//         'phone': data.phone,
//         'role_id':data.role_id
//       }));
//     }

// export const UpdateGetData = () =>{
//     return (JSON.parse(localStorage.getItem('UpdateDetails')));
// }