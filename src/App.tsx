// import React, { useState } from 'react'
import classNames from 'classnames';
import streetsData from './StreetsData.tsx';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './assets/css/style.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


function App() {
  const streetsList = streetsData.map(streetObject => {
    let listItemClasses = classNames(
      "list_item",
      {'grey_bg': streetObject.index % 2 == 0}
    );
    return (
      <div
        className={listItemClasses}
        key={streetObject.index}
        >
        { streetObject.name }  
      </div>
    )
  });

  return (
    <>
      <main>
        <div id="list">
          {streetsList}
        </div>
        <div
          id="sidebar"
        >
          <div id="action_buttons">
            <button>
              <FontAwesomeIcon icon={faEye} />
            </button>
            <FontAwesomeIcon icon={faLocationDot} />
            <FontAwesomeIcon icon={faSquareCheck} />
            <FontAwesomeIcon icon={faPen} />
            <FontAwesomeIcon icon={faRotateRight} />
          </div>
          {/* <FontAwesomeIcon icon={faArrowLeft} /> */}
        </div>
      </main>
    </>
  )
}

export default App
