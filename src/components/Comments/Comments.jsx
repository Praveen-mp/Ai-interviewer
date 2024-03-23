import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
} from '@mui/material';
import ai from '../../static/images/assets/friends.png';

const Comments = ({ handleCloseComments, comments }) => {

    const closeComments = () => {
        handleCloseComments();
    };

    return (
        <Card className="analysis-card">
            <CardContent>
                <Typography variant="h6" style={{ margin: '10px', fontSize: '24px'  }} gutterBottom>
                    <strong>AI's Analysis on the Candidate</strong>
                    <img src={ai} alt="pass" style={{ width: '30px', height: '30px', marginLeft:'12px', marginTop:'8px'}} />
                </Typography>
                <Typography variant="body1" sx={{ margin: '10px', fontSize: '22px' }} paragraph>
                    {comments}
                </Typography>
            </CardContent>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                    onClick={closeComments}
                    sx={{ margin: '20px', fontSize:'16px', color: "#2a2392", ":hover": { fontWeight: "bold" } }}
                >
                    Close
                </Button>
            </div>
        </Card>
    );
};

export default Comments;
