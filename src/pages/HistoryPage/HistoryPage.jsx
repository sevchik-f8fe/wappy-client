import { Box, Typography } from "@mui/material";
import { nanoid } from "nanoid";
import ListItem from "../../components/ListItem";
import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import GetPDFButton from "../../components/GetPDFButton";

const HistoryPage = () => {
    const { user } = useSelector(state => state.global)

    const listItems = user?.historyLoad && (user?.historyLoad?.map((elem) =>
        <ListItem source={elem.source} loadDate={elem.loadDate} data={elem.data} key={nanoid()} />
    ));

    return (
        <Box sx={{ backgroundColor: '#F2EBFB30', backdropFilter: 'blur(10px)', border: '1px solid #D4BBFC', borderRadius: '1em', p: '1em', maxWidth: '80%', minWidth: '80%', m: '4em auto 2em auto' }}>
            <Typography variant="h1" gutterBottom>История загрузок</Typography>
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