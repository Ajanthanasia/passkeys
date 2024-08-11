import { RemoveUserData, getUserData } from "./storage";

export const isAuthenticated = () => {
    // console.log(getUserData(),'---getUserData()')
    return getUserData()!=null?true:false;
}

export const Logout = () => {
    return RemoveUserData();
}