import { useState } from 'react'
import classNames from 'classnames';
import { reasonsData } from '../assets/data/ReasonsData';
import { ReasonObject, StreetAndNumber } from '../assets/shared/lib/types';
import getString from '../assets/shared/UILang.js'

export default function Modal({
  isOpen,
  currentAddress,
  onOpenChange,
  onAddressCanceled,
}: {
  isOpen: boolean;
  currentAddress: StreetAndNumber;
  onOpenChange: Function;
  onAddressCanceled: Function;
}) {
  const [reasons, setReasons] = useState<ReasonObject[]>(reasonsData);
  const [currentReason, setCurrentReason] = useState<string>('');

  let modalOverlayClasses = classNames('modal_overlay', {
    open: isOpen,
  });
  let modalWrapperClasses = classNames('modal_wrapper', {
    open: isOpen,
  });
  let modalContentClasses = classNames('modal_content', {
    open: isOpen,
  });
  let acceptButtonClasses = classNames('accept', {
    inactive: currentReason == '',
  });

  function handleReasonClick(value: string) {
    const nextReasons: ReasonObject[] = reasons.map((reason) => {
      if (reason.value == value) {
        if (reason.isChecked) {
          setCurrentReason('');
          return {
            ...reason,
            isChecked: false,
          };
        }
        setCurrentReason(reason.value);
        return {
          ...reason,
          isChecked: true,
        };
      }
      return {
        ...reason,
        isChecked: false,
      };
    });
    setReasons(nextReasons);
  }

  function markAddressCanceled() {
    onAddressCanceled(currentReason);
    resetAndClose();
  }
  function resetAndClose() {
    const nextReasons: ReasonObject[] = reasons.map((reason) => {
      return {
        ...reason,
        isChecked: false,
      };
    });
    setReasons(nextReasons);
    setCurrentReason('');

    onOpenChange();
  }

  const reasonsList = reasons.map((reason) => {
    return (
      <div
        key={reason.value}
        className={reason.isChecked ? 'is_checked' : ''}
        onClick={() => handleReasonClick(reason.value)}
      >
        {reason.value}
      </div>
    );
  });

  return (
    <>
      <div
        className={modalOverlayClasses}
        onClick={() => resetAndClose()}
      ></div>
      <div className={modalWrapperClasses}>
        <div className={modalContentClasses}>
          <div className="top">{currentAddress.street + ' ' + currentAddress.number}</div>
          <div className="middle">{reasonsList}</div>
          <div className="bottom">
            <div className={acceptButtonClasses} onClick={() => markAddressCanceled()}>
              {getString('cancelYes')}
            </div>
            <div className="cancel" onClick={() => resetAndClose()}>
              {getString('cancelNo')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}