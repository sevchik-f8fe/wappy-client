import { Button } from "@mui/material";
import jsPDF from "jspdf";
import { getUrl } from "../util/dashboard";
import { useState } from "react";

const GetPDFButton = ({ loadHistoryData }) => {
    const [loading, setLoading] = useState(false);

    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Не удалось загрузить изображение: ${url}`));
            img.src = url;
        });
    };

    const generatePDF = async (data) => {
        setLoading(true);
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 40;

        doc.setFontSize(16);
        doc.text('WAPPY', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(10);

        for (let index = 0; index < data.length; index++) {
            const item = data[index];

            if (yPosition > doc.internal.pageSize.getHeight() - 200) {
                doc.addPage();
                yPosition = 40;
            }

            doc.setFont(undefined, 'bold');
            doc.text(`MEDIA #${index + 1}:`, 20, yPosition);
            yPosition += 20;

            doc.setFont(undefined, 'normal');
            const loadDate = new Date(item.loadDate).toLocaleDateString();
            doc.text(`date: ${loadDate}`, 25, yPosition);
            yPosition += 15;

            doc.text(`source: ${item.source}`, 25, yPosition);
            yPosition += 15;

            doc.text(`media:`, 25, yPosition);
            yPosition += 15;

            try {
                const imageUrl = getUrl(item.source, item.data);
                if (imageUrl && item.source != 'whvn' && item.source != 'svg') {
                    const img = await loadImage(imageUrl);

                    const maxWidth = 200;
                    const maxHeight = 200;

                    let imgWidth = img.width;
                    let imgHeight = img.height;

                    if (imgWidth > maxWidth) {
                        const ratio = maxWidth / imgWidth;
                        imgWidth = maxWidth;
                        imgHeight = imgHeight * ratio;
                    }

                    if (imgHeight > maxHeight) {
                        const ratio = maxHeight / imgHeight;
                        imgHeight = maxHeight;
                        imgWidth = imgWidth * ratio;
                    }

                    doc.addImage(img, 'JPEG', 25, yPosition, imgWidth, imgHeight);
                    yPosition += imgHeight + 40;
                } else {
                    doc.text(`only url: ${imageUrl}`, 25, yPosition);
                    yPosition += 20;
                }
            } catch (error) {
                console.error('Ошибка загрузки изображения:', error);
                doc.text('Ошибка загрузки изображения', 25, yPosition);
                yPosition += 20;
            }
        }

        doc.save('loadHistory_wappy.pdf');
        setLoading(false)
    };


    return (
        <Button
            loading={loading}
            variant="contained"
            color="primary"
            onClick={() => generatePDF(loadHistoryData)}
        >
            получить  отчет
        </Button>
    );
}

export default GetPDFButton;