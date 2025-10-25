import { Box } from "@mui/material";

const Background = ({ children }) => {
    return (
        <Box sx={{ position: 'fixed', minHeight: '100vh', minWidth: '100vh', overflow: 'hidden' }}>
            <div className="gradient-box gb1"></div>
            <div className="gradient-box gb2"></div>
            <div className="gradient-box gb3"></div>
            <Box sx={{ zIndex: '10' }}>
                {children}
            </Box>
        </Box>
    );
}

export default Background;