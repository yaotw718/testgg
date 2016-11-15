/*初始化*/
const core = require('../bin/core');
let [user]=[core.readJson(`${__dirname}/../../../../pid`)];
var userid =user.user._id;
var processdata = [];
/*渲染进程1*/
const  ipcrenmenu = require('electron').ipcRenderer;
const [path, Electron] = [require("path"), require("electron")];
const myConfig = require(path.join(__dirname,"..", "configuration"));
//流程ip地址
const local_process_host=myConfig.pro_ip;
//窗口
let _Window = (data) => {
    ipcrenmenu.send("system", {
        tacticBlock : data,
        _win:"showProMenuFrameWindow"
    });
}
//窗口最小、最大、还原、关闭
let closeWindow = () => {
    _Window("closeWindow");
}
let minWindow = () => {
    _Window("miniWindow");
}

/*获取数据*/
$.ajax({
    url: "http://"+local_process_host+"/api/process/process/read?userId="+userid,
    type: "GET",
    success: function (getdata) {
        /*加载页面*/
        processdata = getdata;
        showProMenu(processdata);
        ipcrenmenu.send('loadingIndexPage');
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        /*加载空白流程页面*/
        console.log("加载数据库失败");
    }
});

function scrolltop(){
    document.getElementById('outerDiv2').scrollTop=0;
}

/*弹出流程菜单*/
function showProMenu(processdata){
    var projson = [];

    var prourl = location.href;
    var tmp = prourl.split("?")[1];
    var proid = tmp.split("=")[1];
    //根据proid找到对应流程步骤stepdata
    for (let i = 0; i < processdata.length; i++) {
        if (processdata[i].processId == proid) {
            projson = processdata[i].json;
            break;
        }
    }
    var sing_h = "";
    for (let i = 0; i < projson.length; i++) {
        let step_name = "";
        if(projson[i].type == 1) {
            step_name = projson[i].content;
        } else if (projson[i].type == 7){
            for (let j = 0; j < projson[i].content.length; j++) {
                step_name += projson[i].content[j].juheName+ " ";
            }
        } else if (projson[i].type == 3){
            step_name = projson[i].name;
        }else {
            for (let j = 0; j < projson[i].content.length; j++) {
                step_name += projson[i].content[j].name+ " ";
            }
        }

        sing_h += '<div class="proo_box_menu proo_box_menu_' + projson[i].type + '">\
                            <span class="title_menu_num">' + projson[i].num  + '</span>\
                            <div class="title_menu_type">' + step_name  + '</div>\
                            </div>';
    }
    $('#pro_menu_box').html(sing_h);

}

