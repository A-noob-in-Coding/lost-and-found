import { useState } from 'react'

import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './login';
import Feed from './feed';
function App() {
  const [currentPage, setCurrentPage] = useState('feed'); // Change the initial state to 'feed'
  
  const navigateToFeed = () => {
    setCurrentPage('feed');
  };
  
  return (
    <>
        {currentPage === 'feed' &&
          <Feed />
        }
      {
        currentPage === 'login' &&
          <Login onLoginSuccess={navigateToFeed} />
        }
      
      /* {currentPage === 'login' && <Login onLoginSuccess={navigateToFeed} />}
      {currentPage === 'feed' && <Feed />} */
 
    </>
  );
}

export default App
