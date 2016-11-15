/**
 * create by afterloe om 10-13-2016
 *
 */
const [path, Electron,fs] = [require("path"), require("electron"),require("fs")];
const [lib,_ipc] = [require(path.join(__dirname, "lib")),require(path.join(__dirname, "bin","ipc"))];
let app = Electron.app;
const [conLib] = [require(path.join(__dirname,'..','..','truMate','lib'))];

app.on("ready", readyApp);

function readyApp() {
    let {screen : electronScreen} = Electron;
    lib.windowHelper.setScreen(electronScreen); // 设置屏幕宽度
    lib.windowHelper.setWindowIcon(); //设置ICON
    lib.windowHelper.createMainFrameWindow({
        url: `file://${path.join(__dirname,"views", "index.html")}`,
        title: "My Process"
    });

   /* 防止应用重复启动*/
    const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
            let myWindow = lib.windowHelper.getWindow("mainFrameWindow");

        if (myWindow) {
            if (myWindow.isMinimized()) myWindow.restore()
                 myWindow.focus()
             };
    });
        if (shouldQuit) {
            app.quit();
        }
    /* 防止应用重复启动*/
};


conLib.netRequest.accessMaster({"path":"/user/validateLogon"},function(err,data){
    if(err){
        console.log(err);
    }else{
        let result = JSON.parse(data);
        if(result.code != 200){
            fs.writeFileSync(path.join(__dirname,"..","..","..","pid"),"");
            //启动默认应用
            require("MPaddon/MPaddon").startProgramWithParam(path.join(__dirname,"..","..","..","mate.exe"),path.join(__dirname,"..","..","truMate"));
            //关闭当前应用
            app.quit();
        }else{
            console.log(result);
        }
    }
});

