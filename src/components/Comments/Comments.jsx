import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
} from '@mui/material';
import ai from '../../static/images/assets/friends.png';

const Comments = React.memo(({ handleCloseComments, comments }) => {
    return (
        <Card sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6" sx={{ margin: 1, fontSize: 24 }} gutterBottom>
                    <strong>AI's Analysis on the Candidate</strong>
                    <img src={ai} alt="AI analysis" style={{ width: 30, height: 30, marginLeft: 1.5, marginTop: 1 }} />
                </Typography>
                <Typography variant="body1" sx={{ margin: 1, fontSize: 22 }} paragraph>
                    {comments}
                </Typography>
            </CardContent>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                    onClick={handleCloseComments}
                    sx={{ margin: 2, fontSize: 16, color: "#2a2392", ":hover": { fontWeight: "bold" } }}
                >
                    Close
                </Button>
            </div>
        </Card>
    );
});

export default Comments;
