import { Box, IconButton, Typography, Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import { useSelector } from "react-redux";
import { useItem } from "./itemHooks";
import { nanoid } from "nanoid";

const ItemPage = () => {
    const location = useLocation();
    const stateLocation = location.state;
    const { variants, currentVariant, source_url, original_url, title, description, loading } = useSelector((state) => state.item);

    const { setTitle, setVariants } = useItem();

    const notify = () => toast.error("Что-то пошло не так :(", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });

    useEffect(() => {
        const getPhoto = async () => {
            const photo = await axios.post('http://127.0.0.1:3000/api/photos/photoByID', { photo_id: stateLocation.id }, { headers: { 'Content-Type': 'application/json' } })
                .then((res) => res?.data?.photos?.photo)
                .then((res) => {
                    setTitle(stateLocation.source, res);
                    return res
                })
                .catch((err) => {
                    console.log(err)
                    notify();
                });

            console.log(photo)
        }

        // const getTenorGif = async () => {
        //     const gif = await axios.post('http://127.0.0.1:3000/api/tenor/list', { gif_id: stateLocation.id }, { headers: { 'Content-Type': 'application/json' } })
        //         .then((res) => res?.data?.giphy)
        //         .then((res) => {
        //             setTitle(stateLocation.source, res);
        //             setVariants(stateLocation.source, res)
        //             return res
        //         })
        //         .catch((err) => {
        //             console.log(err)
        //             notify();
        //         });

        //     console.log(gif)
        // }

        // if (stateLocation.source == 'photo') {
        // console.log('start photo')
        //     getPhoto()
        // } else if (stateLocation.source == 'giphy') {
        //     if (stateLocation.type == 'gif') {
        //         console.log('start gif')
        // setTitle(stateLocation?.source, hardItem);
        // setVariants(stateLocation?.source, hardItem)
        // getGiphyGif();
        //     } else {
        //         console.log('start sticker')
        //         setTitle(stateLocation.source, hardItem);
        //         setVariants(stateLocation.source, hardItem)
        //         // getGiphyGif();
        //     }
        // }

    }, []);

    return (
        <Box sx={{ backgroundColor: '#F2EBFB30', backdropFilter: 'blur(10px)', border: '1px solid #D4BBFC', borderRadius: '1em', p: '1em', maxWidth: '80%', minWidth: '80%', m: '4em auto 2em auto' }}>
            <Box sx={{ display: 'flex', gap: '1em' }}>
                <img style={{ felx: 1, maxWidth: '50%', borderRadius: '1em', maxHeight: '27em' }} src={variants && variants[3]?.url} alt={title} />

                <Box sx={{ flex: 1, display: 'flex', gap: '1em', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1em' }}>
                        <Button color="hide" size="small">оригинал</Button>
                        <Button variant="outlined" color="secondary" size="small">в избранные</Button>
                    </Box>
                    <Typography>{'title'}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                        {variants?.map(variant => (
                            <a key={nanoid()} href={variant.url} download>{variant.format}</a>
                            // <Button
                            //     size="large"
                            //     color="success"
                            //     variant="outlined"
                            //     onClick={() => handleDownload(variant.url, variant.format)}
                            // // download='wappy'
                            // // href={'download:' + variant.url}
                            // >
                            //     <DownloadIcon sx={{ mr: '.5em' }} />
                            //     {variant.format} {variant.height}x{variant.width} ({variant.size})
                            // </Button>
                        ))}
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}

export default ItemPage;