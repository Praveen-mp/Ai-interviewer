import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import QuestionCard from "../Question/QuestionCard";
import { toast } from "react-toastify"
import ResultsCard from "../ResultsCard/ResultsCard";

import {
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
import rolesArray from "../../utils/Roles";
import TechnicalSkillsArray from "../../utils/TechnicalSkills";
import './Interviewer.css'

const Interviewer = () => {
  const [loading, setLoading] = useState(false);
  const [responseContent, setResponseContent] = useState({ response: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const mandatoryFields = ["role", "experience", "questions", "selectedSkills"];
  const [question, setQuestion] = useState([]);
  const [totalWeightage, setTotalWeightage] = useState(0);
  const [questionScores, setQuestionScores] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [prevValues, setPrevValues] = useState();
  const [qId, setqID] = useState();

  let questionCardsRef = useRef(null);
  let generateCardsRef = useRef(null);

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
    const boundingBox = questionCardsRef.current.getBoundingClientRect();
    window.scrollTo({
      top: boundingBox.top - 40 + window.scrollY,
      left: boundingBox.left - 40 + window.scrollX,
      behavior: "smooth",
    });

    question.map((qn) => {
      weigh += parseFloat(qn.weightage)
    })
    setTotalWeightage(weigh)
  }, [question, showResults]);

  const updateQuestionScore = (index, score) => {
    const existingIndex = questionScores.findIndex(item => item.index === index);
    if (existingIndex !== -1) {
      const updatedScores = [...questionScores];
      updatedScores[existingIndex] = { index: index, score: score };
      setQuestionScores(updatedScores);
    } else {
      setQuestionScores(prevScores => [...prevScores, { index: index, score: score }]);
    }
  };

  const calculateTotalScore = () => {
    const totalScore = questionScores.reduce((acc, qn) => acc + parseFloat(qn.score || 0), 0);
    return totalScore;
  };

  const handleDisplayResults = () => {
    setTotalScore(calculateTotalScore());
    setShowResults(true);
  };

  const handleSubmit = async (e) => {
    const areAllFieldsPresent = mandatoryFields.every((field) => {
      if (!eval(field)) {
        setSnackbarOpen(true);
        setSnackbarMessage(
          mandatoryFields
            .filter((mandatoryField) => !eval(mandatoryField))
            .map((missingField) =>
              missingField === "selectedSkills"
                ? "Technical Skills"
                : missingField.charAt(0).toUpperCase() + missingField.slice(1)
            )
            .join(", ") + " are mandatory to generate Questions."
        );
        return false;
      }
      return true;
    });

    if (areAllFieldsPresent) {
      e.preventDefault();
      setLoading(true);
      let exp;
      let resultSkills = "";
      let spl = [...selectedSkills];
      for (const skills of spl.splice(0, selectedSkills.length - 1)) {
        resultSkills += skills + "," + " ";
      }

      if (experience === "Fresher") {
        exp = 0;
      } else if (experience === "15+") {
        exp = "15+";
      } else {
        exp = parseInt(experience) + 1;
      }
      setPrevValues({
        role: role,
        experience: experience,
        selectedSkills: selectedSkills,
        questions: questions
      })
      const requestData = {
        content:
          `Hello GPT, act as an experienced interviewer and generate interview questions for a ${role} with ${exp} years of experience in ${resultSkills + selectedSkills[selectedSkills.length - 1]
          }. Provide ${parseInt(questions) + 1
          } questions with simple answers and weightages for each question in numbers based on the complexity.`,
        role: role,
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
    }
  };

  const [role, setRole] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [selectedSkills, setSelectedSkills] = React.useState([]);
  const [questions, setQuestions] = React.useState("");

  const regenerateQuestions = (e) => {
    setQuestion([]);
    setRole(prevValues.role);
    setExperience(prevValues.experience);
    setSelectedSkills(prevValues.selectedSkills);
    setQuestions(prevValues.questions);
  }

  const handleChange = (event, value) => {
    setRole(value);
  };

  const handleExperienceChange = (event) => {
    setExperience(event.target.value);
  };

  const handleSkillsChange = (event, values) => {
    setSelectedSkills(values);
  };

  const hideResults = (event) => {
    setShowResults(false);
  }

  const handleQuestionsChange = (event) => {
    setQuestions(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

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
                Your Questions are getting Ready
              </Typography>
              <CircularProgress
                sx={{
                  color: "white",
                }}
              />
            </div>
          )}
          <FormControl fullWidth disabled="showResults">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={rolesArray}
                  getOptionLabel={(option) => option}
                  value={role}
                  onChange={handleChange}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      sx={{ width: 380 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Experience</InputLabel>
                  <Select
                    label="Experience"
                    value={experience}
                    onChange={handleExperienceChange}
                    sx={{ width: 380 }}
                  >
                    <MenuItem value="Fresher">Fresher</MenuItem>
                    {[...Array(14).keys()].map((value) => (
                      <MenuItem key={value} value={value.toString()}>
                        {value + 1}
                      </MenuItem>
                    ))}
                    <MenuItem value="15+">15&lt;</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  id="skills"
                  options={TechnicalSkillsArray}
                  getOptionLabel={(option) => option}
                  value={selectedSkills}
                  onChange={handleSkillsChange}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Technical Skills"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      sx={{ width: 380 }}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option}
                        label={option}
                        {...getTagProps({ index })}
                        variant="outlined"
                      />
                    ))
                  }
                  PaperComponent={({ children }) => (
                    <Paper elevation={8}>{children}</Paper>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Number of Questions</InputLabel>
                  <Select
                    label="Number of Questions"
                    value={questions}
                    onChange={handleQuestionsChange}
                    sx={{ width: 380 }}
                  >
                    {[...Array(15).keys()].map((value) => (
                      <MenuItem key={value} value={value.toString()}>
                        {value + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                marginTop: "40px",
                width: "220px",
                alignSelf: "center",
                background: "#2a2392",
                color: "white",
                ":hover": { color: '#0057c8', background: 'white', fontWeight:'bold' },
              }}
            >
              Generate Questions
            </Button>
          </FormControl>
        </Box>
      </div>
      {showResults && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <ResultsCard
            className="result-card"
            totalScore={totalScore}
            totalWeightage={totalWeightage}
            q_id={qId}
            qn={question}
            qnScores={questionScores}
            role={prevValues.role}
            experience={prevValues.experience}
            skills={prevValues.selectedSkills}
            onClose={() => setShowResults(false)}
          />
        </div>
      )}
      <div
        ref={questionCardsRef}
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(300px, 1fr))",
          gap: "16px",
          justifyContent: "center"
        }}
      >
        {question.map((q, index) => (
          <QuestionCard key={index} index={index} total={totalWeightage} {...q} disable={showResults} updateScore={(index, score) => updateQuestionScore(index, score)} style={{ width: "100%" }} />
        ))}
      </div>
      {question.length ? <span style={{ display: "flex", flexDirection: "row" }}><Button
        variant="contained"
        color="primary"
        onClick={handleDisplayResults}
        disabled={!questionScores.every(score => score !== "") || showResults}
        sx={{
          marginTop: "40px",
          width: "220px",
          alignSelf: "center",
          background: "#2a2392",
          color: "white",
          ":hover": { color: '#0057c8', background: 'white', fontWeight:'bold' },
          marginBottom: "30px",
        }}
      >
        Display Results
      </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={regenerateQuestions}
          disabled={!questionScores.every(score => score !== "") || showResults}
          sx={{
            marginTop: "40px",
            marginLeft: "25px",
            width: "260px",
            alignSelf: "center",
            background: "#2a2392",
            color: "white",
            ":hover": { color: '#0057c8', background: 'white', fonWeight:'bold' },
            marginBottom: "30px",
          }}
        >
          Regenerate Questions
        </Button></span> : <></>}
    </Container>
  );
};

export default Interviewer;
