import React, { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from 'react-toastify';
import './QuestionCard.css';
import bg from '../../static/images/assets/paint.png'

const QuestionCard = ({ question, answer, weightage, total, updateScore, index, disable }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState("");
  const [updatedScore, setUpdatedScore] = useState(0);
  const cardRef = useRef(null);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleScoreChange = (event) => {
    setScore(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (parseFloat(score) > parseFloat(weightage)) {
        toast.warn(
          <div>
            <div>Scored marks should not be greater than the provided weightage.</div>
            <div>{`Weightage: ${weightage}`}</div>
            <div>Score: {score}</div>
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
      } else {
        setUpdatedScore(score);
        updateScore(index, score);
        toast.success(
          <div>
            <div>{`Score saved for question: ${question}`}</div>
            <div>Score: <strong>{score}</strong></div>
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
      }
    }
  };

  useEffect(() => {
    setIsFlipped(false);
  }, [disable]);

  useEffect(() => {
    if (cardRef.current) {
      const contentHeight = cardRef.current.clientHeight;
      cardRef.current.style.height = isFlipped ? `${contentHeight}px` : "250px";
    }
  }, [isFlipped, answer]);

  return (
    <Card
      style={{
        margin: "10px",
        padding: "5px",
        perspective: "1000px",
        transition: "transform 1s, height 1s",
        transformStyle: "preserve-3d",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        position: "relative",
        background: "rgba(255,255,255,0.7)",
        borderRadius: "15px",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.4)",
        opacity: disable ? "50%" : "100%"
      }}
      ref={cardRef}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(${bg})`,
          backgroundSize: "280px 280px",
          opacity: "0.04",
          borderRadius: "15px",
        }}
      ></div>
      <CardContent
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          backfaceVisibility: "hidden",
          display: isFlipped ? "none" : "block",
        }}
      >
        <Typography style={{ fontSize: "18px" }}>
          <strong>{question}</strong>
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
      {!disable && (
        <IconButton
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            color: "rgba(42,35,146,0.7)"
          }}
          onClick={handleCardClick}
        >
          {isFlipped ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      )}
      {isFlipped && !disable ? (
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
            <strong>Score: <span style={{ color: "green" }}>{updatedScore ? updatedScore : ""}/{weightage}</span></strong>
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
            disabled={disable}
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
