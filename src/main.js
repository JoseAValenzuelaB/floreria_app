const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const USBPrinter = require("./printer");

const VENDOR_ID = 0x0471;
const PRODUCT_ID = 0x0055;

let printer = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Correct path to preload.js
      nodeIntegration: true, // Important to set this to false when using contextBridge
      contextIsolation: true, // Ensure contextIsolation is true for security
    },
  });

  win.loadFile(path.join(__dirname, "../public/index.html"));
}

function showNotification(title, body) {
  new Notification({ title, body }).show();
}


app.on("ready", () => {
  createWindow();

  printer = new USBPrinter(VENDOR_ID, PRODUCT_ID);
  // showNotification("Welcome!", "Your Electron app is running.");
});

ipcMain.on("print-order", async (event, orderDetails) => {
  printer.printReceipt(orderDetails);
});

//<h1>Información de Envío del Pedido</h1>

ipcMain.on("print-html", (event, deliveryInfo) => {
  let printWindow = new BrowserWindow({ show: false });

  const deliveryHtml = `
    <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      background-color: #f9f9f9;
    }

    h1 {
      text-align: center;
      color: #333;
      font-size: 12px;
      margin-bottom: 20px;
    }

    .container {
      margin: auto;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      height: 280px; /* Set the height to 280px */
    }

    .info {
      font-size: 10px;
    }
    
    .note {
      font-size: 12px;
    }

    .info:last-child {
      border-bottom: none;
    }

    .info strong {
      color: #555;
    }

    footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #888;
    }

    .divider {
      border-top: 1px solid #ddd;
      margin: 20px 0;
    }

    .row {
      display: flex;
      justify-content: space-between;
      height: 100%; /* Make the row fill the container */
    }

    .left {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right {
      width: 50%;
      margin-top: 10px;
      overflow-y: auto; /* Allow scrolling if content overflows */
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="left">
        <div class="note">Mensaje Génerico de Amor!</div>
      </div>
      <div class="right">
        <div>
          <div class="info">
            <p><strong>Fecha de Entrega:</strong> ${deliveryInfo.delivery_date}</p>
          </div>
        </div>
        <div>
          <div class="info">
            <p><strong>Hora de Entrega:</strong> ${deliveryInfo.delivery_time}</p>
          </div>
        </div>
        <div>
          <div class="info">
            <p><strong>Nombre del destinatario:</strong> ${deliveryInfo.recipient_name}</p>
          </div>
        </div>
        <div>
          <div class="info">
            <p><strong>Dirección del destinatario:</strong> ${deliveryInfo.street} #${deliveryInfo.house_number}, ${deliveryInfo.neighborhood}, ${deliveryInfo.city}</p>
          </div>
        </div>
        <div>
          <div class="info">
            <p><strong>Código postal:</strong> ${deliveryInfo.postal_code}</p>
          </div>
        </div>
        <div>
          <div class="info">
            <p><strong>Para contactar al destinatario:</strong> ${deliveryInfo.contact_number}</p>
          </div>
        </div>
        <div>
          <div class="info">
            <p><strong>Instrucciones de Entrega:</strong> ${deliveryInfo.delivery_instructions}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>



  `;

  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(deliveryHtml)}`
  );

  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print(
      {
        silent: false,
        printBackground: true,
      },
      () => {
        printWindow.close(); // Close the window after printing
      }
    );
  });
});


// Handle printing of the barcode
ipcMain.on("print-barcode", (event, barcodeImage) => {
  const printWindow = new BrowserWindow({
    width: 300,
    height: 300,
    show: false, // Keep it hidden
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the barcode into the print window and print it
  printWindow.loadURL(`data:text/html;charset=utf-8,
    <html>
      <body style="text-align:center;">
        <img src="${barcodeImage}" />
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
});

// Handle app close event to clean up resources
app.on("before-quit", async (event) => {
  if (printer) {
    try {
      await printer.releaseDevice();
      console.log("Printer closed successfully.");
    } catch (error) {
      console.error(`Error while closing the printer: ${error.message}`);
    }
  }
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});