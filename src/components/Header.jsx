import { Box, Typography, IconButton, SpeedDial, SpeedDialAction, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { setHeaderData } from "./HeaderSlice";
import { usePannel } from "../util/headerHoocks";
import { useRef } from "react";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dialogRef = useRef(null)
    const { pathname } = useLocation();
    const { token, user } = useSelector(state => state.global);
    const { delDialog, outDialog } = useSelector(state => state.header);
    const { deleteAction, logInAction, logOutAction, changeEmailAction } = usePannel();

    const actionsAuth = [
        { icon: <AlternateEmailIcon />, name: 'изменить почту', onClick: changeEmailAction },
        { icon: <LogoutIcon />, name: 'выйти из аккаунта', onClick: () => { dispatch(setHeaderData({ field: 'outDialog', data: true })) } },
        { icon: <DeleteIcon sx={{ color: '#f44336' }} />, name: 'удалить аккаунт', onClick: () => { dispatch(setHeaderData({ field: 'delDialog', data: true })) } },
    ];

    const actionsNotAuth = [
        { icon: <LoginIcon />, name: 'авторизоваться', onClick: logInAction },
    ]

    const handleClose = () => {
        dispatch(setHeaderData({ field: 'outDialog', data: false }))
        dispatch(setHeaderData({ field: 'delDialog', data: false }))
    }

    return (
        <> {(pathname == '/signin' || pathname == '/signup' || pathname == '/' || pathname == '/item' || pathname == '/favorites' || pathname == '/history' || pathname == '/change_email') && (
            <>
                <Box
                    sx={{
                        backgroundColor: '#2a262eb0',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid #D4BBFC',
                        borderRadius: '1em', p: '1em',
                        minWidth: '80%',
                        maxWidth: '80%',
                        m: '0em auto 2em auto',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '.5em 4em',
                        justifyContent: 'space-between',
                        gap: '1em',
                        position: 'sticky',
                        top: '2em',
                        zIndex: '10000000',
                    }}
                >
                    <Typography onClick={() => {
                        if (pathname != '/') navigate('/')
                        else window.scrollTo(0, 0);
                    }} sx={{ cursor: 'pointer' }} variant="h2">ваппи</Typography>

                    <Typography variant="body2">твой проводник в мире медиа</Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1em',
                    }}>
                        <IconButton onClick={() => navigate('/')} disabled={pathname === '/'} color="primary">
                            <DashboardIcon />
                        </IconButton>
                        <IconButton onClick={() => navigate('/history')} disabled={pathname === '/history' || !user?.historyLoad || !token?.length} color="primary">
                            <ScheduleIcon />
                        </IconButton>
                        <IconButton onClick={() => navigate('/favorites')} disabled={pathname === '/favorites' || !user?.favorites || !token?.length} color="primary">
                            <FavoriteIcon />
                        </IconButton>
                        <SpeedDial
                            size="small"
                            direction="down"
                            sx={{
                                maxHeight: '2.5em', maxWidth: '2.5em', minHeight: '2.5em', minWidth: '2.5em',
                            }}
                            FabProps={{
                                sx: {
                                    maxHeight: '2.5em', maxWidth: '2.5em', minHeight: '2.5em', minWidth: '2.5em', fontSize: '.9em', backgroundColor: 'transparent', // Убираем фон
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        boxShadow: 'none',
                                    },
                                    '&:active': {
                                        backgroundColor: 'transparent',
                                        boxShadow: 'none',
                                    }, color: '#a27ae2ff'
                                },
                            }}
                            disabled={pathname === '/profile' || pathname === '/signin' || pathname === '/signup' || pathname === '/reset_pass' || pathname === '/change_pass'}
                            ariaLabel="SpeedDial basic example"
                            icon={<PersonIcon sx={{ fontSize: '2em' }} />}
                        >
                            {(!token || token.length < 1 || !user) ? (
                                actionsNotAuth.map((action) => (
                                    <SpeedDialAction
                                        key={nanoid()}
                                        icon={action.icon}
                                        onClick={action.onClick}
                                        slotProps={{
                                            tooltip: {
                                                title: action.name,
                                            },
                                        }}
                                    />
                                ))
                            ) : (
                                actionsAuth.map((action) => (
                                    <SpeedDialAction
                                        key={nanoid()}
                                        onClick={action.onClick}
                                        icon={action.icon}
                                        slotProps={{
                                            tooltip: {
                                                title: action.name,
                                            },
                                        }}
                                    />
                                ))
                            )}
                        </SpeedDial>
                    </Box>
                </Box >

                <Dialog
                    sx={{ backgroundColor: '#3C096C6' }}
                    open={outDialog || delDialog}
                    onClose={handleClose}>
                    <DialogTitle>вы уверены{delDialog ? ', что хотите удалить аккаунт навсегда?' : ', что хотите выйти из аккаунта?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            введите строку "малосольный огурец", чтобы подтвердить выполнение действия
                        </DialogContentText>
                        <TextField
                            autoFocus
                            inputRef={dialogRef}
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            size="small"
                            color='primary'
                            InputProps={{
                                style: {
                                    color: '#000',
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Отмена</Button>
                        <Button onClick={() => {
                            if (dialogRef.current.value == 'малосольный огурец') {
                                if (delDialog) deleteAction()
                                else logOutAction()
                            }
                        }}>
                            {delDialog ? "удалить" : "выйти"}
                        </Button>
                    </DialogActions>
                </Dialog >
            </>
        )}

        </>
    );
}

export default Header;