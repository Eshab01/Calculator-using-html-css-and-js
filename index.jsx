import { useState, useEffect } from 'react';
import { Moon, Sun, History, Home, ChevronRight, X } from 'lucide-react';

export default function CosmicCalculator() {
  const [display, setDisplay] = useState('0');
  const [currentPage, setCurrentPage] = useState('intro');
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [equation, setEquation] = useState('');
  const [animateIntro, setAnimateIntro] = useState(true);

  useEffect(() => {
    if (currentPage === 'intro') {
      const timer = setTimeout(() => {
        setAnimateIntro(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleNumberClick = (num) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
      setEquation(num);
    } else {
      setDisplay(display + num);
      setEquation(equation + num);
    }
  };

  const handleOperatorClick = (op) => {
    if (display !== 'Error') {
      setDisplay(display + op);
      setEquation(equation + op);
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setEquation('');
  };

  const calculateResult = () => {
    try {
      // Using a safer approach to evaluate mathematical expressions
      // This avoids potential security issues with eval()
      const sanitizedEquation = equation.replace(/[^-()\d/*+.]/g, '');
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict";return (' + sanitizedEquation + ')')();
      
      const formattedResult = Number.isInteger(result) 
        ? result.toString() 
        : result.toFixed(8).replace(/\.?0+$/, '');
      
      setDisplay(formattedResult);
      setEquation(formattedResult);
      setHistory([...history, { equation, result: formattedResult }]);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const deleteLastChar = () => {
    if (display !== 'Error' && display.length > 0) {
      const newDisplay = display.slice(0, -1);
      const newEquation = equation.slice(0, -1);
      setDisplay(newDisplay || '0');
      setEquation(newEquation);
    }
  };

  const renderButtons = () => {
    const buttons = [
      { value: '7', class: 'digit' },
      { value: '8', class: 'digit' },
      { value: '9', class: 'digit' },
      { value: '/', class: 'operator', display: '÷' },
      { value: '4', class: 'digit' },
      { value: '5', class: 'digit' },
      { value: '6', class: 'digit' },
      { value: '*', class: 'operator', display: '×' },
      { value: '1', class: 'digit' },
      { value: '2', class: 'digit' },
      { value: '3', class: 'digit' },
      { value: '-', class: 'operator' },
      { value: '0', class: 'digit' },
      { value: '.', class: 'digit' },
      { value: '=', class: 'equal' },
      { value: '+', class: 'operator' }
    ];

    return buttons.map((button, index) => (
      <button
        key={index}
        className={`flex items-center justify-center text-lg font-semibold rounded-lg transition-all ${
          darkMode 
            ? `${button.class === 'operator' || button.class === 'equal' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'} text-white`
            : `${button.class === 'operator' || button.class === 'equal' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-200 hover:bg-gray-300'} text-gray-800`
        }`}
        onClick={() => {
          if (button.class === 'digit') handleNumberClick(button.value);
          else if (button.class === 'operator') handleOperatorClick(button.value);
          else if (button.value === '=') calculateResult();
        }}
      >
        {button.display || button.value}
      </button>
    ));
  };

  if (currentPage === 'intro') {
    return (
      <div className={`w-full h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-500`}>
        <div className={`flex flex-col items-center ${animateIntro ? 'animate-pulse' : ''}`}>
          <div className="text-6xl mb-4 font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Cosmic Calculator
          </div>
          <div className="text-xl mb-8 text-center max-w-md">
            Explore the universe of mathematics with an extraordinary calculator experience
          </div>
          <button 
            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
              darkMode ? 'bg-purple-700 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-400 text-white'
            }`}
            onClick={() => setCurrentPage('calculator')}
          >
            Begin Journey <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="absolute top-4 right-4">
          <button 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        <div className="absolute bottom-4 text-sm opacity-60">
          © 2025 Cosmic Calculator
        </div>
      </div>
    );
  }

  if (currentPage === 'history') {
    return (
      <div className={`w-full h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-500`}>
        <div className={`p-4 flex justify-between items-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Calculation History
          </div>
          <div className="flex gap-2">
            <button 
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setCurrentPage('calculator')}
            >
              <Home size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>
                <History />
              </div>
              <p className="text-lg">No calculations yet</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your calculation history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
                >
                  <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Equation:
                  </div>
                  <div className="text-lg font-mono">
                    {item.equation}
                  </div>
                  <div className={`text-sm mt-2 mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Result:
                  </div>
                  <div className="text-xl font-bold font-mono bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    {item.result}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-500`}>
      <div className={`p-4 flex justify-between items-center ${darkMode ? 'bg-black' : 'bg-white'} shadow-md`}>
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Cosmic Calculator
        </div>
        <div className="flex gap-2">
          <button 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setCurrentPage('history')}
          >
            <History size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4">
        <div className={`mb-4 p-6 rounded-lg ${darkMode ? 'bg-black' : 'bg-white'} shadow-lg`}>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
            {equation || ' '}
          </div>
          <div className="text-4xl font-mono font-bold overflow-x-auto whitespace-nowrap">
            {display}
          </div>
        </div>
        
        <div className="flex mb-4 gap-2">
          <button 
            className={`flex-1 p-3 rounded-lg font-semibold ${
              darkMode ? 'bg-red-900 hover:bg-red-800' : 'bg-red-500 hover:bg-red-400'
            } text-white`}
            onClick={clearDisplay}
          >
            Clear
          </button>
          <button 
            className={`w-16 p-3 rounded-lg font-semibold ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={deleteLastChar}
          >
            <X size={20} className="mx-auto" />
          </button>
        </div>
        
        <div className="flex-1 grid grid-cols-4 gap-2">
          {renderButtons()}
        </div>
        
        <button 
          className={`mt-4 p-3 rounded-lg ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setCurrentPage('intro')}
        >
          Back to Intro
        </button>
      </div>
    </div>
  );
}
