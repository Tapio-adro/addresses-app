import { useState } from 'react'
import classNames from 'classnames';
import initialStreets from './StreetsData.tsx';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './assets/css/style.css'

import { StreetObject, AddressObject } from './assets/shared/lib/types'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [appMode, setAppMode] = useState<string>('default streets')
  const [streets, setStreets] = useState<StreetObject[]>(initialStreets)

  function changeAppMode (mode: string) {
    setAppMode(mode)
    if (isSidebarOpen) {
      setIsSidebarOpen(false)
    }
  }

  function handleItemClick(itemIndex: number) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != itemIndex) {
        return street;
      }
      if (appMode == 'default streets') {
        let shouldRemoveDefaultAddresses = street.isEnabledByDefault
        let newDefaultAddresses = shouldRemoveDefaultAddresses ? [{value: "", index: 0}] : street.defaultAddresses
        let newLastDefaultAddressIndex = shouldRemoveDefaultAddresses ? street.lastDefaultAddressIndex + 1 : street.lastDefaultAddressIndex
        return {
          ...street,
          isEnabledByDefault: !street.isEnabledByDefault,
          isEnabled: !street.isEnabledByDefault,
          defaultAddresses: newDefaultAddresses,
          lastDefaultAddressIndex: newLastDefaultAddressIndex
        };
      } else if (appMode == 'streets') {
        return {
          ...street,
          isEnabled: !street.isEnabled
        };      
      }
      return street;
    });
    setStreets(nextStreets);
  }

  function handleInputChange (streetIndex: number, addressIndex: number, event: React.ChangeEvent<HTMLInputElement>) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != streetIndex) {
        return street;
      }
      const value = event.target.value
      let targetAddressesKey = (appMode == 'default streets' ? 'defaultAddresses' : 'addresses') as keyof typeof street
      let targetAddresses: AddressObject[] = street[targetAddressesKey] as AddressObject[];
      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == addressIndex) {
          let newAddresses = targetAddresses.slice();
          newAddresses[key].value = value;
          return {
            ...street,
            [targetAddressesKey]: newAddresses
          };
        }
      }
      return street;
    });
    setStreets(nextStreets);
  }
  function handleInputBlur (streetIndex: number, addressIndex: number, event: React.ChangeEvent<HTMLInputElement>) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != streetIndex) {
        return street;
      }
      const value = event.target.value
      let targetAddressesKey = (appMode == 'default streets' ? 'defaultAddresses' : 'addresses') as keyof typeof street
      let targetAddresses: AddressObject[] = street[targetAddressesKey] as AddressObject[];
      let targetLastAddressIndexKey = (appMode == 'default streets' ? 'lastDefaultAddressIndex' : 'lastAddressIndex') as keyof typeof street
      let targetLastAddressIndex: number = street[targetLastAddressIndexKey] as number;

      console.log(targetAddressesKey);

      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == addressIndex) {
          let newAddresses = targetAddresses.slice();
          let shouldIncrementIndex = false;
          console.log(newAddresses);
          if (value == '' && newAddresses.length != 1) {
            newAddresses = newAddresses.filter((address) => {
              return address.index != addressIndex;
            })          
          } else if (newAddresses.slice(-1)[0].value != '') {
              newAddresses.push({value: '', index: targetLastAddressIndex})
            shouldIncrementIndex = true;
          }
          console.log(newAddresses);
          return {
            ...street,
            [targetAddressesKey]: newAddresses,
            [targetLastAddressIndexKey]: shouldIncrementIndex ? targetLastAddressIndex + 1 : targetLastAddressIndex
          };
        }
      }
      return street;
    });
    setStreets(nextStreets);
  }

  const streetsList = streets.map(street => {
    let listItemClasses = classNames(
      'list_item',
      {'grey_bg': street.index % 2 == 0}
    );

    let isModeStreetRelated = appMode == 'default streets' || appMode == 'streets';
    let listIndicatorClasses;

    if (!isModeStreetRelated) {
      listIndicatorClasses = classNames(
        'list_indicator',
        'hidden'
      );
    } else if (appMode == 'default streets') {
      listIndicatorClasses = classNames(
        'list_indicator',
        {'blue': street.isEnabledByDefault}
      );
    } else if (appMode == 'streets') {
      listIndicatorClasses = classNames(
        'list_indicator',
        {
          'blue':      street.isEnabled &&  street.isEnabledByDefault,
          'blue_red': !street.isEnabled &&  street.isEnabledByDefault,
          'red':      !street.isEnabled && !street.isEnabledByDefault,
          'green':     street.isEnabled && !street.isEnabledByDefault,
        }
      );
    }

    let streetAddressClasses = classNames(
      'address_input',
      {'hidden': appMode == 'streets' || (appMode == 'default streets' && !street.isEnabledByDefault)}
    );
    let addressesType = appMode == 'default streets' ? street.defaultAddresses : street.addresses
    let addressesList = addressesType.map(address =>
      <div className="input_container" key={address.index}>
        <input
          type="text" 
          className={streetAddressClasses}
          value={address.value} 
          onChange={(event) => handleInputChange(street.index, address.index, event)}
          onBlur={(event) => handleInputBlur(street.index, address.index, event)}
        />
      </div>
    );

    return (
      <div className="list_item_wrapper" key={street.index}>
        <div
          className={listIndicatorClasses}
        >
          <div className="indicator_inner"></div>
        </div>
        <div className="list_item_container">
          <div
            className={listItemClasses}
            onClick={() => handleItemClick(street.index)}
          >
            { street.name }  
          </div>
          {addressesList}
        </div>
      </div>
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
        <div id="list"
          className={appMode == "default streets" || appMode == "streets" ? "any_streets_mode" : ""}
        >
          {streetsList}
        </div>
        <div
          id="sidebar"
          className={isSidebarOpen ? "open" : ""}
        >
          <div id="action_buttons">
            <div className="button_wrapper">
              <div className="button_container">
              <button onClick={() => changeAppMode('view')} className={appMode == 'view' ? "active" : ""}>

                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
              <div className="button_desc">
                Режим перегляду
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container">
                <button onClick={() => changeAppMode('checklist')} className={appMode == 'checklist' ? "active" : ""}>
                  <FontAwesomeIcon icon={faSquareCheck} />
                </button>
              </div>
              <div className="button_desc">
                Режим позначення відвіданих адрес
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container">
                <button onClick={() => changeAppMode('addresses')} className={appMode == 'addresses' ? "active" : ""}>
                  <FontAwesomeIcon icon={faLocationDot} />
                </button>
              </div>
              <div className="button_desc">
                Режим редагування адрес
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container">
                <button onClick={() => changeAppMode('streets')} className={appMode == 'streets' ? "active" : ""}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </div>
              <div className="button_desc">
                Режим редагування списку вулиць
              </div>
            </div>
            <div className="button_wrapper">
              <div className="button_container">
                <button onClick={() => changeAppMode('default streets')} className={appMode == 'default streets' ? "active" : ""} id="defaults_button">
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
