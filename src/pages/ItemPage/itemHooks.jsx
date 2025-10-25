import { useDispatch } from "react-redux";
import { setData } from "./ItemSlice";

export const useItem = () => {
    const dispatch = useDispatch();

    const setSourceUrl = (source) => {

    }

    const setOriginalURL = (source) => {

    }

    const setVariants = (source, item) => {
        const variants = [
            { height: item.images.hd.height, width: item.images.hd.width, url: item.images.hd.mp4, size: item.images.hd.mp4_size, format: 'mp4' },
            { height: item.images.original.height, width: item.images.original.width, url: item.images.original.mp4, size: item.images.original.mp4_size, format: 'mp4' },
            { height: item.images.original.height, width: item.images.original.width, url: item.images.original.webp, size: item.images.original.webp_size, format: 'webp' },
            { height: item.images.original.height, width: item.images.original.width, url: item.images.original.url, size: item.images.original.size, format: 'gif' },
        ]

        dispatch(setData({ field: 'variants', value: variants }));
    }

    const setTitle = (source, item) => {
        dispatch(setData({ field: 'title', value: item.title }));
    }

    const setSize = (source) => {

    }

    return {
        setSourceUrl,
        setOriginalURL,
        setTitle,
        setVariants,
        setSize
    };
};
