import React from 'react';
import { MainPage } from './modules';
import './App.css';
import { SignalContextProvider } from './contexts';

function App() {
  localStorage.clear();
  return (
    <div className="App">
      <SignalContextProvider>
        <MainPage/>
      </SignalContextProvider>
    </div>
  );
}

export default App;
