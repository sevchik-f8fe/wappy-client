/**
 * Страница избранного пользователя
 * 
 * Отображает:
 * - Masonry сетку с избранными элементами
 * - Сообщение "пока что тут пусто" если нет избранного
 * 
 * Защита маршрута:
 * - Редирект на главную если нет user.favorites и токена
 * 
 * Адаптивность:
 * - Адаптивная ширина (80% десктоп, 100% мобильные)
 * - Masonry колонки (4,3,2,1) в зависимости от ширины
 * 
 * Компоненты:
 * - ListItem для каждого элемента
 * - Masonry для сетки
 * 
 * Данные берутся из Redux: state.global.user.favorites
 */

import { Box, Typography } from "@mui/material";
import { nanoid } from "nanoid";
import ListItem from "../../components/ListItem";
import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const FavoritePage = () => {
    const { user, token } = useSelector(state => state.global)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.favorites && token?.length == 0) navigate('/');
    }, [user, token, navigate])


    const listItems = user?.favorites && (user?.favorites?.map((elem) =>
        <ListItem source={elem.source} data={elem.data} key={nanoid()} />
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
        }}>{/*80% for desk */}
            <Typography variant={isMobile ? 'h2' : 'h1'} gutterBottom={!isMobile} >ИЗБРАННЫЕ</Typography>{/*h1 gutterBottom for desk */}
            {user?.favorites?.length > 0 ? (
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

export default FavoritePage;