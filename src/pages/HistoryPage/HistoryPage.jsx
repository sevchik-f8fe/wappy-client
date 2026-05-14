/**
 * Страница истории загрузок пользователя
 * 
 * Отображает:
 * - Masonry сетку с историей загрузок
 * - Кнопку "получить отчет" для экспорта в PDF
 * - Сообщение "пока что тут пусто" если нет истории
 * 
 * Особенности:
 * - Каждый элемент содержит дату загрузки (loadDate)
 * - Кнопка GetPDFButton генерирует PDF-отчет
 * 
 * Защита маршрута:
 * - Редирект на главную если нет user.historyLoad и токена
 * 
 * Адаптивность:
 * - Адаптивная ширина (80% десктоп, 100% мобильные)
 * - Masonry колонки (4,3,2,1)
 * 
 * Данные из Redux: state.global.user.historyLoad
 * Формат элемента: { source, data, loadDate }
 */

import { Box, Typography } from "@mui/material";
import { nanoid } from "nanoid";
import ListItem from "../../components/ListItem";
import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import GetPDFButton from "../../components/GetPDFButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const HistoryPage = () => {
    const { user, token } = useSelector(state => state.global)
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (!user?.historyLoad && token?.length == 0) navigate('/');
    }, [user, token, navigate])

    const listItems = user?.historyLoad && (user?.historyLoad?.map((elem) =>
        <ListItem source={elem.source} loadDate={elem.loadDate} data={elem.data} key={nanoid()} />
    ));

    return (
        <Box sx={{
            backgroundColor: '#2a262eb0',
            backdropFilter: 'blur(10px)',
            border: '1px solid #D4BBFC',
            borderRadius: '1em',
            p: '1em',
            maxWidth: !isMobile ? '80%' : '100%',
            minWidth: !isMobile ? '80%' : '100%',
            m: '4em auto 2em auto'
        }}
        >
            <Typography variant={isMobile ? 'h2' : 'h1'} gutterBottom>История загрузок</Typography>
            {user?.historyLoad?.length > 0 && <GetPDFButton loadHistoryData={user?.historyLoad} />}
            {user?.historyLoad?.length > 0 ? (
                <Masonry
                    breakpointCols={{
                        default: 4,
                        1100: 3,
                        700: 2,
                        500: 1
                    }}
                    className="masonry-grid"
                    columnClassName="masonry-grid_column"
                >
                    {listItems}
                </Masonry>
            ) : (
                <Box sx={{ margin: '2em 0' }}>
                    <Typography variant="body2">пока что тут пусто :(</Typography>
                </Box>
            )}
        </Box>
    );
}

export default HistoryPage;