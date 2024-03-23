import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Checkbox,
    Radio,
    RadioGroup,
    FormControlLabel,
    CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import AnalysisCard from '../Analysis/AnalysisCard';
import Comments from '../Comments/Comments';
import failIcon from '../../static/images/assets/cancel.png';
import passIcon from '../../static/images/assets/checked.png';

import './ResultCard.css'

const ResultsCard = ({ totalScore, totalWeightage, onClose, q_id, qn, qnScores, role, experience, skills }) => {
    const [publishWithAnswers, setPublishWithAnswers] = useState(false);
    const [receiveResultsMail, setReceiveResultsMail] = useState(false);
    const [interviewerEmail, setInterviewerEmail] = useState('');
    const [candidateEmail, setCandidateEmail] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [includeSelectionStatus, setIncludeSelectionStatus] = useState(false);
    const [selectionStatus, setSelectionStatus] = useState('');
    const [showAnalysisCard, setShowAnalysisCard] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState(false);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState();
    const [showComments, setShowComments] = useState(false);
    const [row, setRow] = useState(20);
    const [percentage, setPercentage] = useState();
    const [companyName, setCompanyName] = useState();

    useEffect(() => {
        setPercentage(((totalScore / totalWeightage) * 100).toFixed(2));
    }, [])

    const handleSubmit = async () => {
        const validCandidateEmail = candidateEmail.includes("@") && candidateEmail.includes(".");
        const validCandidateName = candidateName.length >= 1;
        const validInterviewerEmail = interviewerEmail.includes("@") && interviewerEmail.includes(".");
        const validCompanyName = companyName.length>=2;
        setJobDescription('');
        if (validCandidateEmail && validCandidateName) {
            if (receiveResultsMail && !validInterviewerEmail) {
                displayToast('warn', "Enter a valid Email Address.",4000,"top-right");
                return;
            }

            if(!validCompanyName)
            {
                displayToast('warn', "Enter a valid Company Name.",4000,"top-right");
                return;
            }

            const requestData = {
                user_id: uuidv4(),
                q_id: q_id,
                name: candidateName,
                email: candidateEmail,
                total_marks: totalWeightage,
                marks: parseFloat(totalScore.toFixed(2)),
                percentage: percentage,
                publishWithAnswers: publishWithAnswers,
                receiveResultsMail: receiveResultsMail,
                includeSelectionStatus: includeSelectionStatus,
                interviewerEmail: interviewerEmail,
                selectionStatus: selectionStatus,
                companyName: companyName,
                questions: qn,
                scores: qn.map((ele, i) => `${qnScores[i].score}/${ele.weightage}`),
                role: role,
            };

            setLoading(true);
            const responseData = await postData("https://ai-interviewer-backend-ar0x.onrender.com", requestData);
            if(responseData.success)
            {
                displayToast('success',responseData.message,4000,"top-right");
                setTimeout(() => {
                    displayToast('warn',"If you have'nt received the mail, kindly check the entered email address and re-publish the results",6000,"top-right");
                }, 5000);
                setLoading(false);
                onClose();
            }
            else{
                displayToast('warn',responseData.message);
            }
        } else {
            displayToast('warn', candidateName.length < 1 ? "Enter a valid Name." : "Enter a valid email address.",4000,"top-right");
        }
    };

    const displayToast = (type, message, duration, position) => {
        if (type in toast) {
            toast[type](
                <div>
                   {message}
                </div>,
                {
                    position: position,
                    autoClose: duration,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    className: 'custom-toast',
                }
            );
        } else {
            console.error(`Toast type '${type}' is not supported.`);
        }
    }

    const postData = async (url, data) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return response.json();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handlePublishWithAnswersChange = (event) => {
        setPublishWithAnswers(event.target.checked);
    };

    const handleReceiveResultsMailChange = (event) => {
        setReceiveResultsMail(event.target.checked);
    };

    const handleInterviewerEmailChange = (event) => {
        setInterviewerEmail(event.target.value);
    };

    const handleCandidateEmailChange = (event) => {
        setCandidateEmail(event.target.value);
    };

    const handleCandidateNameChange = (event) => {
        setCandidateName(event.target.value);
    }

    const handleCompanyNameChange = (event) => {
        setCompanyName(event.target.value);
    }

    const handleAIAnalysis = (event) => {
        if (includeSelectionStatus && receiveResultsMail) {
            setRow(26);
        }
        else if (includeSelectionStatus || receiveResultsMail) {
            setRow(22);
        }
        setAiAnalysis(event.target.checked)
        if (event.target.checked) {
            setShowAnalysisCard(true);
        }
    };

    const handleIncludeSelectionStatusChange = (event) => {
        if (event.target.checked) {
            displayToast('warn', "On checking this, the candidate will receive email based on the selection status you choose (selected/rejected)",5000,"top-right")
        }
        setIncludeSelectionStatus(event.target.checked);
    };

    const handleSelectionStatusChange = (event) => {
        setSelectionStatus(event.target.value);
    };

    const closeDescription = () => {
        setRow(18);
        setShowAnalysisCard(false);
        setAiAnalysis(false);
        setJobDescription('');
    }

    const saveDescription = () => {
        if (jobDescription.length <= 100) {
            displayToast('warn', "Update a proper Job description before saving. Description must be above 100 characters.",5000,"top-right");
        } else {
            displayToast('success', "Job Description saved for AI Analysis.",3000,"top-right")
            setShowAnalysisCard(false);
        }
    };

    const showAnalysis = async () => {
        const validCandidateEmail = candidateEmail.includes("@") && candidateEmail.includes(".");
        const validCandidateName = candidateName.length >= 1;
        const validJobDescription = jobDescription.length >= 10;

        if (validCandidateEmail && validCandidateName && validJobDescription) {
            const payload = {
                "questions_asked_to_the_candidate": qn.map((ele) => ele.question),
                "scores_respectively": qn.map((ele, i) => `${qnScores[i].score}/${ele.weightage}`),
                "candidates_experience": parseInt(experience),
                "candidate_email": candidateEmail,
                "candidate_name": candidateName,
                "hiring_for": role,
                "candidates_skills": skills,
                "job_description": jobDescription,
                "total_score": `${totalScore}/${totalWeightage}`,
                "percentage": `${((totalScore / totalWeightage) * 100).toFixed(2)}%`,
            };

            setLoading(true);

            try {
                const resp = await postData("https://ai-interviewer-backend-ar0x.onrender.com", payload);

                setLoading(false);

                if (resp && resp.comments) {
                    setComments(resp.comments);
                    setShowComments(true);
                } else {
                    displayToast('warn', "A minor error occurred while Analyzing the candidate with AI. Try again after some time.",3000,"top-right");
                }
            } catch (error) {
                console.error("Error:", error);
                displayToast('error', "An error occurred while processing the request. Please try again.",3000,"top-right");
            }
        } else {
            displayToast('warn', "Enter a valid Name, Email address, and Job Description before AI Analysis.",4000,"top-right");
        }
    };

    const handleCloseComments = () => {
        setShowComments(false);
        setShowAnalysisCard(false);
    }

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            {showAnalysisCard &&
                <AnalysisCard
                    setDescription={(desc) => setJobDescription(desc)}
                    handleSaveDescription={saveDescription}
                    handleCloseDescription={closeDescription}
                    rows={row}
                    className="analysis-card" />
            }
            {showComments &&
                <Comments
                    comments={comments}
                    handleCloseComments={handleCloseComments}
                />
            }
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(42,35,146,0.9)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 999,
                        borderRadius: '10px'
                    }}
                >
                    <Typography
                        variant="h6"
                        style={{ marginBottom: "20px", color: "white" }}
                    >
                        {jobDescription.length ? "AI is Analysing Your Candidate. This may take a moment !!" : "Publishing the Results. This may take a moment !!"}
                    </Typography>
                    <CircularProgress
                        sx={{
                            color: "white",
                        }}
                    />
                </div>
            )}
            <Card
                sx={{
                    width: '700px',
                    height: 'max-content',
                    position: 'relative',
                    zIndex: 0,
                    borderRadius: '10px'
                }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom style={{ margin: "15px 15px 15px 10px" }}>
                        <strong>Results</strong>
                        {parseFloat(percentage) > 50 ? (
                            <img src={passIcon} alt="pass" style={{ width: '20px', height: '20px', marginLeft: '8px', marginTop: '5px' }} />
                        ) : (
                            <img src={failIcon} alt="fail" style={{ width: '20px', height: '20px', marginLeft: '8px', marginTop: '5px' }} />
                        )}
                    </Typography>

                    <Typography variant="body1" style={{ margin: "10px" }}>
                        <span style={{ color: 'green' }}>Overall Percentage:</span> <strong><span style={{ fontSize: '20px' }}>{percentage}%</span></strong>
                    </Typography>
                    <Typography variant="body1" style={{ margin: "10px" }}>
                        <span style={{ color: 'green' }}>Candidate's Score:</span> <strong><span style={{ fontSize: '20px' }}>{totalScore.toFixed(2)}</span></strong>
                    </Typography>
                    <Typography variant="body1" style={{ margin: "10px 10px 25px 10px" }}>
                        <span style={{ color: 'red' }}>Total Score:</span> <strong><span style={{ fontSize: '20px' }}>{totalWeightage}</span></strong>
                    </Typography>
                    <Grid container spacing={2} >
                    <Grid item xs={12} sm={10}>
                            <TextField id="candidate-name" label="Your Company Name" fullWidth style={{ margin: "10px" }} onChange={handleCompanyNameChange} />
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField id="candidate-name" label="Candidate's Name" fullWidth style={{ margin: "5px 10px 10px 10px" }} onChange={handleCandidateNameChange} />
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField id="candidate-email" label="Candidate's Email" fullWidth style={{ margin: "5px 10px 10px 10px" }} onChange={handleCandidateEmailChange} />
                        </Grid>
                        {receiveResultsMail && (<Grid item xs={12} sm={10}>
                            <TextField id="interviewer-email" label="Your Email" fullWidth style={{ margin: "5px 10px 15px 10px" }} onChange={handleInterviewerEmailChange} />
                        </Grid>)}
                    </Grid>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="body1" style={{ margin: "10px" }}>
                            <Checkbox
                                checked={publishWithAnswers}
                                onChange={handlePublishWithAnswersChange}
                            />
                            Publish results with answers.
                        </Typography>
                        <Typography variant="body1" style={{ margin: "10px" }}>
                            <Checkbox
                                checked={receiveResultsMail}
                                onChange={handleReceiveResultsMailChange}
                            />
                            Receive results Email to your inbox.
                        </Typography>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="body1" style={{ margin: "10px" }}>
                            <Checkbox
                                checked={includeSelectionStatus}
                                onChange={handleIncludeSelectionStatusChange}
                            />
                            Include selection status.
                        </Typography>
                        <Typography variant="body1" style={{ margin: "10px" }}>
                            <Checkbox
                                checked={aiAnalysis}
                                onChange={handleAIAnalysis}
                            />
                            Analyse Candidate with AI.
                        </Typography>
                        {(jobDescription && jobDescription.length >= 100 && aiAnalysis) && (<Button
                            sx={{ color: "#2a2392", ":hover": { fontWeight: "bold" } }}
                            onClick={showAnalysis}
                        >
                            <u>Show Analysis</u>
                        </Button>)}
                    </div>
                    {includeSelectionStatus && (
                        <RadioGroup
                            aria-label="selection-status"
                            name="selection-status"
                            value={selectionStatus}
                            onChange={handleSelectionStatusChange}
                            style={{ margin: "5px 10px 10px 20px", display: "flex", flexDirection: "row" }}
                        >
                            <FormControlLabel value="selected" control={<Radio />} label="Selected" />
                            <FormControlLabel value="rejected" control={<Radio />} label="Rejected" />
                        </RadioGroup>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ margin: '16px', backgroundColor: "#2a2392", ":hover": { color: '#0057c8', background: 'white', fontWeight:'bold' },
                        }}
                        >
                            Publish Results
                        </Button>
                        <Button
                            onClick={onClose}
                            sx={{ margin: '16px', color: "#2a2392", ":hover": { fontWeight: "bold" } }}
                        >
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResultsCard;