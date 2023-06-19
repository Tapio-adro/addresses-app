import { useState } from 'react'
import streetsData from './StreetsData.tsx';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHippo } from "@fortawesome/free-solid-svg-icons";


function App() {
  console.log(streetsData);

  const streetsList = streetsData.map(streetObject =>
    <li>
      { streetObject.name }
    </li>
  );

  return (
    <>
      <ul>
        {streetsList}
      </ul>
    </>
  )
}

export default App
