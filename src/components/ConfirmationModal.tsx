import classNames from 'classnames';

export default function ConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirmed
}: {
  isOpen: boolean;
  onOpenChange: Function;
  onConfirmed: Function;
}) {
  let modalOverlayClasses = classNames('modal_overlay', {
    open: isOpen,
  });
  let modalWrapperClasses = classNames('modal_wrapper', {
    open: isOpen,
  });
  let modalContentClasses = classNames('modal_content', {
    open: isOpen,
  });

  return (
    <>
      <div
        className={modalOverlayClasses}
        onClick={() => onOpenChange()}
      ></div>
      <div className={modalWrapperClasses}>
        <div className={modalContentClasses} id="confirmation">
          <div className="header">
            Справді скинути дані?
          </div>
          <div className="buttons">
            <div className="accept" onClick={() => onConfirmed()}>Так</div>
            <div className="decline" onClick={() => onOpenChange()}>Ні</div>
          </div>
        </div>
      </div>
    </>
  );
}