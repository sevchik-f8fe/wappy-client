import React from 'react'; //for tests

import { TextField } from "@mui/material";

export const AuthField = ({ help, label, error, value, onchange, type, placeholder }) => {
    return (
        <TextField
            size="small"
            value={value}
            onChange={onchange}
            sx={{ minWidth: '100%' }}
            type={type}
            variant="outlined"
            label={label}
            placeholder={placeholder}
            color={error ? 'error' : 'primary'}
            error={error}
            helperText={help}
            InputProps={{
                style: {
                    color: '#F2EBFB',
                },
            }}
        />
    );
}