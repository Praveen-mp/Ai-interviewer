import React, { useEffect, useState } from 'react';
import './About.css';
import LayerIcon from '../icons/LayerIcon';
import Zoom from '../icons/Zoom';
import Clock from '../icons/Clock';
import Demand from '../icons/Demand';
import Rules from '../icons/Rules';
import PaperWaste from '../icons/PaperWaste';
import Swim from '../icons/Swim';
import Man from '../icons/Man';

const About = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    checkScreenWidth();

    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return (
    <div className="about-container">
      <div className="about-content">
        {!isDesktop && (
          <div className="mobile-message">
            <p>This site is not yet made responsive, kindly visit through your desktop please!!</p>
          </div>
        )}
        {isDesktop && (
          <>
            <div className="title-container">
              <h1>Your <span style={{ backgroundImage: 'linear-gradient(90deg, rgba(0,111,255,1) 0%, rgba(255,0,133,1) 62%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span> Interviewer</h1>
              <Man />
            </div>

            <p className="about-description">
              AI Interviewer is your personal assistant in navigating the challenging world of job interviews. Whether you're a seasoned professional or just starting your career journey, our AI Interviewer provides valuable insights and guidance to help you ace your interviews.
            </p>
            <div className="about-image-container">
              <div className="icon">
                <LayerIcon />
                <p className='text'>Layering insights</p>
              </div>
              <div className="icon">
                <Zoom />
                <p className='text'>Enhanced focus</p>
              </div>
              <div className="icon">
                <Clock />
                <p className='text'>Time optimization</p>
              </div>
              <div className="icon">
                <Demand />
                <p className='text'>Meeting demand</p>
              </div>
              <div className="icon">
                <Rules />
                <p className='text'>Rule adherence</p>
              </div>
              <div className="icon">
                <PaperWaste />
                <p className='text'>Resource Utilization</p>
              </div>
            </div>
            <div className="quote-container">
              <p className="about-quote">
                <i>Smooth seas do not make skillful sailors</i> <Swim />
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default About;
