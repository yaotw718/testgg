/*初始化*/
const core = require('../bin/core');
let [fs,addon2] = [require("fs"),require("MPaddon/MPaddon")];
let [user]=[core.readJson(`${__dirname}/../../../../pid`)];
var userid =user.user._id;
var step = 1;
var step_type3 = 0;
var processdata = [];

const [path, Electron] = [require("path"), require("electron")];
const myConfig = require(path.join(__dirname,"..", "configuration"));
//流程ip地址
const local_process_host=myConfig.pro_ip;

/*const addonPro=require(`${__dirname}/../Interface_pro/EnvConfigPluginNode`);*/
const addon=require(`${__dirname}/../Interface/EnvConfigPluginNode`);
/*const href=`${__dirname}\\..\\EnvConfig`;*/
/*addon.EnvCfgInitECPath(href);*/
/*渲染进程4*/
const ipcrendererRunPro = require('electron').ipcRenderer;

/*运行宏命令*/
var exec = require('child_process').exec;

//窗口
let _Window = (data) => {
    ipcrendererRunPro.send("system", {
        tacticBlock : data,
        _win:"runProcessFrameWindow"
    });
}
//窗口最小、最大、还原、关闭
let closeWindow = () => {
    _Window("closeWindow");
}
let minWindow = () => {
    _Window("miniWindow");
}


$.ajax({
    url: "http://"+local_process_host+"/api/process/process/read?userId="+userid,
    type: "GET",
    dataType: "json",
    success: function (getdata) {
        console.log(getdata);
        /*加载页面*/
        processdata = getdata;
        loading(processdata);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        /*加载空白流程页面*/
        console.log("加载数据库失败");
    }
});


/*流程页面加载*/
function loading(getdata) {
    var stepdata = [];
    var prourl = location.href;
    var tmp = prourl.split("?")[1];
    var proid = tmp.split("=")[1];
    //根据proid找到对应流程步骤stepdata
    for (var i = 0; i < getdata.length; i++) {
        if (getdata[i].processId == proid) {
            stepdata = getdata[i].json;
            $(".head_l_run img").attr('src',getdata[i].icon);
            $("#headtitle").html(getdata[i].proName);
            break;
        }
    }

    /*执行步骤*/
    runpage();

    //判断此步骤是哪种类型
    function runpage() {

        if(stepdata[step-1].type==1) {      //打开网址步骤
            $(".menu_num").attr("id","menu_num_num1");
            $(".menu_box").attr("id","menu_box_num1");
            $(".next_step").attr("id","next_step_num1");
            $(".tool_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $(".url_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+"："+stepdata[step-1].content);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            $('.loading').css('display','block');
            $('.leixing:visible .load iframe').attr('src',stepdata[step-1].content);
            $('.leixing:visible .load iframe').load(function(){
                $('.leixing:visible .load').css('display','block');
                $('.loading').css('display','none');
            });
            step++;
        } else if(stepdata[step-1].type==3) {   //个性化流程步骤
            $(".menu_num").attr("id","menu_num_num3");
            $(".menu_box").attr("id","menu_box_num3");
            $(".next_step").attr("id","next_step_num3");
            $(".url_box").removeClass('to-block');
            $(".tool_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html("个性化流程-"+stepdata[step-1].name+" 步骤数："+stepdata[step-1].content[0].length);
            if(step == stepdata.length && step_type3 == stepdata[step-1].content[0].length-1) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            if(step_type3 < stepdata[step-1].content[0].length) {

                if(stepdata[step-1].content[0][step_type3].type ==1) {  //子流程，打开网址
                    $(".url_box").addClass('to-block');
                    $(".tool_box").removeClass('to-block');
                    $(".juhe_box").removeClass('to-block');

                    $('.loading').css('display','block');
                    $('.leixing:visible .load iframe').attr('src',stepdata[step-1].content[0][step_type3].content);
                    $('.leixing:visible .load iframe').load(function(){
                        $('.leixing:visible .load').css('display','block');
                        $('.loading').css('display','none');
                    });
                    step_type3++;
                } else if(stepdata[step-1].content[0][step_type3].type ==5) {       //子流程，本地应用
                    $(".url_box").removeClass('to-block');
                    $(".tool_box").addClass('to-block');
                    $(".juhe_box").removeClass('to-block');

                    let sing_h = "";
                    for (var i = 0; i < stepdata[step-1].content[0][step_type3].content.length; i++) {
                        sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[0][step_type3].content[i].iconPath + '">\
                            <span>' + stepdata[step-1].content[0][step_type3].content[i].name+ '</span>\
                            </li>';

                        addon.EnvCfgSetupExe(stepdata[step-1].content[0][step_type3].content[i].exePath);
                    }
                    $('.spaces_box').html(sing_h);
                    step_type3++;
                }else if(stepdata[step-1].content[0][step_type3].type ==7) {    //子流程，聚合信息
                    $(".url_box").removeClass('to-block');
                    $(".tool_box").removeClass('to-block');
                    $(".juhe_box").addClass('to-block');

                    var juheinfo = [];
                    var juheinfo = stepdata[step-1].content[0][step_type3].content;
                    let _h="";
                    for(let i=0;i < juheinfo.length;i++){
                        _h+='<div class="iframeBox" style="width:'+juheinfo[i].juheWidth+'px;height:'+juheinfo[i].juheHeight+'px;">' +
                            '<iframe data-i="'+i+'" class="scroll" style="display:none;margin:-'+juheinfo[i].juheTop+'px 0 0 -'+juheinfo[i].juheLeft+'px;" src="'+juheinfo[i].juheUrl+'" frameborder="0" name="'+juheinfo[i].juheName+'" width="900" height="490"></iframe>' +
                            '</div>'
                    }
                    $('.loading').css('display','block');
                    $('.load_juhe').html(_h);
                    let arr=[];
                    $('.iframeBox iframe').load(function(){
                        arr.push(true);
                        var i=$(this).attr('data-i');
                        var margintop = parseInt(juheinfo[i].juheTop)+parseInt(juheinfo[i].scroltop);
                        $(this).css({'marginTop':-margintop,height:$(this).contents().find('html').get(0).scrollHeight});
                        $(this).contents().find('body,html').scrollLeft(juheinfo[i].scrolleft);
                        if(arr.length==$('.iframeBox iframe').length){
                            $('.iframeBox iframe').css('display','block');
                            $('.loading').css('display','none');
                        }
                    });
                    step_type3++;
                } else if(stepdata[step-1].content[0][step_type3].type ==2) {   //子流程，个性化工具
                    $(".url_box").removeClass('to-block');
                    $(".tool_box").addClass('to-block');
                    $(".juhe_box").removeClass('to-block');

                    let sing_h = "";
                    for (var i = 0; i < stepdata[step-1].content[0][step_type3].content.length; i++) {
                        sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[0][step_type3].content[i].img + '">\
                            <span>' + stepdata[step-1].content[0][step_type3].content[i].name+ '</span>\
                            </li>';

                        var href22= stepdata[step-1].content[0][step_type3].content[i].content.configPath;
                        addon.EnvCfgInitECPath(href22);
                        addon.EnvCfgSetupProfile(stepdata[step-1].content[0][step_type3].content[i].content.appName,stepdata[step-1].content[0][step_type3].content[i].content.exePath,stepdata[step-1].content[0][step_type3].content[i].content.cfgName);
                    }
                    $('.spaces_box').html(sing_h);
                    step_type3++;
                }else if(stepdata[step-1].content[0][step_type3].type ==6) {   //子流程，应用市场
                    $(".url_box").removeClass('to-block');
                    $(".tool_box").addClass('to-block');
                    $(".juhe_box").removeClass('to-block');

                    let sing_h = "";
                    for (var i = 0; i < stepdata[step-1].content[0][step_type3].content.length; i++) {
                        sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[0][step_type3].content[i].img + '">\
                            <span>' + stepdata[step-1].content[0][step_type3].content[i].name+ '</span>\
                            </li>';
                        //启动应用
                        let [id,version,name] = [stepdata[step-1].content[0][step_type3].content[i].content,stepdata[step-1].content[0][step_type3].content[i].version,stepdata[step-1].content[0][step_type3].content[i].name];
                        let fileBasePath = path.join(__dirname,"..","..","..",userid,id);
                        let filePath = path.join(fileBasePath,"package.json");
                        if(fs.existsSync(filePath)){
                            //软件包已下载 直接启动
                            startApp(fileBasePath);
                        } else {
                            $.MsgBox.Alert(name+"应用此地址还未下载，请先到应用市场下载此应用");
                        }
                    }
                    $('.spaces_box').html(sing_h);
                    step_type3++;
                }else {             //其他三类
                    $(".url_box").removeClass('to-block');
                    $(".tool_box").addClass('to-block');
                    $(".juhe_box").removeClass('to-block');

                    let sing_h = "";
                    for (var i = 0; i < stepdata[step-1].content[0][step_type3].content.length; i++) {
                        sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[0][step_type3].content[i].img + '">\
                            <span>' + stepdata[step-1].content[0][step_type3].content[i].name+ '</span>\
                            </li>';
                        $('.spaces_box').html(sing_h);
                        //启动应用
                        let [id,version,name] = [stepdata[step-1].content[0][step_type3].content[i].content,stepdata[step-1].content[0][step_type3].content[i].version,stepdata[step-1].content[0][step_type3].content[i].name];
                        let fileBasePath = path.join(__dirname,"..","..","..",userid,id);
                        let filePath = path.join(fileBasePath,"package.json");
                        if(fs.existsSync(filePath)){
                            //软件包已下载 直接启动
                            startApp(fileBasePath);
                        } else {
                            $.MsgBox.Alert(name+"应用此地址还未下载，请先到应用市场下载此应用");
                        }
                    }
                    step_type3++;
                }
            }

        }else if(stepdata[step-1].type==5) {    //本地应用
            $(".menu_num").attr("id","menu_num_num5");
            $(".menu_box").attr("id","menu_box_num5");
            $(".next_step").attr("id","next_step_num5");
            $(".url_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $(".tool_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+" 应用数："+stepdata[step-1].content.length);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            let sing_h = "";
            for (var i = 0; i < stepdata[step-1].content.length; i++) {
                sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[i].iconPath + '">\
                            <span>' + stepdata[step-1].content[i].name+ '</span>\
                            </li>';


                addon.EnvCfgSetupExe(stepdata[step-1].content[i].exePath);
            }
            $('.spaces_box').html(sing_h);

            step++;
        }else if(stepdata[step-1].type==2) {    //个性化工具
            $(".menu_num").attr("id","menu_num_num2");
            $(".menu_box").attr("id","menu_box_num2");
            $(".next_step").attr("id","next_step_num2");
            $(".url_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $(".tool_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+" 个性化工具数："+stepdata[step-1].content.length);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            let sing_h = "";
            for (var i = 0; i < stepdata[step-1].content.length; i++) {
                sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[i].img + '">\
                            <span>' + stepdata[step-1].content[i].name+ '</span>\
                            </li>';
                var href22= stepdata[step-1].content[i].content.configPath;
                addon.EnvCfgInitECPath(href22);
                addon.EnvCfgSetupProfile(stepdata[step-1].content[i].content.appName,stepdata[step-1].content[i].content.exePath,stepdata[step-1].content[i].content.cfgName);
            }
            $('.spaces_box').html(sing_h);

            step++;
        }else if(stepdata[step-1].type==7) {    //聚合信息
            $(".menu_num").attr("id","menu_num_num7");
            $(".menu_box").attr("id","menu_box_num7");
            $(".next_step").attr("id","next_step_num7");
            $(".url_box").removeClass('to-block');
            $(".tool_box").removeClass('to-block');
            $(".juhe_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+" 聚合信息数："+stepdata[step-1].content.length);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }


            var juheinfo = [];
            var juheinfo = stepdata[step-1].content;
            let _h="";
            for(let i=0;i < juheinfo.length;i++){
                _h+='<div class="iframeBox" style="width:'+juheinfo[i].juheWidth+'px;height:'+juheinfo[i].juheHeight+'px;">' +
                    '<iframe data-i="'+i+'" class="scroll" style="display:none;margin:-'+juheinfo[i].juheTop+'px 0 0 -'+juheinfo[i].juheLeft+'px;" src="'+juheinfo[i].juheUrl+'" frameborder="0" name="'+juheinfo[i].juheName+'" width="900" height="490"></iframe>' +
                    '</div>'
            }
            $('.loading').css('display','block');
            $('.load_juhe').html(_h);
            let arr=[];
            $('.iframeBox iframe').load(function(){
                arr.push(true);
                var i=$(this).attr('data-i');
                var margintop = parseInt(juheinfo[i].juheTop)+parseInt(juheinfo[i].scroltop);
                $(this).css({'marginTop':-margintop,height:$(this).contents().find('html').get(0).scrollHeight});
                $(this).contents().find('body,html').scrollLeft(juheinfo[i].scrolleft);
                if(arr.length==$('.iframeBox iframe').length){
                    $('.iframeBox iframe').css('display','block');
                    $('.loading').css('display','none');
                }
            });
            step++;
        } else if(stepdata[step-1].type==6){    //应用市场
            $(".menu_num").attr("id","menu_num_num6");
            $(".menu_box").attr("id","menu_box_num6");
            $(".next_step").attr("id","next_step_num6");
            $(".url_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $(".tool_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+" 应用数："+stepdata[step-1].content.length);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            let sing_h = "";
            for (var i = 0; i < stepdata[step-1].content.length; i++) {
                sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[i].icon + '">\
                            <span>' + stepdata[step-1].content[i].name+ '</span>\
                            </li>';
                //启动应用
                let [id,version,name] = [stepdata[step-1].content[i].content,stepdata[step-1].content[i].version,stepdata[step-1].content[i].name];
                let fileBasePath = path.join(__dirname,"..","..","..",userid,id);
                let filePath = path.join(fileBasePath,"package.json");
                if(fs.existsSync(filePath)){
                    //软件包已下载 直接启动
                    startApp(fileBasePath);
                } else {
                    $.MsgBox.Alert(name+"应用此地址还未下载，请先到应用市场下载此应用");
                }
            }
            $('.spaces_box').html(sing_h);
            step++;
        }else if(stepdata[step-1].type==4){ //搜索
            $(".menu_num").attr("id","menu_num_num4");
            $(".menu_box").attr("id","menu_box_num4");
            $(".next_step").attr("id","next_step_num4");
            $(".url_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $(".tool_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+"："+stepdata[step-1].content[0].name);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            let sing_h = "";
            for (var i = 0; i < stepdata[step-1].content.length; i++) {
                sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[i].icon + '">\
                            <span>' + stepdata[step-1].content[i].name+ '</span>\
                            </li>';
                $('.spaces_box').html(sing_h);
                //启动应用
                let [id,version,name] = [stepdata[step-1].content[i].content,stepdata[step-1].content[i].version,stepdata[step-1].content[i].name];
                let fileBasePath = path.join(__dirname,"..","..","..",userid,id);
                let filePath = path.join(fileBasePath,"package.json");
                if(fs.existsSync(filePath)){
                    //软件包已下载 直接启动
                    startApp(fileBasePath);
                } else {
                    $.MsgBox.Alert(name+"应用此地址还未下载，请先到应用市场下载此应用");
                }

            }
            step++;
        }else if(stepdata[step-1].type==8){ //社交群
            $(".menu_num").attr("id","menu_num_num8");
            $(".menu_box").attr("id","menu_box_num8");
            $(".next_step").attr("id","next_step_num8");
            $(".url_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $(".tool_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+"："+stepdata[step-1].content[0].name);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            let sing_h = "";
            for (var i = 0; i < stepdata[step-1].content.length; i++) {
                sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[i].icon + '">\
                            <span>' + stepdata[step-1].content[i].name+ '</span>\
                            </li>';
                $('.spaces_box').html(sing_h);
                //启动应用
                let [id,version,name] = [stepdata[step-1].content[i].content,stepdata[step-1].content[i].version,stepdata[step-1].content[i].name];
                let fileBasePath = path.join(__dirname,"..","..","..",userid,id);
                let filePath = path.join(fileBasePath,"package.json");
                if(fs.existsSync(filePath)){
                    //软件包已下载 直接启动
                    startApp(fileBasePath);
                } else {
                    $.MsgBox.Alert(name+"应用此地址还未下载，请先到应用市场下载此应用");
                }

            }
            step++;
        }else if(stepdata[step-1].type==9){ //我的存储
            $(".menu_num").attr("id","menu_num_num9");
            $(".menu_box").attr("id","menu_box_num9");
            $(".next_step").attr("id","next_step_num9");
            $(".url_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $(".tool_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+"："+stepdata[step-1].content[0].name);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            let sing_h = "";
            for (var i = 0; i < stepdata[step-1].content.length; i++) {
                sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[i].icon + '">\
                            <span>' + stepdata[step-1].content[i].name+ '</span>\
                            </li>';
                $('.spaces_box').html(sing_h);
                //启动应用
                let [id,version,name] = [stepdata[step-1].content[i].content,stepdata[step-1].content[i].version,stepdata[step-1].content[i].name];
                let fileBasePath = path.join(__dirname,"..","..","..",userid,id);
                let filePath = path.join(fileBasePath,"package.json");
                if(fs.existsSync(filePath)){
                    //软件包已下载 直接启动
                    startApp(fileBasePath);
                } else {
                    $.MsgBox.Alert(name+"应用此地址还未下载，请先到应用市场下载此应用");
                }

            }
            step++;
        }else if(stepdata[step-1].type==10) {    //宏
            $(".menu_num").attr("id","menu_num_num2");
            $(".menu_box").attr("id","menu_box_num2");
            $(".next_step").attr("id","next_step_num2");
            $(".url_box").removeClass('to-block');
            $(".juhe_box").removeClass('to-block');
            $(".tool_box").addClass('to-block');
            $('.menu_num span').html(step);
            $('.menu_title').html(stepdata[step-1].name+"："+stepdata[step-1].content[0].name);
            if(step == stepdata.length) {
                $('.next_step').html("结束");
                $('.next_step').addClass('over');
            } else {
                $('.next_step').html("下一步");
            }

            let sing_h = "";

            sing_h += '<li>\
                            <img src="' + stepdata[step-1].content[0].img + '">\
                            <span>' + stepdata[step-1].content[0].name+ '</span>\
                            </li>';
            $('.spaces_box').html(sing_h);

            for (var i = 0; i < stepdata[step-1].content[0].content.length; i++) {

                let hongdate = stepdata[step - 1].content[0].content[i];
                /*var hongdate = "\"C:\\Program Files (x86)\\Git\\bin\\git.exe\"";*/
                // 使用exec执行git命令
                runHong(hongdate);

            }

            step++;
        }
    }

    /*下一步事件*/
    $('.next_step').click(function(){

        if($(".next_step").html() == "结束") {
            closeWindow();
            utilContr.noticeMaster("showWindow",{
                windowName : "mainWindow"
            });
        } else {

            if(step_type3 == stepdata[step-1].content[0].length) {
                step++;
                step_type3 = 0;
            }
            runpage();
        }
    });
}

function startApp(projectPath){

    let packagePath= path.join(projectPath,"package.json");
    if(!fs.existsSync(packagePath))return false; //package.json 缺少该文件
        return addon2.startProgramWithParam(path.join(__dirname,"..","..","..","..","mate.exe"),projectPath);
       /* try{
            let packageOjb = require(packagePath);// 返回json对象
            let mainJs = packageOjb.main;
            if(!mainJs) mainJs = "index.js"; //未配置main脚本，默认启动index.js
            mainJs = path.join(projectPath,mainJs);
            if(!fs.existsSync(mainJs))return false;//启动主脚本不存在
            return addon2.startProgramWithParam(path.join(__dirname,"..","..","..","..","mate.exe"),mainJs);
        }catch(e){
            console.log(e);
            return false;
        };*/
};


function runHong(hongdate){
    console.log("fun() start");
    exec(hongdate, function(err, data) {
        if(data) {
            console.log(data);
        }
        if (err) {
            console.log(err);
            throw err;
        }
    });
}