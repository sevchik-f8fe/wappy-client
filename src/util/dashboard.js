import axios from "axios";

export const combineAndShuffleArrays = (photos, tenor, svg) => {
    const result = [];

    photos?.forEach(item => result.push({ source: 'whvn', data: item }));
    tenor?.forEach(item => result.push({ source: 'tenor', data: item }));
    // nouns?.forEach(item => result.push({ source: 'noun', data: item }));
    svg?.forEach(item => result.push({ source: 'svg', data: item }));
    // storyblockPhotos?.forEach(item => result.push({ source: 'storyblock', data: item }));

    console.log(result.sort(() => Math.random() - 0.5))
    return result.sort(() => Math.random() - 0.5);
}

export const handleDownload = async (res_url, source) => {
    try {
        if (source == 'svg') {
            const svgCode = await axios.post('http://127.0.0.1:3000/api/svg/code', { name: res_url.split('/')[res_url.split('/').length - 1] })
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
            const response = await fetch(res_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'wappy.gif';
            link.click();
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Download failed:', error);
    }
};