const usb = require("usb");
const iconv = require("iconv-lite");
const sharp = require("sharp");

const PAYMENT_TYPE_DICT = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  OTHER: "Otro",
};

const DELAY_MS = 1000;

class USBPrinter {
  constructor(vendorId, productId) {
    this.vendorId = vendorId;
    this.productId = productId;
    this.device = null;
    this.endpointOut = null;
    this.isClosing = false;

    this.initializeDevice();
  }

  initializeDevice() {
    try {
      this.device = usb.findByIds(this.vendorId, this.productId);

      if (!this.device) {
        console.log("Device not found.");
        return;
      }

      this.device.open();

      // Detach kernel driver if necessary
      if (this.device.interfaces[0].isKernelDriverActive()) {
        this.device.interfaces[0].detachKernelDriver();
      }

      // Set the active configuration
      this.device.setConfiguration(1);
      const iface = this.device.interfaces[0];
      iface.claim();

      // Find the OUT endpoint
      this.endpointOut = iface.endpoints.find((ep) => ep.direction === "out");

      if (!this.endpointOut) {
        throw new Error("Endpoint OUT not found.");
      }

      console.log("Device initialized successfully.");
    } catch (error) {
      console.error(`Error during initialization: ${error.message}`);
    }
  }

  printData(data) {
    if (!this.endpointOut) {
      console.log("Endpoint OUT not initialized.");
      return;
    }

    try {
      const encodedData = iconv.encode(data, "latin1"); // You can also try 'utf8' or 'cp437'
      this.endpointOut.transfer(encodedData, (error) => {
        if (error) {
          throw error;
        }
        console.log("Data sent successfully.");
      });
    } catch (error) {
      console.error(`Error while sending data: ${error.message}`);
    }
  }

  setAlignment(alignment) {
    const ALIGNMENTS = {
      LEFT: 0,
      CENTER: 1,
      RIGHT: 2,
    };
    const command = Buffer.from([0x1b, 0x61, ALIGNMENTS[alignment]]);
    this.printData(command.toString("utf-8"));
  }

  printQRCode(url) {
    if (!this.endpointOut) {
      console.log("Endpoint OUT not initialized.");
      return;
    }

    try {
      // Beginning line feed
      this.sendCommand([0x0a]);

      // Start QR Code command
      this.sendCommand([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x03]);

      // Specify the QR code size (3 dots in this case)
      this.sendCommand([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x30]);

      // Error correction level: 48=L, 49=M, 50=Q, 51=H
      this.sendCommand([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x48]);

      // Store data in the symbol storage area
      const length = url.length + 3;
      this.sendCommand([
        0x1d,
        0x28,
        0x6b,
        length & 0xff,
        (length >> 8) & 0xff,
        0x31,
        0x50,
        0x30,
      ]);

      // Send the URL data
      const urlBuffer = Buffer.from(url, "ascii");
      this.sendCommand(urlBuffer);

      // Print the QR code symbol stored in the symbol storage area
      this.sendCommand([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30]);

      // Ending line feed
      this.sendCommand([0x0a]);

      console.log("QR Code printed successfully.");
    } catch (error) {
      console.error(`Error while printing QR Code: ${error.message}`);
    }
  }

  sendCommand(commandArray) {
    try {
      // Convert the command array to a buffer
      const commandBuffer = Buffer.from(commandArray);

      // Send the buffer directly to the printer
      this.endpointOut.transfer(commandBuffer, (error) => {
        if (error) {
          throw new Error(`Error while sending command: ${error.message}`);
        }
        console.log("Command sent successfully.");
      });
    } catch (error) {
      console.error(`Error in sendCommand: ${error.message}`);
    }
  }

  async generateHelloWorldImage() {
    const width = 384; // Width in pixels (fits a typical 80mm wide thermal printer)
    const height = 100; // Height in pixels

    // Create a blank white image
    const image = sharp({
      create: {
        width: width,
        height: height,
        channels: 1, // Use 1 channel for grayscale image
        background: "white",
      },
    });

    // Generate the image with "Hello World!" text
    const textImage = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
            .title { fill: black; font-size: 24px; font-family: Arial, sans-serif; }
        </style>
        <text x="10" y="40" class="title">Hello World!</text>
    </svg>`;

    // Generate the image buffer
    const buffer = await image
      .composite([{ input: Buffer.from(textImage), blend: "over" }])
      .toBuffer();

    return { buffer, width, height };
  }

  async printImage(imagePath) {
    try {
      // Load and convert image to grayscale
      const imageBuffer = await sharp(imagePath)
        .resize({ width: 384 }) // Resize to fit the printer width (e.g., 384 pixels for 80mm paper)
        .grayscale() // Convert to grayscale
        .raw() // Get raw image data
        .toBuffer();

      // Calculate width and height from image buffer
      const width = imageBuffer.length / Math.ceil(imageBuffer.length / 384);
      const height = Math.ceil(imageBuffer.length / width);
      console.log("WIDTH: ", width, "HEIGHT: ", height);
      // Prepare raster data
      const rasterData = this.prepareRasterData(imageBuffer, width, height);

      // Send the command to the printer
      this.sendCommand(rasterData);

      console.log("Image printed successfully.");
    } catch (error) {
      console.error(`Error while printing image: ${error.message}`);
    }
  }

  prepareRasterData(imageBuffer, width, height) {
    const m = 0; // Mode (Normal)
    const xL = width & 0xff;
    const xH = (width >> 8) & 0xff;
    const yL = height & 0xff;
    const yH = (height >> 8) & 0xff;

    // Ensure that the image data is in the correct format
    // Here we assume imageBuffer is in 1 bit-per-pixel format
    // Create the command buffer
    const command = Buffer.from([
      0x1d,
      0x76,
      0x30,
      m,
      xL,
      xH,
      yL,
      yH,
      ...imageBuffer,
    ]);

    return command;
  }

  printReceipt(orderDetails) {
    if (!this.endpointOut) {
      console.log("Endpoint OUT not initialized.");
      return;
    }

    try {
      this.printData(Buffer.from([0x1b, 0x74, 0x10]));

      // Helper functions to format text
      const printLine = (text) => this.printData(text + "\n");

      this.printImage("/Users/josevalenzuela/Desktop/images.png");

      this.setAlignment("CENTER");
      this.sendCommand([0x1b, 0x34]);
      printLine("Guillermo Prieto No. 490 Nte.");
      printLine("Col. Centro C.P. 81200, Los Mochis, Sin.");
      printLine("Tel.: 668-817-02-49 Cel.: 6682-24-42-07");
      this.setAlignment("LEFT");
      this.sendCommand([0x1b, 0x35]);

      printLine("");
      printLine("");
      this.printQRCode("https://www.apple.com/mac-studio/");
      // Print order details
      printLine(
        `Tipo de Pago: ${PAYMENT_TYPE_DICT[orderDetails.payment_type]}`
      );
      printLine(`Caja: ${orderDetails.cashier}`);
      printLine(`Atendido Por: ${orderDetails.cashier}`);
      printLine("");
      printLine("Productos:");

      // Print each product
      orderDetails.products.forEach((product) => {
        const totalPrice = product.quantity * product.amount;
        const truncatedName =
          product.description.length > 20
            ? product.description.substring(0, 20) + "..."
            : product.description;
        const productLine = `${truncatedName} ${
          product.quantity
        } X ${product.amount.toFixed(2)}`;
        const totalPriceString = `$${totalPrice.toFixed(2)}`;
        const dashes = "------------------------------------------------";
        printLine(
          `${productLine} ${dashes.substring(
            productLine.length + totalPriceString.length + 2
          )} ${totalPriceString}`
        );
        printLine("");
      });

      printLine("");

      // Print the total amount aligned to the right
      const totalString = `Total: $${orderDetails.total.toFixed(2)}`;
      const totalLine = totalString.padStart(30);
      this.setAlignment("RIGHT");
      printLine(totalLine);
      this.setAlignment("LEFT");

      printLine("");

      printLine("");
      printLine("");
      printLine("");
      printLine("");

      this.printData(Buffer.from([0x1d, 0x56, 0x00]).toString("utf-8"));
    } catch (error) {
      console.error(`Error while printing receipt: ${error.message}`);
    }
  }

  async releaseDevice() {
    if (this.device && !this.isClosing) {
      this.isClosing = true; // Mark as closing

      try {
        await new Promise((resolve, reject) => {
          // Ensure all requests are completed before closing
          this.device.close((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
        console.log("Device released.");
      } catch (error) {
        console.error(`Error while releasing device: ${error.message}`);
      } finally {
        this.isClosing = false; // Reset closing flag
      }
    }
  }
}

module.exports = USBPrinter;
