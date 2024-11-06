import React, { useState } from "react";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleOpen} style={{ marginBottom: "8px" }}>
        {isOpen ? "ClickMeHide" : "ClickMeShow"} {title}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Collapsible;
