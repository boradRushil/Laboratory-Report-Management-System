import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Navbar from "../components/navbarComponent";
import Laboratory from "../components/LaboratoryComponent";
import { AuthContext } from "../contexts/authContext";
import { useContext, useState, useEffect } from "react";
import ConnectToMetamask from "../components/ConnectToMetamask";
import RegisterDialog from "../components/RegisterDialog";
import Hospital from "../components/Hospital";
import Patient from "../components/Patient";
import { LoaderContext } from "../contexts/loaderContext";
const Home: NextPage = () => {
	const [openConnectToWalletDialog, setOpenConnectToWalletDialog] =
		useState(false);
	const { user, login } = useContext(AuthContext);
	const {startLoading, stopLoading} = useContext(LoaderContext)
	const [openRegister, setOpenRegister] = useState(false);

	useEffect(() => {
		if(user.loading){
			startLoading();
		}else{
			stopLoading();
			if(!user.logged){
				setOpenConnectToWalletDialog(true);
			}else{
				setOpenConnectToWalletDialog(false);
				console.log(user);
				if(user.user === null || user.user === {}){
					setOpenRegister(true);
				}else{
					setOpenRegister(false);
				}
			}
		}
		
	},[user])

	return (
	
		<div >
			{!user.loading && <>
			{console.log(user)}
			{user.logged && user.user!==null && user.user!=={} && 
			<>
			<Navbar/>
			{user.logged && user.user.user_type === "patient" && <Patient />}
			{user.logged && user.user.user_type === "laboratary" && <Laboratory />}
			{user.logged && user.user.user_type === "hospital" && <Hospital />}
			
			</>
			}
			{/* <Navbar/>
			<div className="container-fluid">
			</div> */}
			{/* <Laboratory	 /> */}
			
			<ConnectToMetamask
				open={openConnectToWalletDialog}
				close={() => setOpenConnectToWalletDialog(false)}
			/>
			<RegisterDialog
				open={openRegister}
				user={user}
				close={() => setOpenRegister(false)}
			/>
			</>}
		</div>
	);
};

export default Home;
