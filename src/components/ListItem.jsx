import { Box, Chip, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react";
import { getUrl, handleDownload } from "../util/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useFavorites } from "../pages/FavoritePage/FavoritesHooks";
import { setGlobalData } from "../util/globalSlice";

const ListItem = ({ source, data, loadDate }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMouseOver, setIsMouseOver] = useState(false);
    const { user, token } = useSelector(state => state.global)

    const { addToFavorites, removeFromFavorites } = useFavorites();

    const handleFavoritesClick = () => {
        if (user?.favorites?.find(elem => (elem.data == data && elem.source == source))) {
            console.log('rem')
            removeFromFavorites(source, data);
        } else {
            console.log('add')
            addToFavorites(source, data);
        }
    }

    return (
        <Box
            onMouseOver={() => setIsMouseOver(true)}
            onMouseOut={() => setIsMouseOver(false)}

            sx={{
                backgroundColor: '#10002B',
                borderRadius: '1em',
                position: 'relative',
                breakInside: 'avoid-column',
                display: 'inline-block',
                width: '100%',
                mb: '1em',
                overflow: 'hidden'
            }}>
            {isMouseOver && <Box
                onClick={() => navigate('/item', { state: { id: data?.id, source: source, item: data } })}
                sx={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#00000060',
                    top: 0,
                    left: 0,
                    borderRadius: '1em',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    gap: '1em',
                    padding: '1em'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    gap: '1em',
                    minHeight: '100%',
                    minWidth: '100%',
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            minWidth: '100%',
                            gap: '1em',
                        }}
                    >
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(getUrl(source, data), source, data, user?.email, token);
                                if (user?.historyLoad?.length > 0) {
                                    dispatch(setGlobalData({ field: 'user', value: { ...user, historyLoad: [{ source, data, loadDate: new Date().getTime() }, ...user.historyLoad] } }))
                                } else {
                                    dispatch(setGlobalData({ field: 'user', value: { ...user, historyLoad: [{ source, data, loadDate: new Date().getTime() }] } }))
                                }
                            }}
                            variant="contained">
                            <DownloadIcon sx={{ fontSize: '1.2em', }} />
                        </Button>
                        <Chip label={source?.toUpperCase()} variant={source} />
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFavoritesClick();
                            }}
                            variant="contained"
                        >
                            {user?.favorites?.find(elem => (elem.data == data && elem.source == source)) ? (
                                <FavoriteIcon sx={{ fontSize: '1.2em', }} />
                            ) : (
                                <FavoriteBorderIcon sx={{ fontSize: '1.2em', }} />
                            )}
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            alignSelf: 'end',
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'end',
                            gap: '1em',

                        }}
                    >
                        {loadDate && <Typography sx={{ backgroundColor: '#333', p: '2px  5px', borderRadius: '5px' }}>{new Date(loadDate)?.toLocaleDateString()}</Typography>}
                    </Box>

                </Box>
            </Box>}

            <Box
                component="img"
                src={getUrl(source, data)}
                sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '1em',
                    objectFit: 'contain'
                }}
                alt={data?.title}
            />
        </Box >
    );
}

export default ListItem;