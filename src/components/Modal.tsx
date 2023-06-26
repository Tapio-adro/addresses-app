import { useState } from 'react'
import classNames from 'classnames';
import initialReasons from '../assets/data/ReasonsData';
import { ReasonObject } from '../assets/shared/lib/types';

export default function Modal({isOpen, onOpenChange}: {isOpen: boolean, onOpenChange: Function}) {
  const [reasons, setReasons] = useState<ReasonObject[]>(initialReasons)
  const [currentReason, setCurrentReason] = useState<string>('')
  
  let modalOverlayClasses = classNames(
    'modal_overlay',
    {
      'open': isOpen
    }
  )
  let modalWrapperClasses = classNames(
    'modal_wrapper',
    {
      'open': isOpen
    }
  )
  let modalContentClasses = classNames(
    'modal_content',
    {
      'open': isOpen
    }
  )
  let acceptButtonClasses = classNames(
    'accept',
    {
      'inactive': currentReason == ''
    }
  )

  function handleReasonClick (value: string) {
    const nextReasons: ReasonObject[] = reasons.map(reason => {

      if (reason.value == value) {
        if (reason.isChecked) {
          setCurrentReason('');
          return {
            ...reason,
            isChecked: false
          }
        }
        setCurrentReason(reason.value);
        return {
          ...reason,
          isChecked: true
        }
      }
      return {
        ...reason,
        isChecked: false
      }
    })
    setReasons(nextReasons);
  }

  const reasonsList = reasons.map((reason) => {
    return <div 
      className={reason.isChecked ? "is_checked" : ""}
      onClick={() => handleReasonClick(reason.value)}
    >{reason.value}</div>
  });

  return (
    <>
    <div className={modalOverlayClasses} onClick={() => onOpenChange()}>
    </div>
    <div className={modalWrapperClasses}>
      <div className={modalContentClasses}>
        <div className="top">
          street 9b
        </div>
        <div className="middle">
          {reasonsList}
        </div>
        <div className="bottom">
          <div className={acceptButtonClasses}>
            Позначити
          </div>
          <div className="cancel"
           onClick={() => onOpenChange()}
          >
            Скасувати
          </div>
        </div>
      </div>
    </div>
    </>
  )
}