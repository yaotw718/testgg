/**
 * Created by afterloe on 8/2/2016.
 *
 */
const [path, Electron] = [require("path"), require("electron")];

const {BrowserWindow, nativeImage} = Electron;

const myConfig = require(path.join(__dirname,"..", "configuration"));

let createJuheWindow,showProcess, contextFrameWindow,updateProFrameWindow,runProcessFrameWindow, mainFrameWindow, screenWidth, screenHeight, windowIcon;
/**
 *
 * @param electronScreen
 */
module.exports.setScreen = electronScreen => {
    /**getPrimaryDisplay()
     * workAreaSize
     */
    let {width,height} = electronScreen.getPrimaryDisplay().workAreaSize;
    screenWidth = width;
    screenHeight = height;
};

module.exports.setWindowIcon = _path =>  _path ? windowIcon = _path : windowIcon = path.join(__dirname,"..", myConfig.icon);


function createJuheInfoWindow(_param) {
    if (createJuheWindow) {

        createJuheWindow.loadURL(_param.url);
        createJuheWindow.setTitle(_param.title);
        if (!createJuheWindow.isVisible()) createJuheWindow.show();
        else createJuheWindow.focus();
    } else {

        let [msgConfig,frameWindow] = [myConfig.frame];
        if (!msgConfig || !msgConfig.createJuheWindow) throw new Error("read config failed!");
        msgConfig = msgConfig.createJuheWindow;
        if (undefined === msgConfig.width || "auto" === msgConfig.width) msgConfig.width = Math.ceil(screenWidth * 0.15) > 300 ? Math.ceil(screenWidth * 0.15) : 300;
        if (undefined === msgConfig.height || "auto" === msgConfig.height) msgConfig.height = Math.ceil(screenHeight * 0.20) > 200 ? Math.ceil(screenHeight * 0.20) : 200;
        msgConfig.icon = windowIcon;
        msgConfig.title = `${msgConfig.title} ${_param.title}`;
        frameWindow = new BrowserWindow(msgConfig);
        if (msgConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        //????closed???
        frameWindow.on("closed", () => {
            frameWindow = null;
        createJuheWindow = null;
    });
    createJuheWindow = frameWindow;
}
return createJuheWindow;
};

function createContextFrameWindow(_param) {
    if (contextFrameWindow) {
        contextFrameWindow.loadURL(_param.url);
        contextFrameWindow.setTitle(_param.title);
        if (!contextFrameWindow.isVisible()) contextFrameWindow.show();
        else contextFrameWindow.focus();
    } else {
        let [ctxConfig,frameWindow] = [myConfig.frame];
        if (!ctxConfig || !ctxConfig.contextFrameWindow) throw new Error("read config failed!");
        ctxConfig = ctxConfig.contextFrameWindow;
        if (undefined === ctxConfig.width || "auto" === ctxConfig.width) ctxConfig.width = Math.ceil(screenWidth * 0.70) > 1280 ? Math.ceil(screenWidth * 0.70) : 1280;
        if (undefined === ctxConfig.height || "auto" === ctxConfig.height) ctxConfig.height = Math.ceil(screenHeight * 0.85) > 760 ? Math.ceil(screenHeight * 0.85) : 760;
        ctxConfig.icon = windowIcon;
        ctxConfig.title = `${ctxConfig.title} ${_param.title}`;
        frameWindow = new BrowserWindow(ctxConfig);
        if (ctxConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
        contextFrameWindow = null;
    });
    contextFrameWindow = frameWindow;
}

return contextFrameWindow;
};

function createUpdateProFrameWindow(_param) {
    if (updateProFrameWindow) {
        updateProFrameWindow.loadURL(_param.url);
        updateProFrameWindow.setTitle(_param.title);
        if (!updateProFrameWindow.isVisible()) updateProFrameWindow.show();
        else updateProFrameWindow.focus();
    } else {
        let [ctxConfig,frameWindow] = [myConfig.frame];
        if (!ctxConfig || !ctxConfig.updateProFrameWindow) throw new Error("read config failed!");
        ctxConfig = ctxConfig.updateProFrameWindow;
        if (undefined === ctxConfig.width || "auto" === ctxConfig.width) ctxConfig.width = Math.ceil(screenWidth * 0.70) > 1280 ? Math.ceil(screenWidth * 0.70) : 1280;
        if (undefined === ctxConfig.height || "auto" === ctxConfig.height) ctxConfig.height = Math.ceil(screenHeight * 0.85) > 760 ? Math.ceil(screenHeight * 0.85) : 760;
        ctxConfig.icon = windowIcon;
        ctxConfig.title = `${ctxConfig.title} ${_param.title}`;
        frameWindow = new BrowserWindow(ctxConfig);
        if (ctxConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
        updateProFrameWindow = null;
    });
    updateProFrameWindow = frameWindow;
}

return updateProFrameWindow;
};


function createRunProcessFrameWindow(_param) {
    if (runProcessFrameWindow) {
        runProcessFrameWindow.loadURL(_param.url);
        runProcessFrameWindow.setTitle(_param.title);
        if (!runProcessFrameWindow.isVisible()) runProcessFrameWindow.show();
        else runProcessFrameWindow.focus();
    } else {
        let [ctxConfig,frameWindow] = [myConfig.frame];
        if (!ctxConfig || !ctxConfig.runProcessFrameWindow) throw new Error("read config failed!");
        ctxConfig = ctxConfig.runProcessFrameWindow;
        if (undefined === ctxConfig.width || "auto" === ctxConfig.width) ctxConfig.width = Math.ceil(screenWidth * 0.70) > 1280 ? Math.ceil(screenWidth * 0.70) : 1280;
        if (undefined === ctxConfig.height || "auto" === ctxConfig.height) ctxConfig.height = Math.ceil(screenHeight * 0.85) > 760 ? Math.ceil(screenHeight * 0.85) : 760;
        ctxConfig.icon = windowIcon;
        ctxConfig.title = `${ctxConfig.title} ${_param.title}`;
        frameWindow = new BrowserWindow(ctxConfig);
        if (ctxConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
        runProcessFrameWindow = null;
    });
    runProcessFrameWindow = frameWindow;
}

return runProcessFrameWindow;
};

function createMainFrameWindow(_param) {
    if (mainFrameWindow) {
        mainFrameWindow.loadURL(_param.url);
        mainFrameWindow.setTitle(_param.title);
        if (!mainFrameWindow.isVisible()) mainFrameWindow.show();
        else mainFrameWindow.focus();
    } else {
        let [mainConfig,frameWindow] = [myConfig.frame];
        if (!mainConfig || !mainConfig.mainFrameWindow) throw new Error("read config failed!");
        mainConfig = mainConfig.mainFrameWindow;
        if (undefined === mainConfig.width || "auto" === mainConfig.width) mainConfig.width = Math.ceil(screenWidth * 0.20) > 390 ? Math.ceil(screenWidth * 0.20) : 390;
        if (undefined === mainConfig.height || "auto" === mainConfig.height) mainConfig.height = Math.ceil(screenHeight * 0.55) > 600 ? Math.ceil(screenHeight * 0.55) : 600;
        mainConfig.icon = nativeImage.createFromPath(`${__dirname}/../sources/${mainConfig.icon}`);
        mainConfig.icon = windowIcon;
        frameWindow = new BrowserWindow(mainConfig);
        if (mainConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
        mainFrameWindow = null;
    });
    mainFrameWindow = frameWindow;
}

return mainFrameWindow;
};
function createshowProcessStep(_param) {
    if (showProcess) {
        showProcess.loadURL(_param.url);
        showProcess.setTitle(_param.title);
        if (!showProcess.isVisible()) showProcess.show();
        else showProcess.focus();
    } else {
        let [mainConfig,frameWindow] = [myConfig.frame];
        if (!mainConfig || !mainConfig.showProcess) throw new Error("read config failed!");
        mainConfig = mainConfig.showProcess;
        if (undefined === mainConfig.width || "auto" === mainConfig.width) mainConfig.width = Math.ceil(screenWidth * 0.20) > 390 ? Math.ceil(screenWidth * 0.20) : 390;
        if (undefined === mainConfig.height || "auto" === mainConfig.height) mainConfig.height = Math.ceil(screenHeight * 0.55) > 600 ? Math.ceil(screenHeight * 0.55) : 600;
        mainConfig.icon = nativeImage.createFromPath(`${__dirname}/../sources/${mainConfig.icon}`);//???????Image????
        mainConfig.icon = windowIcon;
        frameWindow = new BrowserWindow(mainConfig);
        if (mainConfig.debug) frameWindow.webContents.openDevTools();
        frameWindow.loadURL(_param.url);
        frameWindow.on("closed", () => {
            frameWindow = null;
        showProcess = null;
    });
    showProcess = frameWindow;
}

return showProcess;
};

module.exports.createMainFrameWindow = createMainFrameWindow;
module.exports.createJuheInfoWindow = createJuheInfoWindow;
module.exports.createContextFrameWindow = createContextFrameWindow;
module.exports.createUpdateProFrameWindow = createUpdateProFrameWindow;
module.exports.createRunProcessFrameWindow = createRunProcessFrameWindow;
module.exports.createshowProcessStep = createshowProcessStep;

function getMainFrameWindow(windowName) {
    return "mainFrameWindow" === windowName ? mainFrameWindow : null;
};

function getCtxFrameWindow(windowName) {
    return "contextFrameWindow" === windowName ? contextFrameWindow : getMainFrameWindow(windowName);
};

function getCtxUpdateProFrameWindow(windowName) {
    return "updateProFrameWindow" === windowName ? updateProFrameWindow : getCtxFrameWindow(windowName);
};

function getCtxRunProcessFrameWindow(windowName) {
    return "runProcessFrameWindow" === windowName ? runProcessFrameWindow : getCtxUpdateProFrameWindow(windowName);
};

function getMsgNoticeWindow(windowName) {
    return "createJuheWindow" === windowName ? createJuheWindow : getCtxRunProcessFrameWindow(windowName);
};

function showProcessStepPage(windowName) {
    return "showProcess" === windowName ? showProcess : getMsgNoticeWindow(windowName);
};


module.exports.getWindow = windowName => {
    //  createJuheWindow, contextFrameWindow, mainFrameWindow,runProcessFrameWindow,showProcess,updateProFrameWindow
    return showProcessStepPage(windowName);
};
