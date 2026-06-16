import { useState } from "react";
import { Checkbox } from "../../../components/Checkbox";
import { Box, Button, FormControlLabel, FormGroup, InputAdornment, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import SearchIcon from '@mui/icons-material/Search';
import React from 'react'; //for test

const TabletMenu = ({ handleSearchClick }) => {
    const [localState, setLocalState] = useState({ isGif: true, isSVG: true, isImg: true, query: '' });
    const { loading } = useSelector(state => state.auth);

    return (
        <>
            <Typography variant="h2" gutterBottom>поиск</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5em' }}>
                    <TextField
                        size="small"
                        type="text"
                        variant="outlined"
                        placeholder="используйте английский язык"
                        color="primary"
                        sx={{ flex: '1', fontSize: '.9em' }}
                        pattern="[A-Za-z]"
                        onChange={(e) => { setLocalState({ ...localState, query: e.target.value.replace(/[^a-zA-Z]/g, "") }) }}
                        value={localState.query}
                        slotProps={{
                            input: {
                                style: { color: '#F2EBFB' },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#F2EBFB', fontSize: '1.3em' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchClick(localState);
                            }
                        }}
                    />

                    <Button
                        loading={loading}
                        onClick={() => handleSearchClick(localState)}
                        variant="contained"
                    >
                        поиск
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5em' }}>
                    <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onchange={(e) => { setLocalState({ ...localState, isImg: e.target.checked }) }}
                                    value={localState.isImg}
                                />
                            }
                            label="картинки"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onchange={(e) => { setLocalState({ ...localState, isSVG: e.target.checked }) }}
                                    value={localState.isSVG}
                                />
                            }
                            label="SVG"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onchange={(e) => { setLocalState({ ...localState, isGif: e.target.checked }) }}
                                    value={localState.isGif}
                                />
                            }
                            label="гифки"
                        />
                    </FormGroup>
                </Box>
            </Box>
        </>
    );
};

export default TabletMenu;