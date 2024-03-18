import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feedback from './components/Feedback/Feedback';
import Header from './components/Header/Header';
import Interviewer from './components/Interviewer/Interviewer';
import About from './components/About/About';
import Welcome from './components/Welcome/Welcome';

function App() {
  return (
    <div className='App'>
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/interviewer" element={<Interviewer />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
