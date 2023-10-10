// frontend/src/App.js

import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <div className="App">
      <h1>Blog</h1>
      <Signup />
      <Login />
    </div>
  );
}

export default App;
