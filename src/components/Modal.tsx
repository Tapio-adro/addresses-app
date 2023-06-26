import classNames from 'classnames';

export default function Modal({isOpen, onOpenChange}: {isOpen: boolean, onOpenChange: Function}) {
  
  let modalOverlayClasses = classNames(
    'modal_overlay',
    {
      'open': isOpen
    }
  )
  return (
    <div className={modalOverlayClasses} onClick={() => onOpenChange()}>
      <div className="modal_content">
        <div className="top">
          street 9b
        </div>
        <div className="middle">

        </div>
        <div className="bottom">
          <div className="accept">
            Позначити
          </div>
          <div className="cancel">
            Скасувати
          </div>
        </div>
      </div>
    </div>
  )
}