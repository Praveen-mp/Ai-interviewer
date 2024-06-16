import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  Autocomplete,
  InputLabel,
  Chip,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Typography
} from "@mui/material";
import QuestionCard from "../Question/QuestionCard";
import { toast } from "react-toastify";
import ResultsCard from "../ResultsCard/ResultsCard";
import rolesArray from "../../utils/Roles";
import TechnicalSkillsArray from "../../utils/TechnicalSkills";
import './Interviewer.css';

const Interviewer = () => {
  const [loading, setLoading] = useState(false);
  const [responseContent, setResponseContent] = useState({ response: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [question, setQuestion] = useState([]);
  const [totalWeightage, setTotalWeightage] = useState(0);
  const [questionScores, setQuestionScores] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [prevValues, setPrevValues] = useState({});
  const [qId, setqID] = useState();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [questions, setQuestions] = useState("");

  const questionCardsRef = useRef(null);
  const generateCardsRef = useRef(null);

  useEffect(() => {
    if (
      responseContent &&
      responseContent.response &&
      Array.isArray(JSON.parse(responseContent.response)) &&
      responseContent.response.length > 0
    ) {
      setQuestion(JSON.parse(responseContent.response));
      setqID(responseContent.q_id);
    }
  }, [responseContent]);

  useEffect(() => {
    let weigh = 0;
    if (questionCardsRef.current) {
      const boundingBox = questionCardsRef.current.getBoundingClientRect();
      window.scrollTo({
        top: boundingBox.top - 40 + window.scrollY,
        left: boundingBox.left - 40 + window.scrollX,
        behavior: "smooth",
      });
    }
    question.forEach(qn => {
      weigh += parseFloat(qn.weightage);
    });
    setTotalWeightage(weigh);
  }, [question, showResults]);

  const updateQuestionScore = useCallback((index, score) => {
    setQuestionScores(prevScores => {
      const updatedScores = [...prevScores];
      const existingIndex = updatedScores.findIndex(item => item.index === index);
      if (existingIndex !== -1) {
        updatedScores[existingIndex] = { index, score };
      } else {
        updatedScores.push({ index, score });
      }
      return updatedScores;
    });
  }, []);

  const calculateTotalScore = useCallback(() => {
    return questionScores.reduce((acc, qn) => acc + parseFloat(qn.score || 0), 0);
  }, [questionScores]);

  const handleDisplayResults = useCallback(() => {
    setTotalScore(calculateTotalScore());
    setShowResults(true);
  }, [calculateTotalScore]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mandatoryFields = { role, experience, questions, selectedSkills };
    const missingFields = Object.entries(mandatoryFields).filter(([_, value]) => !value).map(([key]) => key);

    if (missingFields.length > 0) {
      setSnackbarOpen(true);
      setSnackbarMessage(
        missingFields
          .map(field => (field === "selectedSkills" ? "Technical Skills" : field.charAt(0).toUpperCase() + field.slice(1)))
          .join(", ") + " are mandatory to generate Questions."
      );
      return;
    }

    setLoading(true);
    let exp = experience === "Fresher" ? 0 : experience === "15+" ? "15+" : parseInt(experience) + 1;
    const resultSkills = selectedSkills.join(", ");
    setPrevValues({ role, experience, selectedSkills, questions });

    const requestData = {
      content: `Hello GPT, act as an experienced interviewer and generate interview questions for a ${role} with ${exp} years of experience in ${resultSkills}. Provide ${parseInt(questions) + 1} questions with simple answers and weightages for each question in numbers based on the complexity.`,
      role,
      questions: parseInt(questions) + 1,
      experience: exp,
      skills: selectedSkills,
    };

    try {
      setQuestion([]);
      const responseData = await fetch("https://ai-interviewer-backend-ar0x.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (responseData.ok) {
        const res = await responseData.json();
        toast.success(
          <div>
            <div>Generated {parseInt(questions) + 1} questions for a {role} with {exp} years of expertise.</div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast',
          }
        );
        setResponseContent(res);
        setRole("");
        setExperience("");
        setQuestions("");
        setQuestionScores([]);
        setSelectedSkills([]);
      } else {
        console.error("Error in response:", responseData.status);
        toast.warn(
          <div>
            <div>Error generating questions with your data.</div>
            <div>Retry Again with new Inputs</div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast',
          }
        );
        setResponseContent(null);
        setRole("");
        setExperience("");
        setQuestions("");
        setQuestionScores([]);
        setSelectedSkills([]);
      }
    } catch (error) {
      console.error("Error while fetching:", error);
      setResponseContent(null);
    } finally {
      setLoading(false);
    }
  };

  const regenerateQuestions = useCallback(() => {
    setQuestion([]);
    setRole(prevValues.role);
    setExperience(prevValues.experience);
    setSelectedSkills(prevValues.selectedSkills);
    setQuestions(prevValues.questions);
  }, [prevValues]);

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  }, []);

  return (
    <Container maxWidth="lg">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ width: "290px", marginTop: "60px" }}
      >
        <Alert
          onClose={handleClose}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div
        ref={generateCardsRef}
        style={{
          display: showResults ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          position: "relative",
        }}
      >
        <Box
          sx={{
            background: "rgba(139, 176, 244, 0.2)",
            padding: "40px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.4)",
            position: "relative",
          }}
        >
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
                borderRadius: "10px",
              }}
            >
              <Typography
                variant="h6"
                style={{ marginBottom: "20px", color: "white" }}
              >
                Generating Questions, please wait...
              </Typography>
              <CircularProgress size={70} />
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={rolesArray}
                    value={role}
                    onChange={(event, newValue) => setRole(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Role" variant="outlined" />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Experience</InputLabel>
                  <Select
                    value={experience}
                    onChange={(event) => setExperience(event.target.value)}
                    label="Experience"
                    sx={{ textAlign: "left" }}
                  >
                    <MenuItem value="Fresher">Fresher</MenuItem>
                    {[...Array(15)].map((_, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {index + 1}
                      </MenuItem>
                    ))}
                    <MenuItem value="15+">15+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple
                    options={TechnicalSkillsArray}
                    value={selectedSkills}
                    onChange={(event, newValue) => setSelectedSkills(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={index}
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Technical Skills"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Questions"
                  variant="outlined"
                  fullWidth
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Generate Questions
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </div>
      
      {question.length > 0 && (
        <div ref={questionCardsRef}>
          <div className="interviewer">
            <Grid container spacing={3}>
              {question.slice(1).map((questionData, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <QuestionCard
                    index={index + 1}
                    question={questionData}
                    updateQuestionScore={updateQuestionScore}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              mt={2}
              mb={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              className="resultButton"
            >
              <Button
                onClick={handleDisplayResults}
                variant="contained"
                color="secondary"
                size="large"
              >
                Display Results
              </Button>
            </Box>
          </div>
        </div>
      )}

      {showResults && (
        <ResultsCard
          role={prevValues.role}
          experience={prevValues.experience}
          selectedSkills={prevValues.selectedSkills}
          questions={prevValues.questions}
          totalScore={totalScore}
          totalWeightage={totalWeightage}
          regenerateQuestions={regenerateQuestions}
          qId={qId}
        />
      )}
    </Container>
  );
};

export default React.memo(Interviewer);
