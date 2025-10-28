import { Box, Chip, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react";
import { handleDownload } from "../util/dashboard";

const ListItem = ({ source, data }) => {
    const navigate = useNavigate();
    const [isMouseOver, setIsMouseOver] = useState(false);

    const getUrl = () => {
        switch (source) {
            case 'tenor': {
                return data?.media[0]?.gif?.url;
            }
            case 'svg': {
                return data?.route?.dark;
            }
            default: {
                return data?.thumbs?.small;
            }
        }
    }

    const getDowloadUrl = (source, data) => {
        switch (source) {
            case 'tenor': {
                return data?.media[0].gif.url;
            }
            case 'svg': {
                return data?.route?.dark;
            }
            default: {
                return data?.path;
            }
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
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    gap: '1em',
                    minWidth: '100%'
                }}>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(getDowloadUrl(source, data), source)
                        }}
                        variant="contained">
                        <DownloadIcon sx={{ fontSize: '1.2em', }} />
                    </Button>
                    <Chip label={source?.toUpperCase()} variant={source} />
                    <Button variant="contained">
                        <FavoriteIcon sx={{ fontSize: '1.2em', }} />
                    </Button>
                </Box>

                {data?.title && <Typography sx={{ textShadow: '0px 0px 6px rgba(0, 0, 0, 1)' }}>{data?.title}</Typography>}

            </Box>}

            <Box
                component="img"
                src={getUrl()}
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