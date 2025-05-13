import React from "react";
import { ipcRenderer } from "electron";

const DeliveryInfoPrinter = () => {
  const deliveryInfo = {
    recipient_name: "John Doe",
    shipping_address: "123 Main St",
    city: "Springfield",
    state: "IL",
    contact_number: "555-1234",
    delivery_instructions: "Leave at front door.",
  };

  const handlePrintDeliveryInfo = () => {
    ipcRenderer.send("print-delivery-info", deliveryInfo);
  };

  return (
    <div>
      <h1>Delivery Information</h1>
      {/* Render delivery info here if needed */}
      <button onClick={handlePrintDeliveryInfo}>Print Delivery Info</button>
    </div>
  );
};

export default DeliveryInfoPrinter;
