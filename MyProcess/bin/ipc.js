/**
 * Created by Administrator on 2016/9/12 0012.
 */
const {ipcMain} = require('electron');
const [electron,path,core]=[require('electron'),require("path"),require("./core")];
let [lib,user]=[require(path.join(__dirname, "..","lib")),core.readJson(`${__dirname}/../../../../pid`)];

ipcMain.on("system", (event, param) => {
    let {tacticBlock,_win}=param;
switch(tacticBlock){
    case "miniWindow":
        electron.BrowserWindow.getFocusedWindow().minimize();
        break;
    case "closeWindow":
        let focusedWin = electron.BrowserWindow.getFocusedWindow();
        focusedWin.destroy();
        let app=electron.app;
        if(_win=="mainFrameWindow"){
            app.quit();
        }else if(_win=="contextFrameWindow"){
            if(lib.windowHelper.getWindow("contextFrameWindow"))
                lib.windowHelper.getWindow("contextFrameWindow").destroy();
        }else if(_win=="createJuheWindow"){
            if(lib.windowHelper.getWindow("createJuheWindow"))
                lib.windowHelper.getWindow("createJuheWindow").destroy();
        }else if(_win=="runProcessFrameWindow"){
            if(lib.windowHelper.getWindow("runProcessFrameWindow"))
                lib.windowHelper.getWindow("runProcessFrameWindow").destroy();
        }else if(_win=="showProMenuFrameWindow"){
            if(lib.windowHelper.getWindow("showProcess"))
                lib.windowHelper.getWindow("showProcess").destroy();
        }else if(_win=="updateProFrameWindow"){
            if(lib.windowHelper.getWindow("updateProFrameWindow"))
                lib.windowHelper.getWindow("updateProFrameWindow").destroy();
        }
        break;
    case "maxWindow":
        electron.BrowserWindow.getFocusedWindow().maximize();
        break;
    case "unmaximize":
        electron.BrowserWindow.getFocusedWindow().unmaximize();
        break;
}
});

ipcMain.on('showContextFrameWindow',(event, arg, callback) => {
    let {screen : electronScreen} = electron;
lib.windowHelper.setScreen(electronScreen); // 设置屏幕宽度
lib.windowHelper.setWindowIcon(); //设置ICON
lib.windowHelper.createContextFrameWindow({
    url: `file://${__dirname}/../views/CreateProcess.html?userid=`+arg,
    title: "创建流程"
});
})

ipcMain.on('updateProcessFrameWindow',(event, arg, callback) => {
    let {screen : electronScreen} = electron;
lib.windowHelper.setScreen(electronScreen); // 设置屏幕宽度
lib.windowHelper.setWindowIcon(); //设置ICON
lib.windowHelper.createUpdateProFrameWindow({
    url: `file://${__dirname}/../views/UpdateProcess.html?pid=`+arg,
    title: "编辑流程"
});
})

ipcMain.on('runProcessFrameWindow',(event, arg, callback) => {
    let {screen : electronScreen} = electron;
lib.windowHelper.setScreen(electronScreen); // 设置屏幕宽度
lib.windowHelper.setWindowIcon(); //设置ICON
lib.windowHelper.createRunProcessFrameWindow({
    url: `file://${__dirname}/../views/runProcess.html?pid=`+arg,
    title: "运行流程"
});
})


ipcMain.on('showProcessStep',(event, arg, name) => {
    let {screen : electronScreen} = electron;
lib.windowHelper.setScreen(electronScreen); // 设置屏幕宽度
lib.windowHelper.setWindowIcon(); //设置ICON
lib.windowHelper.createshowProcessStep({
    url: `file://${__dirname}/../views/showProMenu.html?pid=`+arg,
    title: "显示流程菜单"
});
})
ipcMain.on('showMainFrameWindow',(event, arg, callback) => {
    let {screen : electronScreen} = electron;
lib.windowHelper.setScreen(electronScreen); // 设置屏幕宽度
lib.windowHelper.setWindowIcon(); //设置ICON
lib.windowHelper.createMainFrameWindow({
    url: `file://${__dirname}/../views/index.html}`,
    title: "我的流程"
});
lib.trayHelper.createTray({
        callback: () => {
        lib.windowHelper.getWindow("mainFrameWindow").show();
}
});
})
ipcMain.on('createJuheWindow',(event, arg, callback) => {
    let {screen : electronScreen} = electron;
lib.windowHelper.setScreen(electronScreen); // 设置屏幕宽度
lib.windowHelper.setWindowIcon(); //设置ICON
lib.windowHelper.createJuheInfoWindow({
    url: `file://${__dirname}/../views/CreateJuheInfo.html`,
    title: "新建聚合项"
});
})

ipcMain.on('loadingIndexPage',(event, param)=>{
    lib.windowHelper.getWindow("mainFrameWindow").webContents.send("newProcess");
})

ipcMain.on('loadingJuhePage',(event, param)=>{
    lib.windowHelper.getWindow("contextFrameWindow").webContents.send("newJuhe");
})

//启动市场应用
ipcMain.on('open_app', (event,arg,record) => {
    event.sender.send('open_app-reply',startApp(arg),record);
});

