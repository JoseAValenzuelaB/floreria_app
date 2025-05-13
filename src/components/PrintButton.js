import React from "react";
import PropTypes from "prop-types";

const PrintButton = (props) => {
  const handlePrint = () => {
    if (props.ticket) {
      window.electronAPI.printTicket(props.orderDetail);
    } else {
      window.electronAPI.printHTML(props.orderDetail);
    }
  };

  return <button onClick={handlePrint}>{props.label}</button>;
};

PrintButton.propTypes = {
  orderDetail: PropTypes.object,
  label: PropTypes.string,
  ticket: PropTypes.bool,
};

export default PrintButton;
