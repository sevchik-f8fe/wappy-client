import api from "./axiosConfig";

export const combineAndShuffleArrays = (photos, tenor, svg) => {
    const result = [];

    photos?.forEach(item => result.push({ source: 'whvn', data: item }));
    tenor?.forEach(item => result.push({ source: 'tenor', data: item }));
    svg?.forEach(item => result.push({ source: 'svg', data: item }));

    console.log(result.sort(() => Math.random() - 0.5))
    return result.sort(() => Math.random() - 0.5);
}

export const getUrl = (source, data) => {
    switch (source) {
        case 'tenor': {
            return data?.media[0]?.gif?.url;
        }
        case 'svg': {
            return data?.route?.dark || data?.route;
        }
        default: {
            return data?.path;
        }
    }
}

export const handleDownload = async (res_url, source) => {
    try {
        console.log(res_url);
        if (source == 'svg') {
            const svgCode = await api.post('/api/svg/code', { name: res_url.split('/')[res_url.split('/').length - 1] })
                .then(res => res.data.svg)
                .catch(e => console.log(e))

            const blob = new Blob([svgCode], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'wappy';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            if (source == 'whvn') {
                window.open(res_url, '_blank');
            } else {
                const response = await fetch(res_url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'wappy';
                link.click();
                window.URL.revokeObjectURL(url);
            }
        }
    } catch (error) {
        console.error('Download failed:', error);
    }
};
