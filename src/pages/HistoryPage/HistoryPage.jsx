import { Box, Typography } from "@mui/material";
import { nanoid } from "nanoid";
import ListItem from "../../components/ListItem";

const HistoryPage = () => {
    return (
        <Box sx={{ backgroundColor: '#F2EBFB30', backdropFilter: 'blur(10px)', border: '1px solid #D4BBFC', borderRadius: '1em', p: '1em', maxWidth: '80%', minWidth: '80%', m: '4em auto 2em auto' }}>
            <Typography variant="h1" gutterBottom>История загрузок</Typography>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1em',
            }}>
                {[1, 2, 313, 1, 1, 23, 12, 3, 12, 3, 123, 123, 12, 3, 12, 123, 2, 23, 23, 23, 23, 23, 23, 2, 3].map(() => <ListItem key={nanoid()} />)}
            </Box>
        </Box>
    );
}

export default HistoryPage;