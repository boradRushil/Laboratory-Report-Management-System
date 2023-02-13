import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimneyMedical, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import Davatar from '@davatar/react';
import { userInfo } from "os";

export default function Navbar(props: any) {
    const { user, login, logout } = useContext(AuthContext);

	// useEffect(() => {
	// 	if(user.logged == true){
	// 		window.location.href = '/';
	// 	}
	// }, [user]);

    return <div>
        {/* {user.logged && */}
        <nav className="navbar justify-content-right rounded-5 navbar-expand-lg  swatch_2">
            <div className="container-fluid ">
                <div className="navbar-brand ms-4 d-flex align-items-center">
                    <FontAwesomeIcon icon={faHouseChimneyMedical} size="lg" />
                    <h4 className="fnt fw-bold ms-2 mb-0 ">Laboratory</h4>
                </div>
                <div className="d-flex align-items-center">
                     
                    <span className="d-flex me-2 fnt fw-bold align-items-center fs-6 swatch_2b rounded-pill p-1">
                        <FontAwesomeIcon icon={faUser} className="p-2 me-2 swatch_6 swatch_2bIn rounded-circle "/>
                        {`${user.user.full_name} ${user.user.wallet.slice(0,5)}...`}
                    </span>
                    
                    <FontAwesomeIcon icon={faRightFromBracket} size="xl" type="button" onClick={logout} className="ms-3 me-5"/>
                </div>
            </div>
        </nav>
        {/* } */}
    </div>
}