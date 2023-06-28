import { useState } from 'react'
import classNames from 'classnames';
import { canceledAddressesData } from '../assets/data/ReasonsData';
import { ReasonObject, StreetAndNumber, ReasonWithAddressesObject, AppMode } from '../assets/shared/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function CanceledAddressesList({
  appMode,
  // currentAddress,
  // onOpenChange,
  // onAddressCanceled,
}: {
  appMode: AppMode;
  // currentAddress: StreetAndNumber;
  // onOpenChange: Function;
  // onAddressCanceled: Function;
}) {
  const [reasonsData, setReasonsData] = useState<ReasonWithAddressesObject[]>(canceledAddressesData);

  function handleCaptionClick (name: string) {
    let newReasonsData = reasonsData.map((reason) => {
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

  let reasonsList = appMode == 'view canceled' ? reasonsData.map((reason) => {
    let captionClasses = classNames(
      'caption',
      {
        'open': reason.isOpen
      }
    )

    return (
      <section key={reason.name}>
        <div className={captionClasses} onClick={() => handleCaptionClick(reason.name)}> 
          <div className="amount">{reason.addresses.length}</div>
          <div className="text">{reason.name}</div>
          <div className="chevron">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        <div className="addresses"></div>

      </section>
    )
  }) : null;

  return (
    <>
      <div className="reasons_wrapper">
        <h1 className="reasons_header"></h1>
        <div className="reasons_container">
          {reasonsList}
        </div>
      </div>
    </>
  )
}