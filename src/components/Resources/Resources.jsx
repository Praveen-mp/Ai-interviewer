import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Resources.css';

const Resources = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ai-interviewer-backend-ar0x.onrender.com/resources');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (question) => {
    setSelectedQuestion(question);
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
  };

  return (
    <div className="resources-container">
      {questions.map((question, index) => (
        <div key={index} className="question-card" onClick={() => handleCardClick(question)}>
          <h2>{question.role}</h2>
          <p>Experience: {question.experience} years</p>
          <p>Skills: {question.skills.join(', ')}</p>
        </div>
      ))}

      <div className={`modal ${selectedQuestion ? 'active' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={handleCloseModal}>&times;</span>
          {selectedQuestion && (
            <>
              <h2>{selectedQuestion.role}</h2>
              <p>Experience: {selectedQuestion.experience} years</p>
              <p>Skills: {selectedQuestion.skills.join(', ')}</p>
              <div className="question-details">
                <h3>Interview Questions:</h3>
                {selectedQuestion.questions.map((q, qIndex) => (
                  <div key={qIndex} className="question-answer-card">
                    <p><strong>Question:</strong> {q.question}</p>
                    <p><strong>Answer:</strong> {q.answer}</p>
                    <p><strong>Weightage:</strong> {q.weightage}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
