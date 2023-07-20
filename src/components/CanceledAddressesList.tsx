import classNames from 'classnames';
import { ReasonWithAddressesObject, AppMode } from '../assets/shared/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import getString from '../assets/shared/UILang.js'

export default function CanceledAddressesList({
  appMode,
  canceledAmount,
  reasonsData,
  onCaptionClicked,
  onAddressUncanceled,
}: {
  appMode: AppMode;
  canceledAmount: number;
  reasonsData: ReasonWithAddressesObject[];
  onCaptionClicked: Function;
  onAddressUncanceled: Function;
}) {

  const reasonsList = appMode == 'view canceled' ? reasonsData.filter((reason) => {
    return reason.addresses.length;
  }).map((reason) => {
    let captionClasses = classNames(
      'caption',
      {
        'open': reason.isOpen
      }
    )
    let addressesClasses = classNames(
      'addresses',
      {
        'open': reason.isOpen
      }
    )

    const addressesList = reason.addresses.map((address) => {
      return (
        <div className="address" key={address.street + address.number}>
          <div className="address_name">{address.street + ' ' + address.number}</div>
          <div className="address_remove" onClick={() => onAddressUncanceled(reason, address)}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      )
    }); 

    return (
      <section key={reason.name}>
        <div className={captionClasses} onClick={() => onCaptionClicked(reason.name)}> 
          <div className="amount">{reason.addresses.length}</div>
          <div className="text">{reason.name}</div>
          <div className="chevron">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        <div className={addressesClasses}>
          {addressesList}
        </div>

      </section>
    )
  }) : null;

  let headerClasses = classNames(
    'reasons_header',
    {
      'hidden': appMode != 'view canceled'
    }
  )

  return appMode == 'view canceled' ? (
    <>
      <div className="reasons_wrapper">
        <div className={headerClasses}>
          <div className="addresses_amount">{canceledAmount}</div>
          <div className="header_text">
            {getString('canceledAddresses')}
          </div>
        </div>
        <div className="reasons_container">
          {reasonsList}
        </div>
      </div>
    </>
  ) : null;
}