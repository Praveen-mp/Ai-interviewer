import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Resources.css';

const Resources = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Loading Resources !!");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ai-interviewer-backend-ar0x.onrender.com/resources');
        setQuestions(response.data);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error); 
        setLoading(false); 
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

  if (loading) {
    return  <div className='loading-overlay'>
    <div className='loading-message'>{loadingMsg}</div>
  </div>;
  }

  if (error) {
    return <div className='error-overlay'>
      <div className='error-message'>
        Error fetching data. <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>;
  }
  

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
