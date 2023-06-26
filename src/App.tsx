import { useState } from 'react'
import classNames from 'classnames';
import initialStreets from './StreetsData.tsx';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './assets/css/style.css'

import { StreetObject, AddressObject } from './assets/shared/lib/types'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
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

  function handleStreetClick(streetIndex: number) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != streetIndex) {
        return street;
      }
      if (appMode == 'default streets') {
        let shouldRemoveDefaultAddresses = street.isEnabledByDefault
        let newDefaultAddresses = shouldRemoveDefaultAddresses ? [{value: "", index: street.lastDefaultAddressIndex, isVisited: false, isCanceled: false}] : street.defaultAddresses
        let newLastDefaultAddressIndex = shouldRemoveDefaultAddresses ? street.lastDefaultAddressIndex + 1 : street.lastDefaultAddressIndex
        return {
          ...street,
          isEnabledByDefault: !street.isEnabledByDefault,
          isEnabled: !street.isEnabledByDefault,
          defaultAddresses: newDefaultAddresses,
          lastDefaultAddressIndex: newLastDefaultAddressIndex
        };
      } else if (appMode == 'streets') {
        let shouldRemoveAddresses = street.isEnabled
        let newAddresses = shouldRemoveAddresses ? [{value: "", index: street.lastAddressIndex, isVisited: false, isCanceled: false}] : street.addresses
        let newLastAddressIndex = shouldRemoveAddresses ? street.lastAddressIndex + 1 : street.lastAddressIndex
        return {
          ...street,
          isEnabled: !street.isEnabled,
          addresses: newAddresses,
          lastAddressIndex: newLastAddressIndex
        };      
      } else if (appMode == 'checklist') {
        let isStreetVisited = street.isVisited;
        // now if street is marked visited the same is needed to be applied to every its address
        // and if it is unmarked visited all its adresses also should be marked accordingly
        let newAddresses = street.addresses.map((address) => {
          let shouldChangeVisitedStatus = address.value != '';
          console.log(shouldChangeVisitedStatus);
          return {
            ...address,
            isVisited: shouldChangeVisitedStatus ? !isStreetVisited : false
          }
        });
        let newDefaultAddresses = street.defaultAddresses.map((address) => {
          let shouldChangeVisitedStatus = address.value != '';
          console.log(shouldChangeVisitedStatus);
          return {
            ...address,
            isVisited: shouldChangeVisitedStatus ? !isStreetVisited : false
          }
        });
        return {
          ...street,
          addresses: newAddresses,
          defaultAddresses: newDefaultAddresses,
          isVisited: !street.isVisited
        };
      }
      return street;
    });
    setStreets(nextStreets);
  }
  function handleAddressClick (streetIndex: number, IsDefaultAddress: boolean, addressIndex: number) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != streetIndex || appMode != 'checklist') {
        return street;
      }
      let targetAddressesKey = IsDefaultAddress ? 'defaultAddresses' : 'addresses'  as keyof typeof street
      let targetAddresses: AddressObject[] = street[targetAddressesKey] as AddressObject[];
      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == addressIndex) {
          address.isVisited = !address.isVisited;
          
          let wasAddressUnchecked = !address.isVisited;
          if (wasAddressUnchecked) {
            // if address was unchecked then also try to uncheck the whole street
            street.isVisited = false;
          } else {
            // check if all addresses of the street are visited and if so make it also visited
            let areAddressesVisited = street.addresses.every((address) => {
              return address.value == "" || address.isVisited;
            })
            let areDefaultAddressesVisited = street.defaultAddresses.every((address) => {
              return address.value == "" || address.isVisited;
            })
            let areAllAdressesVisited = areAddressesVisited && areDefaultAddressesVisited;
            street.isVisited = areAllAdressesVisited;
          }
          break;
        }
      }
      return street;
    });
    setStreets(nextStreets);
  }
  function handleInputFocus (streetIndex: number, addressIndex: number, event: React.ChangeEvent<HTMLInputElement>) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != streetIndex) {
        return street;
      }
      let targetAddressesKey = (appMode == 'default streets' ? 'defaultAddresses' : 'addresses') as keyof typeof street
      let targetAddresses: AddressObject[] = street[targetAddressesKey] as AddressObject[];
      let targetLastAddressIndexKey = (appMode == 'default streets' ? 'lastDefaultAddressIndex' : 'lastAddressIndex') as keyof typeof street
      let targetLastAddressIndex: number = street[targetLastAddressIndexKey] as number;

      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == addressIndex && targetAddresses[targetAddresses.length - 1].index == address.index) {
          let newAddresses = targetAddresses.slice();
          newAddresses.push({value: '', index: targetLastAddressIndex, isVisited: false, isCanceled: false})
          return {
            ...street,
            [targetAddressesKey]: newAddresses,
            [targetLastAddressIndexKey]: targetLastAddressIndex + 1
          };
        }
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


      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == addressIndex) {
          let newAddresses = targetAddresses.slice();
          let shouldIncrementIndex = false;
          if (value == '' && newAddresses.length != 1) {
            newAddresses = newAddresses.filter((address) => {
              return address.index != addressIndex;
            })
          }
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

  const streetsList = streets.filter((street) => {
    if (appMode == 'addresses' || appMode == 'checklist' || appMode == 'add canceled') {
      return street.isEnabled;
    } else {
      return true;
    }
  }).map(street => {
    let listItemClasses = classNames(
      'list_item',
      {
        'grey_bg': street.index % 2 == 0,
        'marked': street.isVisited && (appMode == 'checklist' || appMode == 'add canceled')
      }
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
    let addressesList = addressesType.filter((address) => {
      if (appMode == 'checklist' || appMode == 'add canceled') {
        return address.value != '';
      } else {
        return true;
      }
    }).map(address => {
      if (appMode == 'addresses' || appMode == 'default streets') {
        return (
        <div className="address_container" key={address.index}>
          <input
            type="text" 
            className={streetAddressClasses}
            value={address.value} 
            onChange={(event) => handleInputChange(street.index, address.index, event)}
            onFocus={(event) => handleInputFocus(street.index, address.index, event)}
            onBlur={(event) => handleInputBlur(street.index, address.index, event)}
          />
        </div>
        )
      } else if (appMode == 'checklist' || appMode == 'add canceled') {
        let addressDisplayClasses = classNames(
          'address',
          {'marked': address.isVisited}
        )
        return (
          <div className="address_container" key={address.index}>
            <div className={addressDisplayClasses} onClick={() => handleAddressClick(street.index, false, address.index)}>{address.value}</div>
          </div>
        )
      }
    });
    let defaultAddressesList = appMode == 'addresses' || appMode == 'checklist' || appMode == 'add canceled' ? street.defaultAddresses.filter((address) => {
      return address.value != '';
    }).map(address => {
      let addressDisplayClasses = classNames(
        'address',
        'default',
        {'marked': address.isVisited}
      )
      return (
        <div className="address_container" key={address.index}>
          <div className={addressDisplayClasses} onClick={() => handleAddressClick(street.index, true, address.index)}>{address.value}</div>
        </div>
      )
    }) : null;

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
            onClick={() => handleStreetClick(street.index)}
          >
            { street.name }  
          </div>
          { defaultAddressesList }
          { addressesList }
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
          <div id="mode_buttons">
            <div className="button_wrapper">
              <div className="button_container">
              <button onClick={() => changeAppMode('add canceled')} className={"canceled_button " + (appMode == 'add canceled' ? "active" : "")}>
                  <FontAwesomeIcon icon={faPlus} id="plus_icon"/>
                  <FontAwesomeIcon icon={faExclamation} />
                </button>
              </div>
              <div className="button_desc">
                Режим позначенння скасованих адрес
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
