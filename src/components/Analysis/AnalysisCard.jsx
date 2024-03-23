import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button
} from '@mui/material';

const AnalysisCard = ({ handleSaveDescription, handleCloseDescription, setDescription, rows }) => {

    const saveDescription = () => {
        handleSaveDescription();
    };

    const closeDescription = () => {
        handleCloseDescription();
    };
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    return (
        <Card className="analysis-card">
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
                        sx={{ margin: '16px', backgroundColor: "#2a2392", ":hover": { color: '#0057c8', background: 'white', fontWeight:'bold' },
                    }}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={closeDescription}
                        sx={{ margin: '16px', color: "#2a2392", ":hover": { fontWeight: "bold" } }}
                    >
                        Close
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AnalysisCard;