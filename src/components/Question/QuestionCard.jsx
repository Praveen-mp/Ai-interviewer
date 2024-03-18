import React, { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const QuestionCard = ({ question, answer, weightage,total }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState("");
  const cardRef = useRef(null);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleScoreChange = (event) => {
    setScore(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      alert(`Score saved for question: ${question} - Score: ${score}`);
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      const contentHeight = cardRef.current.clientHeight;
      cardRef.current.style.height = isFlipped ? `${contentHeight}px` : "230px";
    }
  }, [isFlipped, answer]);

  return (
    <Card
      style={{
        margin: "10px",
        padding: "10px",
        height: isFlipped ? "auto" : "230px",
        perspective: "1000px",
        transition: "transform 1s, height 1s",
        transformStyle: "preserve-3d",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        position: "relative",
      }}
      ref={cardRef}
    >
      <CardContent
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          backfaceVisibility: "hidden",
          display: isFlipped ? "none" : "block",
        }}
      >
        <Typography variant="h5">
          <strong>{question}</strong>
        </Typography>
        <Typography variant="caption">
          <span style={{ color: "green" }}>Weightage: </span>
          {weightage}
        </Typography>
      </CardContent>
      <CardContent
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          backfaceVisibility: isFlipped ? "visible" : "hidden",
          display: isFlipped ? "block" : "none",
        }}
      >
        <Typography>{answer}</Typography>
      </CardContent>
      <IconButton
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
        }}
        onClick={handleCardClick}
      >
        {isFlipped ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
      {isFlipped ? (
        <></>
      ) : (
        <>
        <Typography variant="caption" style={{
            position: "absolute",
            bottom: "43px",
            left: "220px",
            width: "80px",
            transform: "translate(-50%, -50%)",
          }}>
          Score
        </Typography>
        <TextField
          variant="outlined"
          value={score}
          onChange={handleScoreChange}
          onKeyPress={handleKeyPress}
          inputProps={{
            style: {
              height: "1px",
            },
          }}
          style={{
            position: "absolute",
            bottom: "5px",
            left: "220px",
            width: "80px",
            transform: "translate(-50%, -50%)",
          }}
        /></>
      )}
    </Card>
  );
};

export default QuestionCard;
