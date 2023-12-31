import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { initialStreets, initialStreetIndex } from './assets/data/StreetsData.tsx';
import Modal from './components/Modal.tsx';
import ConfirmationModal from './components/ConfirmationModal.tsx';
import CanceledAddressesList from './components/CanceledAddressesList.tsx';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './assets/css/style.css'
import { canceledAddressesData } from './assets/data/ReasonsData.tsx';
import useLongPress from './assets/shared/useLongPress.js'
import getString from './assets/shared/UILang.js'

import { StreetObject, AddressObject, StreetAndNumber, AppMode, ReasonWithAddressesObject } from './assets/shared/lib/types'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowsUpDown, faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import React from 'react';

function getDefaultCancelationAddress(): StreetAndNumber {
  return JSON.parse(JSON.stringify(
    {street: '', number: '', streetIndex: -1, numberIndex: -1, isDefaultAddress: false}
  ))
}
function getEmptyAddress (index) {
  return JSON.parse(JSON.stringify(
    {value: '', index: index, isVisited: false, isCanceled: false}
  ))
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [appMode, setAppMode] = useState<AppMode>('checklist')
  const [nextAppMode, setNextAppMode] = useState<string>('')
  const [streets, setStreets] = useState<StreetObject[]>(initialStreets)
  const [currentStreetIndex, setCurrentStreetIndex] = useState<number>(initialStreetIndex)
  const [streetInputValue, setStreetInputValue] = useState<string>('')
  const [streetToReorderIndex, setStreetToReorderIndex] = useState<number | null>(null)
  const [streetToReorderIndexinArray, setStreetToReorderIndexInArray] = useState<number | null>(null)
  const [isAddCanceledModalOpen, setIsAddCanceledModalOpen] = useState<boolean>(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false)
  const [currentCancelationAddress, setCurrentCancelationAddress] = useState<StreetAndNumber>(getDefaultCancelationAddress())
  const [reasonsData, setReasonsData] = useState<ReasonWithAddressesObject[]>(canceledAddressesData);
  const [canceledAmount, setCanceledAmount] = useState<number>(0);
  const [streetsListElement, enableStreetsListAnimations] = useAutoAnimate()
  const [areAnimationsEnabled, setAreAnimationsEnabled] = useState(true)
  const mainElement = useRef<HTMLDivElement>(null);
  const shouldResetData = isTodayAnotherDay();
  const longResetPress = useLongPress(tryResetData, () => {}, {shouldPreventDefault: true, delay: 1000});

  useEffect(() => {
    const localIsSidebarOpen = window.localStorage.getItem('isSidebarOpen')
    if (localIsSidebarOpen !== null) {
      setIsSidebarOpen(JSON.parse(localIsSidebarOpen))
    }
    const localAppMode = window.localStorage.getItem('appMode')
    if (localAppMode !== null) {
      changeAppMode(JSON.parse(localAppMode))
    }
    if (shouldResetData) {
      resetData();
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('appMode', JSON.stringify(appMode))
  }, [appMode])
  useEffect(() => {
    window.localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen))
  }, [isSidebarOpen])
  useEffect(() => {
    window.localStorage.setItem('streetsData', JSON.stringify(streets))
  }, [streets])
  useEffect(() => {
    window.localStorage.setItem('currentStreetIndex', JSON.stringify(currentStreetIndex))
  }, [currentStreetIndex])
  useEffect(() => {
    recalculateCanceledAmount();
    window.localStorage.setItem('canceledAddressesData', JSON.stringify(reasonsData))
  }, [reasonsData])
  useEffect(() => {
    if (nextAppMode == '') return;
    enableStreetsListAnimations(areAnimationsEnabled)
    handleReorderingReset()
    setAppMode(nextAppMode as AppMode)
    if (isSidebarOpen) {
      setIsSidebarOpen(false)
    }
  }, [areAnimationsEnabled])

  function recalculateCanceledAmount() {
    let newCanceledAmount = 0;
    reasonsData.forEach(reason => {
      newCanceledAmount += reason.addresses.length;
    });
    setCanceledAmount(newCanceledAmount);
  }
  function handleCaptionClick (name: string) {
    const newReasonsData = reasonsData.map((reason) => {
      if (reason.name == name) {
        return {
          ...reason,
          isOpen: !reason.isOpen
        }
      }
      return reason;
    });
    setReasonsData(newReasonsData);
  }

  function changeAppMode (mode: AppMode) {
    setNextAppMode(mode)
    if (areAnimationsEnabled == (mode != 'view canceled')) {
      handleReorderingReset()
      setAppMode(mode)
      if (isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    } else {
      if (appMode == 'view canceled') {
        enableStreetsListAnimations(areAnimationsEnabled)
        handleReorderingReset()
        setAppMode(mode)
        if (isSidebarOpen) {
          setIsSidebarOpen(false)
        }
      } else {
        setAreAnimationsEnabled(mode != 'view canceled')
      }
    }
  }

  function handleStreetClick(streetIndex: number) {
    if (streetToReorderIndex !== null) return;
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
        // and if it is unmarked visited all its addresses also should be marked accordingly
        let newAddresses = street.addresses.map((address) => {
          let shouldChangeVisitedStatus = address.value != '' && !address.isCanceled;
          return {
            ...address,
            isVisited: shouldChangeVisitedStatus ? !isStreetVisited : false
          }
        });
        let newDefaultAddresses = street.defaultAddresses.map((address) => {
          let shouldChangeVisitedStatus = address.value != '' && !address.isCanceled;
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
  function handleAddressClick (streetIndex: number, isDefaultAddress: boolean, addressIndex: number) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != streetIndex || (appMode != 'checklist' && appMode != 'add canceled')) {
        return street;
      }
      let targetAddressesKey = isDefaultAddress ? 'defaultAddresses' : 'addresses'  as keyof typeof street
      let targetAddresses: AddressObject[] = street[targetAddressesKey] as AddressObject[];
      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == addressIndex && !address.isCanceled) {
          if (appMode == 'checklist') {
            address.isVisited = !address.isVisited;
          
            let wasAddressUnchecked = !address.isVisited;
            if (wasAddressUnchecked) {
              // if address was unchecked then also uncheck the whole street
              street.isVisited = false;
            } else {
              checkStreetState(streetIndex, isDefaultAddress, addressIndex);
            }
            break;          
          } else if (appMode == 'add canceled' && !address.isVisited) {
            setCurrentCancelationAddress({
              street: street.name,
              number: address.value,
              streetIndex: streetIndex,
              numberIndex: addressIndex,
              isDefaultAddress: isDefaultAddress
            });
            setIsAddCanceledModalOpen(!isAddCanceledModalOpen)
            break;          
          }

        }
      }
      return street;
    });
    setStreets(nextStreets);
  }
  function handleInputFocus (streetIndex: number, addressIndex: number) {
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
          newAddresses.push(getEmptyAddress(targetLastAddressIndex))
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
  function cancelCurrentAddress (reasonName: string) {
    let streetIndex = currentCancelationAddress.streetIndex;
    let addressIndex = currentCancelationAddress.numberIndex;
    let isDefaultAddress = currentCancelationAddress.isDefaultAddress;
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != streetIndex || (appMode != 'checklist' && appMode != 'add canceled')) {
        return street;
      }
      let targetAddressesKey = isDefaultAddress ? 'defaultAddresses' : 'addresses'  as keyof typeof street
      let targetAddresses: AddressObject[] = street[targetAddressesKey] as AddressObject[];
      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == addressIndex) {
          address.isCanceled = true;
        }
      }
      return street;
    });
    setStreets(nextStreets);
    checkStreetState(streetIndex, isDefaultAddress, addressIndex);

    const newReasonsData = reasonsData.map((reason) => {
      if (reason.name == reasonName) {
        let newAddresses = reason.addresses
        newAddresses.push(currentCancelationAddress);
        return {
          ...reason,
          addresses: newAddresses
        }
      }
      return reason;
    });
    setReasonsData(newReasonsData);
    
    // recalculateCanceledAmount();
  }
  function uncancelAddress (targetReason: ReasonWithAddressesObject, targetStreetAndNumber: StreetAndNumber) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != targetStreetAndNumber.streetIndex) {
        return street;
      }
      let targetAddressesKey = targetStreetAndNumber.isDefaultAddress ? 'defaultAddresses' : 'addresses'  as keyof typeof street
      let targetAddresses: AddressObject[] = street[targetAddressesKey] as AddressObject[];
      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == targetStreetAndNumber.numberIndex) {
          address.isCanceled = false;
          checkStreetState(targetStreetAndNumber.streetIndex, targetStreetAndNumber.isDefaultAddress, targetStreetAndNumber.numberIndex);
        }
      }
      return street;
    });
    setStreets(nextStreets);

    const newReasonsData = reasonsData.map((reason) => {
      if (reason.name == targetReason.name) {
        const newAddresses = reason.addresses.filter((streetAndNumber) => {
          return (
            targetStreetAndNumber.isDefaultAddress != streetAndNumber.isDefaultAddress ||
            targetStreetAndNumber.street != streetAndNumber.street ||
            targetStreetAndNumber.number != streetAndNumber.number
          );
        })
        return {
          ...reason,
          addresses: newAddresses
        }
      }
      return reason;
    });
    setReasonsData(newReasonsData);
  }
  function checkStreetState (streetIndex: number, isDefaultAddress: boolean, addressIndex: number) {
    const nextStreets: StreetObject[] = streets.map(street => {
      if (street.index != streetIndex) {
        return street;
      }
      let targetAddressesKey = isDefaultAddress ? 'defaultAddresses' : 'addresses'  as keyof typeof street
      let targetAddresses: AddressObject[] = street[targetAddressesKey] as AddressObject[];
      for (let key in targetAddresses) {
        let address = targetAddresses[key];
        if (address.index == addressIndex) {
          // first check whether addresses are visited
          let areAddressesVisited = street.addresses.every((address) => {
            return address.value == "" || address.isVisited;
          })
          let areDefaultAddressesVisited = street.defaultAddresses.every((address) => {
            return address.value == "" || address.isVisited;
          })
          let areAllAddressesVisited = areAddressesVisited && areDefaultAddressesVisited;
          // then whether they are canceled
          let areAddressesCanceled = street.addresses.every((address) => {
            return address.value == "" || address.isCanceled;
          })
          let areDefaultAddressesCanceled = street.defaultAddresses.every((address) => {
            return address.value == "" || address.isCanceled;
          })
          let areAllAddressesCanceled = areAddressesCanceled && areDefaultAddressesCanceled;
          // also check if every address is or visited or canceled
          let areAddressesCanceledOrVisited = street.addresses.every((address) => {
            return address.value == "" || address.isCanceled || address.isVisited;
          })
          let areDefaultAddressesCanceledOrVisited = street.defaultAddresses.every((address) => {
            return address.value == "" || address.isCanceled || address.isVisited;
          })
          let areAllAddressesCanceledOrVisited = areAddressesCanceledOrVisited && areDefaultAddressesCanceledOrVisited;
          if (areAllAddressesCanceled) {
            street.isVisited = false;
            street.isCanceled = true;
          } else if (areAllAddressesVisited || areAllAddressesCanceledOrVisited) {
            street.isVisited = true;
            street.isCanceled = false;
          } else {
            street.isVisited = false;
            street.isCanceled = false;          
          }
          break;
        }
      }
      return street;
    });
    setStreets(nextStreets);

  }

  function handleReorderingArrowClick (index: number) {
    if (streetToReorderIndex === null) {
      let arrayIndex = -1;
      for (let [indexInArray, street] of streets.entries()) {
        if (street.index == index) {
          arrayIndex = indexInArray;
          break;
        }
      }
      setStreetToReorderIndex(index)
      setStreetToReorderIndexInArray(arrayIndex)
    } else {
      const nextStreets = [...streets];
      let arrayIndex = -1;
      for (let [indexInArray, street] of nextStreets.entries()) {
        if (street.index == streetToReorderIndex) {
          arrayIndex = indexInArray;
          break;
        }
      }
      let movedStreet: StreetObject = nextStreets.splice(arrayIndex, 1)[0]
      for (let [indexInArray, street] of nextStreets.entries()) {
        if (street.index == index) {
          arrayIndex = indexInArray;
          break;
        }
      }
      nextStreets.splice(arrayIndex + 1, 0, movedStreet);
      setStreets(nextStreets); 
      setStreetToReorderIndex(null)
      setStreetToReorderIndexInArray(null)
    }
  }
  function handleReorderingReset () {
    setStreetToReorderIndex(null)
    setStreetToReorderIndexInArray(null)
  }
  function handleStreetRemove (index: number) {
    let streetToRemoveIndex = streets.findIndex(street => {
      return street.index === index
    })
    const nextStreets = [...streets];
    nextStreets.splice(streetToRemoveIndex, 1);
    setStreets(nextStreets);
  }
  function handleStreetAdded () {
    const nextStreets = [...streets];
    let newStreet: StreetObject = {
      name: streetInputValue,
      index: currentStreetIndex,
      isVisited: false,
      isCanceled: false,
      isEnabled: true,
      isEnabledByDefault: false,
      lastAddressIndex: 1,
      lastDefaultAddressIndex: 1,
      addresses: [{ value: '', index: 0, isVisited: false, isCanceled: false }],
      defaultAddresses: [
        { value: '', index: 0, isVisited: false, isCanceled: false },
      ],
      isBeingReordered: false
    };
    setCurrentStreetIndex(currentStreetIndex + 1)
    setStreetInputValue('');
    nextStreets.push(newStreet);
    setStreets(nextStreets);
    document.getElementById('street_input')?.focus();
    setTimeout(() => {
      if (mainElement.current !== null) {
        mainElement.current.scrollTo({left: 0, top: mainElement.current.scrollHeight, behavior: "smooth"})
      }
    }, 500)
  }

  function tryResetData () {
    setIsConfirmationModalOpen(true)
    setIsSidebarOpen(false);
  }
  function resetData () {
    setIsConfirmationModalOpen(false)
    const nextStreets: StreetObject[] = streets.map(street => {

      const newAddresses = street.addresses.filter((address) => {
        return address.value == '';
      })
      const newDefaultAddresses = street.addresses.map((address) => {
        return {
          ...address,
          isVisited: false,
          isCanceled: false,
        }
      })
      return {
        ...street,
        addresses: newAddresses,
        defaultAddresses: newDefaultAddresses,
        isCanceled: false,
        isVisited: false,
        isEnabled: street.isEnabledByDefault
      };
    });
    setStreets(nextStreets);
    const newReasonsData = reasonsData.map((reason) => {
      return {
        ...reason,
        addresses: []
      }
    });
    setReasonsData(newReasonsData);
  }

  const streetsList = appMode != 'view canceled' ? streets.filter((street) => {
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
        'visited': street.isVisited && (appMode == 'checklist' || appMode == 'add canceled'),
        'canceled': street.isCanceled && (appMode == 'checklist' || appMode == 'add canceled'),
        'is_reordered': street.index == streetToReorderIndex
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
            onFocus={() => handleInputFocus(street.index, address.index)}
            onBlur={(event) => handleInputBlur(street.index, address.index, event)}
          />
        </div>
        )
      } else if (appMode == 'checklist' || appMode == 'add canceled') {
        let addressDisplayClasses = classNames(
          'address',
          {
            'visited': address.isVisited,
            'canceled': address.isCanceled
          }
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
        {
          'visited': address.isVisited,
          'canceled': address.isCanceled
        }
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
          <ReorderingArrow
            streetToReorderIndex={streetToReorderIndex}
            streetToReorderIndexinArray={streetToReorderIndexinArray}
            street={street}
            streets={streets}
            appMode={appMode}
            onReorderingArrowClick={handleReorderingArrowClick}
            onReorderingReset={handleReorderingReset}
          />
          <RemovingCross
            street={street}
            appMode={appMode}
            onStreetRemove={handleStreetRemove}
          ></RemovingCross>
          { defaultAddressesList }
          { addressesList }
        </div>
      </div>
    )
  }) : null;

  return (
    <>
      <Modal
        isOpen={isAddCanceledModalOpen}
        currentAddress={currentCancelationAddress}
        onOpenChange={() => setIsAddCanceledModalOpen(!isAddCanceledModalOpen)}
        onAddressCanceled={(reason: string) => cancelCurrentAddress(reason)}
      ></Modal>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onOpenChange={() => setIsConfirmationModalOpen(!isConfirmationModalOpen)}
        onConfirmed={() => resetData()}
      ></ConfirmationModal>
      <div 
        id="dark_background" 
        className={isSidebarOpen ? "shown" : ""}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <main ref={mainElement}>
        <CanceledAddressesList
          appMode={appMode}
          canceledAmount={canceledAmount}
          reasonsData={reasonsData}
          onCaptionClicked={(name: string) => handleCaptionClick(name)}
          onAddressUncanceled={(targetReason: ReasonWithAddressesObject, targetStreetAndNumber: StreetAndNumber) => uncancelAddress(targetReason, targetStreetAndNumber)}
        ></CanceledAddressesList>
        <div id="list"
          className={appMode == "default streets" || appMode == "streets" ? "any_streets_mode" : ""}
          ref={streetsListElement}
        >
          {streetsList}
          <StreetInput
            streetInputValue={streetInputValue}
            appMode={appMode}
            onStreetInputChange={setStreetInputValue}
            onStreetAdded={handleStreetAdded}
          ></StreetInput>
        </div>
      </main>
      <div
        id="sidebar"
        className={isSidebarOpen ? "open" : ""}
      >
        <div id="mode_buttons">
          <div className="button_wrapper">
            <div className="button_container">
              <button onClick={() => changeAppMode('view canceled')} className={"canceled_button view_canceled " + (appMode == 'view canceled' ? "active" : "")}>
                <FontAwesomeIcon icon={faExclamation} />
                <FontAwesomeIcon icon={faExclamation} />
                <FontAwesomeIcon icon={faExclamation} />
              </button>
            </div>
            <div className="button_desc">
              {getString('viewCanceledMode')}
            </div>
          </div>
          <div className="button_wrapper">
            <div className="button_container">
              <button onClick={() => changeAppMode('add canceled')} className={"canceled_button " + (appMode == 'add canceled' ? "active" : "")}>
                <FontAwesomeIcon icon={faPlus} id="plus_icon"/>
                <FontAwesomeIcon icon={faExclamation} />
              </button>
            </div>
            <div className="button_desc">
              {getString('addCanceledMode')}
            </div>
          </div>
          <div className="button_wrapper">
            <div className="button_container">
              <button onClick={() => changeAppMode('checklist')} className={appMode == 'checklist' ? "active" : ""}>
                <FontAwesomeIcon icon={faSquareCheck} />
              </button>
            </div>
            <div className="button_desc">
              {getString('checklistMode')}
            </div>
          </div>
          <div className="button_wrapper">
            <div className="button_container">
              <button onClick={() => changeAppMode('addresses')} className={appMode == 'addresses' ? "active" : ""}>
                <FontAwesomeIcon icon={faLocationDot} />
              </button>
            </div>
            <div className="button_desc">
              {getString('addressesMode')}
            </div>
          </div>
          <div className="button_wrapper">
            <div className="button_container">
              <button onClick={() => changeAppMode('streets')} className={appMode == 'streets' ? "active" : ""}>
                <FontAwesomeIcon icon={faPen} />
              </button>
            </div>
            <div className="button_desc">
              {getString('streetsMode')}
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
              {getString('defaultStreetsMode')}
            </div>
          </div>
          <div className="button_wrapper">
            <div className="button_container" id="reset_button_container">
              <button {...longResetPress}>
                <FontAwesomeIcon icon={faRotateRight} />
              </button>
            </div>
            <div className="button_desc" id="reset_button_desc">
              {getString('resetAll')}
            </div>
          </div>
        </div>
        <button
          id="toggle_sidebar_button"
          className={isSidebarOpen ? "open" : ""}
          onClick={() => {setIsSidebarOpen(!isSidebarOpen); handleReorderingReset()}}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
      </div>
    </>
  )
}

function ReorderingArrow({
  streetToReorderIndex,
  streetToReorderIndexinArray,
  street,
  streets,
  appMode,
  onReorderingArrowClick,
  onReorderingReset,
}: {
  streetToReorderIndex: number | null;
  streetToReorderIndexinArray: number | null;
  street: StreetObject;
  streets: StreetObject[];
  appMode: AppMode;
  onReorderingArrowClick: Function;
  onReorderingReset: Function;
}) {
  if (streetToReorderIndex === null || streetToReorderIndexinArray === null) {
    return appMode == 'streets' ? (
      <div
        className="reordering_arrow"
        onClick={() => onReorderingArrowClick(street.index)}
      >
        <FontAwesomeIcon icon={faArrowsUpDown} />
      </div>
    ) : null;
  } else {
    if (street.index == streetToReorderIndex) {
      return (
        <div
          className="reordering_arrow cross"
          onClick={() => onReorderingReset()}
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
      );
    } else {
      let arrowClasses = classNames('reordering_arrow', 'green', {
        'hidden': !(
          (streetToReorderIndexinArray == 0 ||
            street.index != streets[streetToReorderIndexinArray - 1].index)
        ),
      });
      return appMode == 'streets' ? (
        <div
          className={arrowClasses}
          onClick={() => onReorderingArrowClick(street.index)}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </div>
      ) : null;
    }
  }
};
function RemovingCross ({
  street,
  appMode,
  onStreetRemove
}: {
  street: StreetObject;
  appMode: AppMode;
  onStreetRemove: Function;
}) {
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const onLongPress = () => {
    onStreetRemove(street.index)
  };
  const onClick = () => {
  }
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
  let crossClasses = classNames(
    'removing_cross',
    {
      'hidden': street.isEnabledByDefault
    }
  );
  return appMode == 'streets' ? (
    <button
      {...longPressEvent}
      className={crossClasses}
      // onClick={() => onStreetRemove(street.index)}
    >
      <FontAwesomeIcon icon={faXmark} />
    </button>
  ) : null;
}
function StreetInput ({
  // street,
  appMode,
  streetInputValue,
  onStreetInputChange,
  onStreetAdded,
}: {
  // street: StreetObject;
  appMode: AppMode;
  streetInputValue: string;
  onStreetInputChange: Function;
  onStreetAdded: Function;
}) {
  const [isCheckmarkShown, setIsCheckmarkShown] = useState<boolean>(false)

  let checkmarkClasses = classNames(
    {
      'hidden': !isCheckmarkShown && streetInputValue == '',
      'grey': streetInputValue == ''
    }
  );

  return appMode == 'streets' ? (
    <div id="street_input_wrapper">
      <div id="street_input_indicator"></div>
      <input
        id="street_input"
        value={streetInputValue}
        onChange={(e) => onStreetInputChange(e.target.value)}
        onBlur={() => setIsCheckmarkShown(false)}
        onFocus={() => setIsCheckmarkShown(true)}
        type="text"
        placeholder="Назва вулиці"
      />
      <div id="street_input_checkmark" className={checkmarkClasses} onClick={() => onStreetAdded()}>
        <FontAwesomeIcon icon={faCheck} />
      </div>
    </div>
  ) : null;
}

function isTodayAnotherDay () {
  let lastDateData = window.localStorage.getItem('lastDate');
  if (lastDateData === null) return false;
  let now = new Date();
  let lastDate = JSON.parse(lastDateData);
  window.localStorage.setItem('lastDate', JSON.stringify(new Date()))
  return now.getDate() !== lastDate.getDate();
}

export default App
