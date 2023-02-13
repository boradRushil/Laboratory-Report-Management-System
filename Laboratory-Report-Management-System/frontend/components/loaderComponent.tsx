import { useContext } from "react";
import { LoaderContext } from "../contexts/loaderContext";

export default function LoaderComponent(props: any) {
	const { loader, startLoading, stopLoading } = useContext(LoaderContext);

	// return (
	// 	<div>
	// 		{(loader > 0) && (
	// 			<div className="backdrop">
	// 				<div className="loader"></div>
	// 			</div>
	// 		)}
	// 	</div>
	// );
	if (loader > 0) {
		return (
			<div className="backdrop">
				<div className="loader"></div>
			</div>
		);
	} else {
		return (<></>);
	}
}
