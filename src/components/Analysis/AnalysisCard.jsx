import React, { useCallback } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button
} from '@mui/material';

const AnalysisCard = React.memo(({ handleSaveDescription, handleCloseDescription, setDescription, rows }) => {
    const saveDescription = useCallback(() => {
        handleSaveDescription();
    }, [handleSaveDescription]);

    const closeDescription = useCallback(() => {
        handleCloseDescription();
    }, [handleCloseDescription]);

    const handleDescriptionChange = useCallback((event) => {
        setDescription(event.target.value);
    }, [setDescription]);

    return (
        <Card sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Job Description
                </Typography>
                <TextField
                    multiline
                    rows={rows}
                    fullWidth
                    variant="outlined"
                    onChange={handleDescriptionChange}
                    placeholder="Enter job description to Analyse the Candidate with AI."
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={saveDescription}
                        sx={{ margin: 2, backgroundColor: "#2a2392", ":hover": { color: '#0057c8', background: 'white', fontWeight: 'bold' } }}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={closeDescription}
                        sx={{ margin: 2, color: "#2a2392", ":hover": { fontWeight: "bold" } }}
                    >
                        Close
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});

export default AnalysisCard;
