/**
 * Утилиты для работы с дашбордом и медиа-контентом
 * 
 * Функции:
 * - combineAndShuffleArrays: Объединение и перемешивание массивов из разных источников (whvn, tenor, svg)
 * - getUrl: Получение URL медиафайла в зависимости от источника (поддержка thumbnail)
 * - handleDownload: Скачивание файла с поддержкой разных форматов:
 *   • SVG: получение кода с сервера и создание Blob
 *   • WHVN: открытие в новой вкладке
 *   • Tenor: загрузка через fetch и сохранение
 * 
 * Вспомогательная функция: createLinkElem - создание временной ссылки для скачивания
 */

import { Bounce, toast } from "react-toastify";
import api from "./axiosConfig";

export const combineAndShuffleArrays = (photos, tenor, svg) => {
    const uniqueItems = new Map();

    const processArray = (array, source) => {
        array?.forEach(item => {
            const key = item.id;
            if (key && !uniqueItems.has(key)) {
                uniqueItems.set(key, { source, data: item });
            }
        });
    };

    processArray(photos, 'whvn');
    processArray(tenor, 'tenor');
    processArray(svg, 'svg');

    return Array.from(uniqueItems.values()).sort(() => Math.random() - 0.5);
};

export const getUrl = (source, data, type = 'original') => {
    switch (source) {
        case 'tenor': {
            if (type == 'thumb') return data?.media[0]?.tinygif?.url || data?.media[0]?.gif?.url;
            return data?.media[0]?.gif?.url;
        }
        case 'svg': {
            return data?.route?.dark || data?.route;
        }
        default: {
            if (type == 'thumb') return data?.thumbs?.small || data?.path;
            return data?.path
        }
    }
}

const createLinkElem = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wappy';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

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

export const handleDownload = async (res_url, source) => {
    try {
        if (source == 'svg') {
            const svgCode = await api.post('/api/svg/code', { name: res_url.split('/')[res_url.split('/').length - 1] })
                .then(res => res.data.svg)

            const blob = new Blob([svgCode], { type: 'image/svg+xml' });
            createLinkElem(blob);
        } else {
            if (source == 'whvn') {
                window.open(res_url, '_blank')
            } else {
                const response = await fetch(res_url);
                const blob = await response.blob();
                createLinkElem(blob)
            }
        }
    } catch (error) {
        notify();
    }
};
