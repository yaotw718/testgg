/*初始化*/
const core = require('../bin/core');
let [user]=[core.readJson(`${__dirname}/../../../../pid`)];
const [path, Electron] = [require("path"), require("electron")];
const myConfig = require(path.join(__dirname,"..", "configuration"));
//流程ip地址
const local_process_host= myConfig.pro_ip;
/*渲染进程1*/
const  ipcren = require('electron').ipcRenderer;
var userID = user.user._id;
var promainData = [];

ipcren.on('newProcess',(event)=>{
    process(userID);
});

//窗口
let _Window = (data) => {
    ipcren.send("system", {
        tacticBlock : data,
        _win:"mainFrameWindow"
    });
}
//窗口最小、最大、还原、关闭
let closeWindow = () => {
    _Window("closeWindow");
}
let minWindow = () => {
    _Window("miniWindow");
}

/*初始化加载*/
$(function(){
    process(userID);
});

/*加载现有流程*/
function process(userID)
{

   var userid =userID;
    $.ajax({
        url: "http://"+local_process_host+"/api/process/process/read?userId="+userid+ "",
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        success: function (getdata) {
            console.log(getdata);
            loadingPage(getdata);
            promainData = getdata;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            loadingEmpty();
        }
    });
}

/*加载页面*/
function loadingPage(getdata) {
    /*加载现有流程*/
    var prodata = getdata;
    var sing_h = "";
    for (let i = 0; i < prodata.length; i++) {
        sing_h += '<li class="runpro" id="'+ prodata[i].processId +'">\
                            <img src="' + prodata[i].icon + '">\
                            <span class="normal_span">' + prodata[i].proName + '</span>\
                            </li>';
    }
    sing_h+= '<li><div class="add_img" onclick="liucheng(userID)"><img src="images/add1.png"></div><span class="add_span">&nbsp;</span></li>';
    $('.new_pro').html(sing_h);

    /*右键方法*/
    youjian();

    /*运行流程*/
    $('.runpro').click(function(){
        var pid = $(this).attr("id");
        runprocess(pid);
    });
}

/*右键方法*/
function youjian() {
    /*右键功能*/
    $(".new_pro li.runpro").mousedown(function(e){
        if(e.which===3){
            var _this=this;
            var id_num = $(_this).attr("id");
            $(_this).contextMenu('sysMenu',
                {  bindings:
                {
                    'Li1':function(Item) {
                        $(_this).unbind('click');
                        //删除数据库，再删除元素
                        deletePro(id_num);
                        $(_this).remove();
                    },
                    'Li2':function(Item){
                        $(_this).unbind('click');
                        $(_this).find('span').attr('contenteditable','true').focus();
                        $(_this).find('span').removeClass('normal_span');
                        var range = window.getSelection();//创建range
                        range.selectAllChildren($(_this).find('span')[0]);//range 选择obj下所有子内容
                        range.collapseToEnd();//光标移至最后
                        var before = $(_this).find('span').text();
                        $(_this).find('span').blur(function(){
                            var ifRepet = false;
                            var add=$(_this).find('span').text();
                            $(_this).find('span').attr('contenteditable', 'false');
                            $(_this).find('span').addClass('normal_span');

                            for(let i=0;i<promainData.length;i++) {
                                if (add == promainData[i].proName && add != before) {
                                    ifRepet = true;
                                    break;
                                }
                            }
                            var rg = /^[a-zA-Z0-9\u4E00-\u9FA5\.\+\-\_]{1,12}$/;
                            if (ifRepet == false) {
                                if (rg.test(add)) {
                                    changeProName(id_num,add);
                                } else {
                                    $.MsgBox.Alert('温馨提示','名字不能为空且字符长度1-12位之间');
                                    $(_this).find('span').text(before);
                                    $(_this).find('span').attr('contenteditable', 'true').focus();
                                }
                            } else {
                                $.MsgBox.Alert('温馨提示','此名称已存在！请重新填写');
                                $(_this).find('span').text(before);
                                $(_this).find('span').attr('contenteditable', 'true').focus();
                                ifRepet = false;
                            }
                        })
                    },
                    'Li3':function(Item) {
                        $(_this).unbind('click');
                        //弹出流程菜单
                        /*ipcren.send('showMenu-message','显示菜单');*/
                        showProMenu_index(id_num);
                    },
                    'Li4':function(Item) {
                        $(_this).unbind('click');
                        //编辑流程菜单，放最后做
                         updateprocess(id_num);
                    }
                }
                }
            )
        }
    });
}

/*无数据，加载空白页面*/
function loadingEmpty(getdata) {
    var sing_h = "";
    sing_h+= '<li><div class="add_img" onclick="liucheng(userID)"><img src="images/add1.png"></div><span class="add_span">&nbsp;</span></li>';
    $('.new_pro').html(sing_h);
}

/*创建流程*/
let liucheng=(userID)=>{
    ipcren.send('showContextFrameWindow', userID,"addMapsSearch");
}

/*运行已有流程*/
let runprocess=(pid)=>{
    ipcren.send('runProcessFrameWindow', pid,"runProcess");
}

/*编辑已有流程*/
let updateprocess=(pid)=>{
    ipcren.send('updateProcessFrameWindow', pid,"updateProcess");
}

/*删除流程*/
function deletePro(val) {
    $.ajax({
        url: "http://"+local_process_host+"/api/process/process/destroy",
        data: {
            processId: val,
        },
        type: "POST",
        dataType: "json",
        success: function (getdata) {
            /*加载页面*/
            /*window.location.reload();*/
            ipcren.send('loadingIndexPage');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*加载空白流程页面*/
            console.log("删除流程失败");
        }
    });
}

/*修改流程名字*/
function changeProName(proid,val) {
    $.ajax({
        url: "http://"+local_process_host+"/api/process/process/update",
        data: {
            processId: proid,
            name: val,
        },
        type: "POST",
        success: function (getdata) {
            /*加载页面*/
            ipcren.send('loadingIndexPage');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*加载空白流程页面*/
            console.log("重命名流程失败");
        }
    });
}

function showProMenu_index(id_num) {
    ipcren.send('showProcessStep', id_num,"showProMenu_index");
}



