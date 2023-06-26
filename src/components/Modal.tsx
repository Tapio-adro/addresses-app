import classNames from 'classnames';

export default function Modal({isOpen, onOpenChange}: {isOpen: boolean, onOpenChange: Function}) {
  
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

        </div>
        <div className="bottom">
          <div className="accept">
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