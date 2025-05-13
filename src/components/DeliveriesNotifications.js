// src/components/DeliveryNotification.js
import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class DeliveryNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      websocket: null,
      reconnecting: false, // To track if we are in the process of reconnecting
    };
  }

  // Function to create a new WebSocket connection
  createWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onmessage = (event) => {
      toast.info(event.data);
    };

    socket.onopen = () => {
      // toast.success("WebSocket connection established");
      this.setState({ reconnecting: false }); // Reset reconnecting flag after successful connection
    };

    socket.onerror = (error) => {
      // toast.error("WebSocket error: " + error.message);
      this.handleReconnect(); // Try to reconnect after an error
    };

    socket.onclose = (event) => {
      if (!event.wasClean) {
        // toast.info("WebSocket connection closed, attempting to reconnect...");
        this.handleReconnect(); // Try to reconnect if the connection was closed unexpectedly
      }
    };

    this.setState({ websocket: socket });
  };

  // Handle reconnect logic with a delay
  handleReconnect = () => {
    if (!this.state.reconnecting) {
      this.setState({ reconnecting: true });
      setTimeout(() => {
        this.createWebSocket(); // Try to create a new WebSocket connection after 3 seconds
      }, 3000);
    }
  };

  componentDidMount() {
    this.createWebSocket(); // Establish the WebSocket connection when the component mounts
  }

  componentWillUnmount() {
    if (this.state.websocket) {
      this.state.websocket.close(); // Close WebSocket connection when the component unmounts
    }
  }

  render() {
    return (
      <div>
        <ToastContainer
          position="top-center"
          autoClose={20000}
          style={{ width: "400px", minHeight: "80px", fontSize: "18px" }}
        />
      </div>
    );
  }
}

export default DeliveryNotification;
