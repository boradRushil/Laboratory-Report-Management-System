import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import BackendService from "../services/backendService";
import { LoaderContext } from "../contexts/loaderContext";



export default function Laboratory(props: any) {
    const {user} = useContext(AuthContext);
    const {startLoading, stopLoading} = useContext(LoaderContext);
    const [reportDetails,setReportDetails] = useState({
        hospitalAddress: "0x126AD44266468215F6646319631F54f11545836a",
        patientAddress: "0xfB3558a300f9f9d440a216bd9bde3cbd8E906691",
        reportType: "brainMRI",
        file: null,
    })

    let handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        console.log(reportDetails);
        formData.append("file", reportDetails.file);
        startLoading();
        BackendService.createReport(user.provider, formData, {
            hospitalAddress: reportDetails.hospitalAddress,
            patientAddress: reportDetails.patientAddress,
            reportType: reportDetails.reportType
        }).then(res => {
            stopLoading();
            console.log(res);
        })
    }

    return <div className="container-fluid vh-100 swatch_3 d-flex align-items-center overflow-hidden">
        <div className="container bg-light w-75 h-75 border rounded-3">
            <div className="row mt-4">
                <div className="col-12">
                    <h2 className="fnt fw-bold swatch_6 text-center" >Secure your Reports!!</h2>
                </div>
            </div>
            <form>
                <div className="row">
                    <FontAwesomeIcon icon={faImage} size="6x" className="my-4 m-auto swatch_6"/>
                </div>
                <div className="row">
                    <div className="input-group w-75 m-auto mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
                        <input id="upload" onChange={(e) => setReportDetails({...reportDetails, file: e.target.files[0]})} type="file" className="form-control border-0" />
                            <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4"> 
                                <FontAwesomeIcon icon={faUpload} size="lg" className="me-2 swatch_6" />
                                <small className="text-uppercase font-weight-bold text-muted">Choose file</small>
                            </label>
                    </div>
                </div>
                <div className="row m-5">
                    <div className="col-2"></div>
                    <div className="col-sm-4 col-12 mb-sm-0 mb-3">
                        {/* hospital id from dropdown list */}
                        <select value={reportDetails.hospitalAddress} className="form-control rounded-pill bg-white shadow-sm">
                            <option selected disabled>Hospital Address*</option>
                            <option value={"0xecFe5a08F9Ae022B9B111B23Bf90B64292D12236"}>Dr Poojan</option>
                            <option>Dr Vraj</option>
                        </select>

                    </div>
                    <div className="col-sm-4 col-12">
                        {/* get patient address from dropdown list */}
                        <select value={reportDetails.patientAddress}  className="form-control rounded-pill bg-white shadow-sm">
                            <option selected disabled>Patient Address*</option>
                            <option value={"0xfB3558a300f9f9d440a216bd9bde3cbd8E906691"}>Dhruv</option>
                            <option>Rushil</option>
                        </select>
                    </div>
                    <div className="col-2"></div>
                </div>
                <div className="row">
                    <div className="col-auto mx-auto">
                        <button onClick={handleSubmit} className="btn mx-auto swatch_6b text-white rounded-pill">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
}