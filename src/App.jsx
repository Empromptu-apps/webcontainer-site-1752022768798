import React, { useState } from 'react';
import RandomColorButton from './components/RandomColorButton';
import UploadExtractFlow from './components/UploadExtractFlow';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Random Color Button App
          </h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="grid gap-8">
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Random Color Button
            </h2>
            <div className="flex justify-center">
              <RandomColorButton />
            </div>
          </div>

          <UploadExtractFlow darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;
