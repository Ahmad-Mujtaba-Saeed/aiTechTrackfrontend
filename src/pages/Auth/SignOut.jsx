import React , {useEffect} from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";

const SignOut = () => {
    const dispatch = useDispatch(); 
    
    const handleSignOut = () => {
        dispatch(logout());
    };

    useEffect(() => {
        handleSignOut();
        window.location.href = "/";
    }, []);
    
    return (
        <div>
            <h1>Sign Out</h1>
        </div>
    );
};

export default SignOut;