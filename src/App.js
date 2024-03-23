import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Resources from './components/Resources/Resources';
import Header from './components/Header/Header';
import Interviewer from './components/Interviewer/Interviewer';
import About from './components/About/About';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='App'>
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/interviewer" element={<Interviewer />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Router>
      <ToastContainer/>
    </div>
  );
}

export default App;
