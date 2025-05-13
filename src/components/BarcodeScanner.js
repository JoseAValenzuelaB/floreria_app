import React, { Component } from 'react';

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scannedBarcode: '',
      timeoutId: null,
      barcodeLength: 1, // Expected barcode length, adjust based on your needs
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.processBarcode = this.processBarcode.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(e) {
    console.log("Key Pressed:", e.key);

    // If the Enter key is pressed, process the barcode
    if (e.key === 'Enter') {
      this.processBarcode(this.state.scannedBarcode);
      this.setState({ scannedBarcode: '' }); // Clear after processing
      return;
    }

    // Check if the pressed key is a valid character (alphanumeric or allowed symbols)
    if (e.key.length === 1 && /[0-9a-zA-Z-_]/.test(e.key)) {
      this.setState((prevState) => ({
        scannedBarcode: prevState.scannedBarcode + e.key,
      }));
    } else {
      console.log("Ignoring special key:", e.key);
    }
  }

  processBarcode(barcode) {
    // Check if the barcode has a valid length
    if (barcode.length >= this.state.barcodeLength) { // Adjust logic if needed
      // Notify parent component via callback function
      this.props.onBarcodeScanned(barcode);
    } else {
      console.log('Barcode is too short.');
    }
  }

  render() {
    return null; // No UI needed for this component
  }
}

export default BarcodeScanner;
