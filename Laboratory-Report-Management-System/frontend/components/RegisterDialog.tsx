import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import BackendService from "../services/backendService";

export default function RegisterDialog(props: any) {
    const [userDetails,setUserDetails] = useState({
        name: "",
        type:  "patient"
    })
    const [user,setUser] = useState(props.user);
    useEffect(async () => {
        let address = "";
        if(props.user.provider) address = await props.user.provider.eth.getAccounts().then((res: any) => res[0])
        setUser(address);
    },[props.user])
    let handleRegister = (e:any) => {
        e.preventDefault();
        BackendService.registerUser(userDetails.name, userDetails.type, props.user.provider).then((res:any) => {
            console.log(res)
        })

    }
    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle>Register</DialogTitle>
            <DialogContent>
                <form onSubmit={handleRegister} className="d-flex flex-column">
                    <span className="mb-2">User Address: {user}</span>
                    <TextField
                        value={userDetails.name}
                        onChange={(e) => setUserDetails({...userDetails,name: e.target.value})}
                        label="Name"
                        className="mb-3"
                    />
                    <Select
                        value={userDetails.type}
                        onChange={(e) => setUserDetails({...userDetails,type: e.target.value})}
                        className="mb-3"
                        label="Role"
                        inputProps={{
                            native:true
                        }}
                    >
                        <MenuItem value={"patient"}>Patient</MenuItem>
                        <MenuItem value={"laboratary"}>Laboratary</MenuItem>
                        <MenuItem value={"hospital"}>Hospital</MenuItem>
                    </Select>
                    <Button type={'submit'} className="text-center my-2" variant="contained" color="primary"> Register </Button>                    
                </form>
            </DialogContent>
        </Dialog>
    )
}