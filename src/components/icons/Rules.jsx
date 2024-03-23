import React, { Component } from 'react';

class Rules extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://cdn.lordicon.com/lordicon.js';
    script.async = true;
    document.body.appendChild(script);
  }

  render() {
    return (
      <lord-icon
        src="https://cdn.lordicon.com/njpgknbf.json"
        trigger="hover"
        colors="primary:#4030e8,secondary:#9cc2f4"
        style={{ width: '150px', height: '150px' }}
      />
    );
  }
}

export default Rules;
