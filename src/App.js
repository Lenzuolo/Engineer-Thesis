import React from 'react';
import { MainPage } from './modules';
import './App.css';
import { SignalContextProvider, TableContextProvider } from './contexts';

function App() {
  localStorage.clear();
  return (
    <div className="App">
      <SignalContextProvider>
        <TableContextProvider>
          <MainPage/>
        </TableContextProvider>
      </SignalContextProvider>
    </div>
  );
}

export default App;
