import React, { Component } from 'react';

class Swim extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://cdn.lordicon.com/lordicon.js';
    script.async = true;
    document.body.appendChild(script);
  }

  render() {
    return (
      <lord-icon
        src="https://cdn.lordicon.com/wkrfptjm.json"
        trigger="hover"
        colors="primary:#4030e8,secondary:#9cc2f4"
        style={{ width: '40px', height: '40px' }}
      />
    );
  }
}

export default Swim;
