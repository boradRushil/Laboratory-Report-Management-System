import { Accordion, Button, AccordionSummary, AccordionDetails, TextField } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { ExpandMoreOutlined } from '@material-ui/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/authContext";
import BackendService from "../services/backendService";

export default function Hospital() {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        BackendService.getAllReportsByHospital(user.provider, user.user.wallet).then((data) => {
            setReports(data);
        })
    }, []);

    let handleSign = (e: any, dt: any) => {
        e.preventDefault();
        BackendService.signAndUpdateReport(user.provider, {
            analysis: e.target.analysis.value,
            diagnosis: e.target.diagnosis.value,
            contract: dt.contract,
            originalImage: dt.OriginalImage,
            maskedImage: dt.MaskedImage,
        }, e.target.secret.files[0]).then((data) => {
            console.log(data);
        });
    }
    return (
        <div className="w-100 pt-4 swatch_3" style={{ minHeight: "100vh" }}>
            <div className="col-lg-8 col-md-10 col-11 mx-auto py-2 px-3 mt-4 rounded bg-light" style={{ minHeight: "500px" }}>
                <h1 className="mb-3 swatch_6 text-center">Reports</h1>
                <div className="d-flex flex-column mx-auto" style={{ rowGap: "0.5rem" }}>
                    {reports.map((dt, i) => (<Accordion key={i}>
                        <AccordionSummary expandIcon={<ExpandMoreOutlined />}></AccordionSummary>
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
                            <form onSubmit={(e) => handleSign(e,dt)} className="d-flex flex-column">
                                <TextField
                                    label="Analysis"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    name="analysis"
                                    className="mb-3"
                                />
                                <TextField
                                    label="Diagnosis"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    name="diagnosis"
                                    className="mb-3"
                                />
                                <div className="row">
                                    <div className="input-group w-75 m-auto mb-3 px-2 py-2 rounded-pill bg-white">
                                        <input id="upload" type="file" name="secret" className="form-control border-0" />
                                        <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4">
                                            <FontAwesomeIcon icon={faUpload} size="lg" className="me-2 swatch_6" />
                                            <small className="text-uppercase font-weight-bold text-muted">Choose file</small>
                                        </label>
                                    </div>
                                </div>
                                <Button variant="contained" type="submit" className="mx-auto" color="primary">Sign</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>))}
                </div>
            </div>
        </div>
    )
}