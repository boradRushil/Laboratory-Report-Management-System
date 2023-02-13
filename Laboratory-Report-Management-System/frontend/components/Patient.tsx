import { Accordion, Button, AccordionSummary, AccordionDetails, TextField } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { ExpandMoreOutlined } from '@material-ui/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/authContext";
import BackendService from "../services/backendService";

export default function Patient() {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        BackendService.getAllReportsByHospital(user.provider, user.user.wallet).then((data) => {
            setReports(data);
        })
    }, []);

    return (
        <div className="w-100 pt-4 swatch_3" style={{ minHeight: "100vh" }}>
            <div className="col-lg-10 col-md-11 col-12 mx-auto py-2 px-3 mt-4 mb-3 rounded bg-light" style={{ minHeight: "500px" }}>
                <h1 className="mb-3 swatch_6 text-center">Your Reports</h1>
                <div className="d-flex flex-column mx-auto" style={{ rowGap: "0.5rem" }}>
                    {<Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>1</AccordionSummary>
                        <AccordionDetails className="d-flex flex-column">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-10 d-flex flex-column justify-content-center align-items-center">
                                    <img src={"/assets/test.jpg"} width={256} height={256} />
                                    <p>Original MRI</p>
                                </div>
                                <div className="col-lg-6 col-md-6 col-10 d-flex flex-column justify-content-center align-items-center">
                                    <img src={"/assets/mask.jpg"} width={256} height={256} />
                                    <p>Mask of MRI</p>
                                </div>
                            </div>
                            <h3>Analysis</h3>
                            <p className="mb-3">{"Check for abnormalities of MRI signal Determine the nature of the signal change – abnormal fat or fluid? Note the anatomical location, size and shape of the abnormality The combination of standard T1 images (fat sensitive) and STIR images (water sensitive) can be compared to determine the amount of fat and water within a body part In this pair of images, the high signal mass seen on the T1 image is dark on the STIR image – confirming it contains fat and no water These are typical signal characteristics of a lipoma"}</p>
                            <h3>Diagnosis</h3>
                            <p className="mb-3">{"The MRI provides no detail of the cortical bone, but shows the bone medulla and soft tissue structures – such as the cruciate ligaments – not visible on the X-ray image"}</p>

                        </AccordionDetails>
                    </Accordion>}
                </div>
            </div>
        </div>
    )
}
