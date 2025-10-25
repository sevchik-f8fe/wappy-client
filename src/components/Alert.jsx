import { Typography } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";

const Alert = ({ messagge }) => {
    return (
        <Typography variant="body1">{messagge}</Typography>
    );
}

export default Alert;