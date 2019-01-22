const { app, BrowserWindow, shell, ipcMain, Menu } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
    },
    height: 600,
    width: 800,
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`,
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require("electron-devtools-installer");

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });
  }

  mainWindow.once("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }

    ipcMain.on("open-external-window", (event, arg) => {
      shell.openExternal(arg);
    });
  });

  mainWindow.on("close", event => {
    if (process.platform === "darwin") {
      if (app.quitting) {
        mainWindow = null;
      } else if (mainWindow !== null) {
        mainWindow = mainWindow === null ? newWindow() : mainWindow;
        event.preventDefault();
        mainWindow.hide();
      }
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

generateMenu = () => {
  const template = [
    {
      label: "File",
      submenu: [{ role: "about" }, { role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      role: "window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
    {
      role: "help",
      submenu: [
        {
          click() {
            require("electron").shell.openExternal(
              "https://getstream.io/winds",
            );
          },
          label: "Learn More",
        },
        {
          click() {
            require("electron").shell.openExternal(
              "https://github.com/GetStream/Winds/issues",
            );
          },
          label: "File Issue on GitHub",
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on("ready", () => {
  createWindow();
  generateMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (process.platform === "darwin") {
    app.quitting = true;
  }
});

app.on("activate", () => {
  if (process.platform === "darwin" && mainWindow !== null) {
    mainWindow.show();
  }
});

ipcMain.on("load-page", (event, arg) => {
  mainWindow.loadURL(arg);
});
