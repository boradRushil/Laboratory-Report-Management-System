import { useEffect, useContext, useState } from "react";
import LoginForm from "../../components/loginComponent";
import { AuthContext } from "../../contexts/authContext";
import RegisterForm from "../../components/registerComponent";

export default function Login() {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<>
			<div className="d-flex flex-wrap p-4 vh-100">
				<div className="col-lg-6 d-lg-flex px-3 d-md-flex d-none justify-content-center align-items-center col-md-12  ">
					<img src="/assets/login.svg" className="img-fluid d-inline-ce" alt="logo" />
				</div>
				<div className="col-lg-6 col-md-12">
					<div className="text-center">
						
						{isLogin ? <LoginForm /> : <RegisterForm /> }
						<br />
						<button
							className="btn btn-primary"
							onClick={() => setIsLogin(!isLogin)}
						>
							{isLogin ? "Register" : "Login"}
						</button>
					</div>
				</div>
			</div>
			
		</>
	);
}
