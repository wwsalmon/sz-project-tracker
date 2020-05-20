import React from 'react';

function App() {
  return (
    <div className="sz-navbar bg-black text-white px-4">
      <div className="sz-navbar-inner max-w-6xl sz-navbar-left">
        <div className="demo-navbar-logo"><span>Project Logger</span></div>
        <input type="checkbox" id="sz-navbar-check"></input>
        <label for="sz-navbar-check" className="sz-navbar-hamburger left-4">☰</label>
        <div className="sz-navbar-items ml-auto items-start px-4 sm:px-0 sm:items-center">
          <div className="sz-navbar-item"><span><a href="link1">Item 1</a></span></div>
          <div className="sz-navbar-item"><span><a href="link2">Item 2</a></span></div>
          <div className="sz-navbar-item"><span><a href="link3">Item 3</a></span></div>
        </div>
      </div>
    </div>
  );
}

export default App;
