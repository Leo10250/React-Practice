import { useCallback, useEffect, useRef, useState } from "react";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalCloseButtonRef = useRef(null);
  const modalButtonRef = useRef(null);

  const handleEsc = useCallback((e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  const handleBackDrop = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      modalButtonRef.current.focus();
      return;
    }
    modalCloseButtonRef.current.focus();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} ref={modalButtonRef}>
        Open Modal
      </button>
      {isOpen && (
        <div
          role="dialog"
          onMouseDown={handleBackDrop}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            inset: 0,
            zIndex: 99999,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              minWidth: "200px",
              minHeight: "200px",
              border: "1px solid black",
              boxShadow: "5px 5px 5px grey",
              backgroundColor: "white",
            }}
          >
            <div>sdfjlkasdjf</div>
            <button
              ref={modalCloseButtonRef}
              onClick={() => setIsOpen(false)}
              style={{ position: "absolute", top: "8px", right: "8px" }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
