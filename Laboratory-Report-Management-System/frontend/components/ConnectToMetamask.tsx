import {Button, Dialog, DialogContent, DialogTitle, Icon} from '@material-ui/core'
import Image from 'next/image'
import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { LoaderContext } from '../contexts/loaderContext';
import MetaMask from './metamask.svg';
export default function ConnectToMetamask(props: any){
    const {user, login} = useContext(AuthContext);
    const {startLoading,stopLoading} = useContext(LoaderContext);
    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle>Connect To MetaMask</DialogTitle>
            <DialogContent className='d-flex justify-content-center align-items-center'>
                <Button variant='contained' color="primary" onClick={() => {
                    startLoading();
                    login();
                    stopLoading();
                }}> Connect Wallet</Button>
            </DialogContent>
        </Dialog>
    )
}