import React, { useState } from 'react'
import classNames from 'classnames';
import initialStreets from './StreetsData.tsx';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './assets/css/style.css'

import { StreetObject } from './assets/shared/lib/types'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [appMode, setAppMode] = useState<string>("default streets")
  const [streets, setStreets] = useState<StreetObject[]>(initialStreets)

  function handleItemClick(itemIndex: number) {
    const nextStreets = streets.map(street => {
      if (street.index == itemIndex) {
        return {
          ...street,
          isEnabledByDefault: !street.isEnabledByDefault
        };
      }
      return street;
    });
    // Re-render with the new array
    setStreets(nextStreets);
  }

  const streetsList = streets.map(street => {
    let listItemClasses = classNames(
      "list_item",
      {'grey_bg': street.index % 2 == 0}
    );
    let listIndicatorClasses = classNames(
      "list_indicator",
      {'blue': street.isEnabledByDefault}
    );
    return (
      <React.Fragment key={street.index}>
        <div
          className={listIndicatorClasses}
        ></div>
        <div
          className={listItemClasses}
          onClick={() => handleItemClick(street.index)}
        >
          { street.name }  
        </div>
        {/* <div className="list_item_wrapper">
        </div> */}
      </React.Fragment>
    )
  });

  return (
    <>
      <main>
        <div 
          id="dark_background" 
          className={isSidebarOpen ? "shown" : ""}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <div id="list">
          {streetsList}
        </div>
        <div
          id="sidebar"
          className={isSidebarOpen ? "open" : ""}
        >
          <div id="action_buttons">
            <div className="button_wrapper">
              <div className="button_container">
              <button onClick={() => setAppMode('view')} className={appMode == 'view' ? "active" : ""}>

                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
              <div className="button_desc">
                Режим перегляду
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container">
                <button onClick={() => setAppMode('checklist')} className={appMode == 'checklist' ? "active" : ""}>
                  <FontAwesomeIcon icon={faSquareCheck} />
                </button>
              </div>
              <div className="button_desc">
                Режим позначення відвіданих адрес
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container">
                <button onClick={() => setAppMode('adresses')} className={appMode == 'adresses' ? "active" : ""}>
                  <FontAwesomeIcon icon={faLocationDot} />
                </button>
              </div>
              <div className="button_desc">
                Режим редагування адрес
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container">
                <button onClick={() => setAppMode('streets')} className={appMode == 'streets' ? "active" : ""}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </div>
              <div className="button_desc">
                Режим редагування списку вулиць
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container">
                <button onClick={() => setAppMode('default streets')} className={appMode == 'default streets' ? "active" : ""} id="defaults_button">
                  <div></div>
                  <div id="midline"></div>
                  <div></div>
                </button>
              </div>
              <div className="button_desc">
                Режим редагування списку вулиць за замовчуванням
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container" id="reset_button_container">
                <button>
                  <FontAwesomeIcon icon={faRotateRight} />
                </button>
              </div>
              <div className="button_desc" id="reset_button_desc">
                Скинути все
              </div>
            </div>
          </div>
          <button
            id="toggle_sidebar_button"
            className={isSidebarOpen ? "open" : ""}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </div>
      </main>
    </>
  )
}

export default App
