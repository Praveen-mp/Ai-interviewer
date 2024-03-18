import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import QuestionCard from "../Question/QuestionCard";
import {
  FormControl,
  Autocomplete,
  InputLabel,
  Chip,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import rolesArray from "../../utils/Roles";
import TechnicalSkillsArray from "../../utils/TechnicalSkills";
import './Interviewer.css'
const Interviewer = () => {
  const [loading, setLoading] = useState(false);
  const [responseContent, setResponseContent] = useState({ messages: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const mandatoryFields = ["role", "experience", "questions", "selectedSkills"];
  const [question, setQuestion] = useState([]);
  const [totalWeightage, setTotalWeightage] = useState(0);
  let questionCardsRef = useRef(null);

  useEffect(() => {
    if (responseContent && responseContent.messages.length) {
      let parsedQuestions = parseData(
        responseContent.messages.replaceAll("**", "")
      );
      setQuestion(parsedQuestions);
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

    question.map((qn)=>{
      weigh += parseInt(qn.weightage)
    })
    setTotalWeightage(weigh)
  }, [question]);

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
      for (const skills of selectedSkills.splice(
        0,
        selectedSkills.length - 1
      )) {
        resultSkills += skills + "," + " ";
      }

      if (experience === "Fresher") {
        exp = 0;
      } else if (experience === "15+") {
        exp = "15+";
      } else {
        exp = parseInt(experience) + 1;
      }

      let formatString = `
      1. **Explain the bias-variance tradeoff in machine learning.** *(Weightage: 2)*
         - **Answer**: The bias-variance tradeoff refers to the balance between underfitting (high bias) and overfitting (high variance) in a model. It's crucial to find the right level of complexity to achieve optimal performance.
      
      2. **What is regularization, and why is it important?** *(Weightage: 1)*
         - **Answer**: Regularization techniques (e.g., L1, L2) prevent overfitting by adding penalty terms to the loss function. They help control model complexity.
      
      3. **Describe gradient descent and its variants.** *(Weightage: 2)*
         - **Answer**: Gradient descent is an optimization algorithm used to minimize the loss function. Variants include stochastic gradient descent (SGD), mini-batch SGD, and Adam.
      
      4. **How do you handle missing data in a dataset?** *(Weightage: 1)*
         - **Answer**: Options include imputation (mean, median, etc.), deletion, or using advanced techniques like regression-based imputation.
      
      5. **What's the difference between classification and regression?** *(Weightage: 1)*
         - **Answer**: Classification predicts discrete labels (e.g., spam or not spam), while regression predicts continuous values (e.g., house prices).
      
      6. **Explain cross-validation and its benefits.** *(Weightage: 2)*
         - **Answer**: Cross-validation assesses model performance by splitting data into multiple folds. It helps estimate generalization performance and prevents overfitting.`;

      const requestData = {
        content:
          `Hello Bing, act as an experienced interviewer and generate interview questions for a ${role} with ${exp} years of experience in ${
            resultSkills + selectedSkills[selectedSkills.length - 1]
          }. Provide ${
            parseInt(questions) + 1
          } questions with very simple oneliner answers and weightages for each question based on the complexity with an overall weightages of 10. Here's the format of response I need from you for better formatting and processing. Just stick only for the response format from the below example not the content and the count.` +
          formatString,
      };

      try {
        const response = await fetch("http://localhost:10001/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("responsedata", responseData);
          setResponseContent(responseData);
          if (responseData.messages.includes("points")) {
            console.log("Re-rendering");
            await handleSubmit();
          }
          setRole("");
          setExperience("");
          setQuestions("");
          setSelectedSkills([]);
        } else {
          console.error("Error in response:", response.status);
          setResponseContent(null);
          setRole("");
          setExperience("");
          setQuestions("");
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

  const handleChange = (event, value) => {
    setRole(value);
  };

  const parseData = (data) => {
    let respArray = [];
    data = data.replaceAll("*", "");
    let questionsArray = data.split("\n");
    console.log(questionsArray.slice(2, questionsArray.length - 1));
    const filteredQuestionsArray = questionsArray
      .slice(2, questionsArray.length - 1)
      .filter((element) => element.trim() !== "");
    console.log(filteredQuestionsArray);

    if (filteredQuestionsArray.length % 2 !== 0) {
      filteredQuestionsArray.pop();
    }

    let qnIndex = 0;
    let ansIndex = 1;
    while (qnIndex < filteredQuestionsArray.length) {
      console.log(filteredQuestionsArray[qnIndex]);
      respArray.push({
        question: filteredQuestionsArray[qnIndex].split(". ")[1].split(" (")[0],
        answer: filteredQuestionsArray[ansIndex].split("Answer: ")[1],
        weightage: filteredQuestionsArray[qnIndex]
          .replaceAll("(", "")
          .replaceAll(")", "")
          .split("Weightage: ")[1],
      });
      qnIndex += 2;
      ansIndex += 2;
    }

    console.log(respArray);
    return respArray;
  };

  const handleExperienceChange = (event) => {
    setExperience(event.target.value);
  };

  const handleSkillsChange = (event, values) => {
    setSelectedSkills(values);
  };

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
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          position: "relative",
        }}
      >
        <Box
          sx={{
            background: "rgba(169, 169, 169, 0.2)",
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
                background: "rgba(247, 220, 111, 0.6)",
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
                style={{ marginBottom: "20px", color: "#333" }}
              >
                Your Questions are getting Ready
              </Typography>
              <CircularProgress
                sx={{
                  color: "black",
                }}
              />
            </div>
          )}
          <FormControl fullWidth>
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
                background: "#F7DC6F",
                color: "black",
                "&:hover": { color: "#F7DC6F", background: "black" },
              }}
            >
              Generate Questions
            </Button>
          </FormControl>
        </Box>
      </div>
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
          <QuestionCard key={index} total={totalWeightage} {...q} style={{ width: "100%" }} />
        ))}
      </div>
    </Container>
  );
};

export default Interviewer;
