/***************************************************************************初始化**********************************************/
/*渲染进程2*/
const ipcrendererupdate = require('electron').ipcRenderer;
const [path, Electron] = [require("path"), require("electron")];
const myConfig = require(path.join(__dirname,"..", "configuration"));
const [lib] = [require(path.join(__dirname,"..","lib"))];
const {dialog}=require('electron').remote;
const addon=require(`${__dirname}/../Interface/EnvConfigPluginNode`);
const core = require('../bin/core');
let [user]=[core.readJson(`${__dirname}/../../../../pid`)];

//流程ip地址
const local_process_host=myConfig.pro_ip;
//个性化工具ip地址
const local_tool_host=myConfig.tool_ip;
/*用户ID*/
var user_ID = user.user._id;
/*流程数组对象*/
var pr = [];
/*流程步骤对象*/
var data = {};
//左键在中间创建步骤，被点击的临时当前序号
var step_index = 0;
//左键在中间创建步骤，临时添加的步骤序号
var add_step_num = 0;
//是否为中途创建
var is_mid_Creater = false;
//是否为父流程
var isParent = false;
//中途删除，要删除的序号
var mid_delete = 0;
/*步骤类型临时数组*/
var temp_arrayData = [];
/*查询到的聚合信息数据*/
var juhe_Data = [];
/*全局此用户流程数据*/
var global_datas = [];
//编辑此流程的流程ID
var process_id = 0;
//临时编辑流程的数据
var update_process_data = {};


/***************************************************************************初始化**********************************************/

/********************************线程方法，初始方法*******************************************/


//窗口
let _Window = (data) => {
    ipcrendererupdate.send("system", {
        tacticBlock : data,
        _win:"updateProFrameWindow"
    });
}
//窗口最小、最大、还原、关闭
let closeWindow = () => {
    _Window("closeWindow");
}
let minWindow = () => {
    _Window("miniWindow");
}

/********************************线程方法*******************************************/


/********************************初始化加载页面数据*************************************************************************/
/*初始化加载页面数据*/
$(function () {

    let prourl = location.href;
    let tmp = prourl.split("?")[1];
    process_id = tmp.split("=")[1];

    console.log(process_id);
    console.log(user_ID);


    /*获取数据*/
    $.ajax({
        url: "http://"+local_process_host+"/api/process/process/read?userId=" + user_ID,
        type: "GET",
        dataType: "json",
        success: function (getdata) {
            global_datas = getdata;
            updatePro(getdata);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*若报错，或没有数据则加载空白流程页面*/
            /* loadingEmpty();*/
        }
    });




});

/*编辑流程*/
function updatePro(getdata) {
//根据proid找到对应流程内容
    for (var i = 0; i < getdata.length; i++) {
        if (getdata[i].processId == process_id) {
            pr = getdata[i].json;
            update_process_data = getdata[i];
            break;
        }
    }
//初始化页面
    var sing_h = "";
    console.log(pr);
    for (var i = 0; i < pr.length; i++) {
        sing_h += '<div id="pro_step_id_'+ pr[i].num +'" class="proo_box_cont proo_box_cont_' + pr[i].type + ' ">\
            <span>' + pr[i].num+ '</span>\
            </div>';
    }

    $('.proo_main_create').html(sing_h);
    //初始化数据pr
    $(".select_img").attr("src", update_process_data.icon);
    $('.select_icon_span').html("");
    $('.save_icon').removeClass('to-block');
    $('.select_icon').removeClass('to-none');
    $('#pro_name').val(update_process_data.proName);

    /*右键功能，外层*/
    $(".proo_main_create .proo_box_cont").mousedown(function (e) {

        if (e.which === 3) {

            var _this = this;
            step_index = $(_this).find("span").html();

            $(_this).contextMenu('sysMenu',
                {
                    bindings: {
                        /*新建步骤*/
                        'Li1': function (Item) {
                            $(_this).unbind('click');
                            add_new_pro_step();
                            is_mid_Creater = true;
                        },
                        /*删除*/
                        'Li2': function (Item) {
                            $(_this).unbind('click');

                            if ($('.leixing').hasClass("to-block") && data.content == "" && !$(_this).hasClass('selected_step')) {
                                $.MsgBox.Alert('温馨提示','请先完成此次步骤再添加！');
                                return;
                            } else{
                                clear();
                                delete_pro_step();
                            }
                        }
                    }
                }
            )
        }
    });


    /*中间删除步骤*/
    function delete_pro_step(para) {

        //如果是在中间点击创建
        //新创建一个PR
        var pr_tem = [];

        mid_delete = parseInt(step_index) -parseInt(1);

        for (let i = 0; i < mid_delete ; i++) {
            pr_tem.push(pr[i]);
        }

        for(let i=step_index; i<pr.length; i++) {
            pr[i].num --;
            pr_tem.push(pr[i]);
        }
        let sing_h = "";
        for (let i = 0; i < pr_tem.length; i++) {
            sing_h += '<div id="pro_step_id_'+ pr_tem[i].num +'" class="proo_box_cont proo_box_cont_' + pr_tem[i].type + '">' +
                '<span >' + pr_tem[i].num + '</span>' +
                '</div>';
        }
        $(".proo_main_create").html(sing_h);

        pr = pr_tem;

        //初始化页面与数据
        $('.pro_type').removeClass('to-block');

        /*右键功能，里层*/
        $(".proo_main_create .proo_box_cont").mousedown(function (e) {

            if (e.which === 3) {

                var _this = this;
                step_index = $(_this).find("span").html();


                $(_this).contextMenu('sysMenu',
                    {
                        bindings: {
                            /*新建步骤*/
                            'Li1': function (Item) {
                                $(_this).unbind('click');
                                add_new_pro_step();
                                is_mid_Creater = true;
                            },
                            /*删除*/
                            'Li2': function (Item) {
                                $(_this).unbind('click');
                                if ($('.leixing').hasClass("to-block") && data.content == "" && !$(_this).hasClass('selected_step')) {
                                    $.MsgBox.Alert('温馨提示','请先完成此次步骤再添加！');
                                    return;
                                } else{
                                    clear();
                                    delete_pro_step();
                                }
                            }
                        }
                    }
                )
            }
        });
    }


    /*本地应用右键功能*/
/*    $(".localapp_youjian").mousedown(function (e) {

        if (e.which === 3) {

            var _this = this;
            var localappname = $(_this).find("span").attr('class');

            $(_this).contextMenu('sysMenu2',
                {

                    bindings: {
                        /!*删除*!/
                        'Li11': function (Item) {
                            $(_this).unbind('click');
                            addon.EnvCfgDeleteProcessApp(localappname);
                            init_localapp();
                        }
                    }
                }
            )
        }
    });*/

}



/*加载搜索、我的存储、社交群数据页面*/
function init_search_page(getdata) {
    /*加载我的应用数据*/
    var searchdatas = JSON.parse(getdata);

    for(var item in searchdatas.result) {
        if(searchdatas.result[item].name == "My Research"){
            $(".load_search").html('<li class="runpro" id="' + searchdatas.result[item]._id + '">' +
                '<img src="' + searchdatas.result[item].icon + '">' +
                '<span class="normal_span" id="' + searchdatas.result[item].version + '">' + searchdatas.result[item].name + '</span>' +
                '<i></i>' +
                '</li>');

        } else if(searchdatas.result[item].name == "My Storage") {
            $(".load_mystorage").html('<li class="runpro" id="' + searchdatas.result[item]._id + '">' +
                '<img src="' + searchdatas.result[item].icon + '">' +
                '<span class="normal_span" id="' + searchdatas.result[item].version + '">' + searchdatas.result[item].name + '</span>' +
                '<i></i>' +
                '</li>');
        } else if(searchdatas.result[item].name == "My Social") {
            $(".load_socialgroup").html('<li class="runpro" id="' + searchdatas.result[item]._id + '">' +
                '<img src="' + searchdatas.result[item].icon + '">' +
                '<span class="normal_span" id="' + searchdatas.result[item].version + '">' + searchdatas.result[item].name + '</span>' +
                '<i></i>' +
                '</li>');
        }
    }
    if($(".load_search").html() == "") {
        $(".load_search").html('<li>' +
            '<img src="images/delete.png">' +
            '<span >未找到应用请先至市场下载</span>' +
            '</li>');
    }
    if($(".load_socialgroup").html() == "") {
        $(".load_socialgroup").html('<li>' +
            '<img src="images/delete.png">' +
            '<span >未找到应用请先至市场下载</span>' +
            '</li>');
    }
    if($(".load_mystorage").html() == "") {
        $(".load_mystorage").html('<li>' +
            '<img src="images/delete.png">' +
            '<span >未找到应用请先至市场下载</span>' +
            '</li>');
    }

    /*创建选择搜索、社交群、我的存储页面*/
    $(".spaces_box_type.add_search,.spaces_box_type.add_socialgroup,.spaces_box_type.add_mystorage").each(function () {

        var i = $(this);
        var p = i.find("ul>li");

        p.click(function () {
            let markapp_name = $(this).find('span').text();
            let markapp_img = $(this).find('img').attr('src');
            let markapp_content = $(this).attr('id');
            let markapp_version = $(this).find('span').attr('id');

            var markApp = {};
            markApp.name = markapp_name;
            markApp.icon = markapp_img;
            markApp.version = markapp_version;
            markApp.content = markapp_content;
            if (!!$(this).hasClass("selected")) {
                $(this).removeClass("selected");
                removeByValue(temp_arrayData, markApp.name);
            } else {
                $(this).addClass("selected");
                temp_arrayData.push(markApp);
            }

            /*保存此时流程*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*保存此时流程*/
        })
    });
}

/*加载我的应用数据*/
function init_markapp_page(getdata) {
    /*加载我的应用数据*/
    var markapp = JSON.parse(getdata);

    console.log(markapp);
    console.log(markapp.result[0]._id);
    var markapp_h = "";
    for (let i = 0; i < markapp.result.length; i++) {
        markapp_h += '<li class="runpro" id="' + markapp.result[i]._id + '">\
                            <img src="' + markapp.result[i].icon + '">\
                            <span class="normal_span" id="' + markapp.result[i].version + '">' + markapp.result[i].name + '</span>\
                            <i></i>\
                            </li>';
    }
    $('.load_appmarket').html(markapp_h);

    /*创建选择我的应用页面*/
    $(".spaces_box_type.add_appmarket").each(function () {

        var i = $(this);
        var p = i.find("ul>li");

        p.click(function () {
            let markapp_name = $(this).find('span').text();
            let markapp_img = $(this).find('img').attr('src');
            let markapp_content = $(this).attr('id');
            let markapp_version = $(this).find('span').attr('id');

            var markApp = {};
            markApp.name = markapp_name;
            markApp.icon = markapp_img;
            markApp.version = markapp_version;
            markApp.content = markapp_content;
            if (!!$(this).hasClass("selected")) {
                $(this).removeClass("selected");
                removeByValue(temp_arrayData, markApp.name);
            } else {
                $(this).addClass("selected");
                temp_arrayData.push(markApp);
            }

            /*保存此时流程*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*保存此时流程*/
        })
    });
}

/*加载个性化流程数据*/
function init_process_page() {
    /*加载个性化流程数据*/
    var prodata = global_datas;
    var sing_h = "";
    for (let i = 0; i < prodata.length; i++) {
        if(prodata[i].isParent == false) {
            sing_h += '<li class="runpro" id="' + prodata[i].processId + '">\
                            <img src="' + prodata[i].icon + '">\
                            <span class="normal_span">' + prodata[i].proName + '</span>\
                            <i></i>\
                            </li>';
        }
    }
    $('.load_had_process').html(sing_h);

    /*创建选择个性化流程页面*/
    $(".spaces_box_type.select_process").each(function () {

        var i = $(this);
        var p = i.find("ul>li");

        p.click(function () {

            var select_prodata = [];
            var prcess_id = $(this).attr('id');

            for (let i = 0; i < prodata.length; i++) {
                if (prcess_id == prodata[i].processId) {
                    select_prodata = prodata[i].json;
                    data.name =  prodata[i].proName;
                    break;
                }
            }

            var content = [];

            for (let j = 0; j < select_prodata.length; j++) {
                //小步骤对象
                var sm_data = {};
                var sm_data_content = [];
                sm_data.name = select_prodata[j].name;
                sm_data.type = select_prodata[j].type;
                if(select_prodata[j].type == 1) {
                    sm_data_content = select_prodata[j].content;
                } else if(select_prodata[j].type == 5){
                    for (let k = 0; k < select_prodata[j].content.length; k++) {
                        var sm_con = {};
                        sm_con.exePath = select_prodata[j].content[k].exePath;
                        sm_con.iconPath = select_prodata[j].content[k].iconPath;
                        sm_con.name = select_prodata[j].content[k].name;
                        sm_data_content.push(sm_con);
                    }
                } else if(select_prodata[j].type == 7) {
                    for (let k = 0; k < select_prodata[j].content.length; k++) {
                        var sm_con = {};
                        sm_con.juheHeight = select_prodata[j].content[k].juheHeight;
                        sm_con.juheId = select_prodata[j].content[k].juheId;
                        sm_con.juheLeft = select_prodata[j].content[k].juheLeft;
                        sm_con.juheName = select_prodata[j].content[k].juheName;
                        sm_con.juheTop = select_prodata[j].content[k].juheTop;
                        sm_con.juheUrl = select_prodata[j].content[k].juheUrl;
                        sm_con.juheWidth = select_prodata[j].content[k].juheWidth;
                        sm_con.scrolleft = select_prodata[j].content[k].scrolleft;
                        sm_con.scroltop = select_prodata[j].content[k].scroltop;
                        sm_con.userId = select_prodata[j].content[k].userId;
                        sm_data_content.push(sm_con);
                    }
                }else {
                    for (let k = 0; k < select_prodata[j].content.length; k++) {
                        var sm_con = {};
                        sm_con.img = select_prodata[j].content[k].img;
                        sm_con.name = select_prodata[j].content[k].name;
                        sm_con.content = select_prodata[j].content[k].content;
                        sm_data_content.push(sm_con);
                    }
                }
                sm_data.content = sm_data_content;
                content.push(sm_data);
            }

            if (!!$(this).hasClass("selected")) {
                $(this).removeClass("selected");
                content = [];
            } else {
                $(this).addClass("selected").siblings("li").removeClass("selected");
                temp_arrayData.push(content);
            }

            /*保存此时流程*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*保存此时流程*/
        })
    });
}


/*加载个性工具页面*/
function init_tool_page(getdata) {
    /*加载个性工具页面*/
    var tooldata = getdata;
    var tooldata_tem = [];
    let tool_html = "";
    for (let i = 0; i < tooldata.length; i++) {
        tooldata[i].iconUrl='http://'+local_tool_host+'/api/public/attachment/download?id='+tooldata[i].iconUrlId;
        tool_html += '<li class='+i+' id=' + tooldata[i]._id + ' ' + 'exePath=' + tooldata[i].exePath + ' '+'appName='+tooldata[i].appName+' '+'cfgName='+tooldata[i].cfgName+' '+'configPath='+tooldata[i].configPath+'>\
                            <img src="' + tooldata[i].iconUrl+ '">\
                            <span>' + tooldata[i].cfgName + '</span>\
                            <i></i>\
                            </li>';

        var content = {};
        content.appName = tooldata[i].appName;
        content.exePath = tooldata[i].exePath;
        content.cfgName = tooldata[i].cfgName;
        content.configPath = tooldata[i].configPath;
        tooldata_tem.push(content);
    }

    $('.load_had_tool').html(tool_html);

    if($(".load_had_tool").html() == "") {
        $(".load_had_tool").html('<li>' +
            '<img src="images/delete.png">' +
            '<span >请先至个性化工具应用制作！</span>' +
            '</li>');
    }

    /*创建选择个性化工具页面*/
    $(".spaces_box_type.select_tool").each(function () {

        var i = $(this);
        var p = i.find("ul>li");

        p.click(function () {
            let tool_name = $(this).find('span').text();
            let tool_img = $(this).find('img').attr('src');
            let class_num = $(this).attr("class");

            var tool = {};
            tool.name = tool_name;
            tool.img = tool_img;
            tool.content = tooldata_tem[class_num];
            if (!!$(this).hasClass("selected")) {
                $(this).removeClass("selected");
                removeByValue(temp_arrayData, tool.name);
            } else {
                $(this).addClass("selected");
                temp_arrayData.push(tool);
            }

            /*保存此时流程*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*保存此时流程*/
        })
    });
}

/*显示已有聚合信息*/
function init_hadJuhe(user_ID) {

    $.ajax({
        url: "http://"+local_process_host+"/api/process/Polymer/read?userId=" + user_ID,
        type: "GET",
        dataType: "json",
        success: function (getdata) {
            juhe_Data = getdata;
            /*加载页面*/
            /*已有聚合信息初始化加载页面*/
            init_hadJuhe_page(getdata);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*若报错，或没有数据则加载空白流程页面*/
            /* loadingEmpty();*/
        }
    });

}

/*已有聚合信息初始化加载页面*/
function init_hadJuhe_page(getdata) {
    /*获取数据*/
    if (getdata.length > 0) {
        let _h = ""
        for (let i = 0; i < getdata.length; i++) {
            _h += '<li><i  draggable="true" ondragstart="drag(event)">' + getdata[i].juheName + '</i></li>';
        }
        $('.had_juhe_ul').html(_h);
    }
}

function init_type2_tool() {
    /*获取个性化工具数据*/
    $.ajax({
        url: "http://"+local_tool_host+"/api/individuation/individuation/read?userId=" + user_ID,
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        success: function (data) {
            init_tool_page(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

/*应用市场数据初始化*/
function init_search_data() {
    //个人应用列表
    lib.netRequest.accessMaster({
        method: "GET",
        path:"/user/personal/appList"
    },function(err,data){
        console.log(data);
        init_search_page(data);
    });
}

/*应用市场数据初始化*/
function init_markapp_data() {
    //个人应用列表
    lib.netRequest.accessMaster({
        method: "GET",
        path:"/user/personal/appList"
    },function(err,data){
        console.log(data);
        init_markapp_page(data);
    });
}

/********************************初始化加载页面数据*************************************************************************/

/*选择类型*/
$('#add_type_step li').click(function () {
    var id_num = $(this).attr("id");
    var type_name = $(this).find('span').text();
    $('.pro_type').removeClass('to-block');
    $("#type" + id_num).addClass('to-block');
    /*不同类型，初始化不同数据*/
    if(id_num == 1) {                /*打开网址*/
        $('.list_box input').val("www.baidu.com");
    } else if (id_num == 2){        /*个性化工具*/
        init_type2_tool();
    } else if (id_num == 3){        /*个性化流程*/
        init_process_page();
    } else if (id_num == 4){        /*搜索*/
        init_search_data();
    } else if (id_num == 5){        /*本地应用*/
        init_localapp();
    } else if (id_num == 6){        /*应用市场*/
        init_markapp_data();
    } else if (id_num == 7){        /*聚合信息*/
        init_hadJuhe(user_ID);
    } else if (id_num == 8){        /*社交群*/
        init_search_data();
    } else if (id_num == 9){        /*我的存储*/
        init_search_data();
    }

    data.name = type_name;
    data.type = id_num;

    /*查看pr里有多少步了*/
    var order_step = pr.length + 1;

    /*如果是在最后一行点击的创建，或者直接点击的添加*/
    if (!is_mid_Creater) {

        data.num = pr.length + 1;
        data.content = "";

        $(".proo_main_create").find('div').removeClass('selected_step');
        $(".proo_main_create").append('<div id="pro_step_id_'+ order_step +'" class="proo_box_cont proo_box_cont_' + id_num + ' selected_step">' +
            '<span>' + order_step + '</span>' +
            '</div>');

        pr.push(data);
    } else {
        //如果是在中间点击创建
        //新创建一个PR
        var pr_tem = [];
        /*如果是中间，创建*/
        /*流程内容第一部分，创建前面的部分*/
        for (let i = 0; i < step_index; i++) {
            pr_tem.push(pr[i]);
        }

        /*流程内容第二部分，即新增加部分*/
        add_step_num = parseInt(step_index) +parseInt(1);

        data.num = add_step_num;
        data.content = "";
        pr_tem.push(data);


        /*流程内容第三部分，即创建后面的部分*/
        for(let i=step_index; i<pr.length; i++) {
            pr[i].num ++;
            pr_tem.push(pr[i]);
        }
        let sing_h = "";
        for (let i = 0; i < pr_tem.length; i++) {
            sing_h += '<div id="pro_step_id_'+ pr_tem[i].num +'" class="proo_box_cont proo_box_cont_' + pr_tem[i].type + '">' +
                '<span>' + pr_tem[i].num + '</span>' +
                '</div>';
        }
        $(".proo_main_create").html(sing_h);
        $(".proo_main_create div[id='pro_step_id_"+add_step_num+"']").addClass('selected_step');

        pr = pr_tem;
    }

    /*中间删除步骤*/
    function delete_pro_step(para) {

        //如果是在中间点击创建
        //新创建一个PR
        var pr_tem = [];

        mid_delete = parseInt(step_index) -parseInt(1);

        for (let i = 0; i < mid_delete ; i++) {
            pr_tem.push(pr[i]);
        }

        for(let i=step_index; i<pr.length; i++) {
            pr[i].num --;
            pr_tem.push(pr[i]);
        }
        let sing_h = "";
        for (let i = 0; i < pr_tem.length; i++) {
            sing_h += '<div id="pro_step_id_'+ pr_tem[i].num +'" class="proo_box_cont proo_box_cont_' + pr_tem[i].type + '">' +
                '<span >' + pr_tem[i].num + '</span>' +
                '</div>';
        }
        $(".proo_main_create").html(sing_h);

        pr = pr_tem;

        //初始化页面与数据
        $('.pro_type').removeClass('to-block');

        /*右键功能，里层*/
        $(".proo_main_create .proo_box_cont").mousedown(function (e) {

            if (e.which === 3) {

                var _this = this;
                step_index = $(_this).find("span").html();


                $(_this).contextMenu('sysMenu',
                    {
                        bindings: {
                            /*新建步骤*/
                            'Li1': function (Item) {
                                $(_this).unbind('click');
                                add_new_pro_step();
                                is_mid_Creater = true;
                            },
                            /*删除*/
                            'Li2': function (Item) {
                                $(_this).unbind('click');
                                if ($('.leixing').hasClass("to-block") && data.content == "" && !$(_this).hasClass('selected_step')) {
                                    $.MsgBox.Alert('温馨提示','请先完成此次步骤再添加！');
                                    return;
                                } else{
                                    clear();
                                    delete_pro_step();
                                }
                            }
                        }
                    }
                )
            }
        });
    }

    /*右键功能，外层*/
    $(".proo_main_create .proo_box_cont").mousedown(function (e) {

        if (e.which === 3) {

            var _this = this;
            step_index = $(_this).find("span").html();

            $(_this).contextMenu('sysMenu',
                {
                    bindings: {
                        /*新建步骤*/
                        'Li1': function (Item) {
                            $(_this).unbind('click');
                            add_new_pro_step();
                            is_mid_Creater = true;
                        },
                        /*删除*/
                        'Li2': function (Item) {
                            $(_this).unbind('click');

                            if ($('.leixing').hasClass("to-block") && data.content == "" && !$(_this).hasClass('selected_step')) {
                                $.MsgBox.Alert('温馨提示','请先完成此次步骤再添加！');
                                return;
                            } else{
                                clear();
                                delete_pro_step();
                            }
                        }
                    }
                }
            )
        }
    });
});


/*右键功能，外层 外外外层*/
$(".proo_main_create .proo_box_cont").mousedown(function (e) {

    if (e.which === 3) {

        var _this = this;
        step_index = $(_this).find("span").html();

        $(_this).contextMenu('sysMenu',
            {
                bindings: {
                    /*新建步骤*/
                    'Li1': function (Item) {
                        $(_this).unbind('click');
                        add_new_pro_step();
                        is_mid_Creater = true;
                    },
                    /*删除*/
                    'Li2': function (Item) {
                        $(_this).unbind('click');
                        if ($('.leixing').hasClass("to-block") && data.content == "" && !$(_this).hasClass('selected_step')) {
                            $.MsgBox.Alert('温馨提示','请先完成此次步骤再添加！');
                            return;
                        } else{
                            clear();
                            delete_pro_step();
                        }
                    }
                }
            }
        )
    }
});


/*点击添加按钮事件*/
$('.proo_box_add').on('click', function (event) {
    event.preventDefault();

    /*每点击一次添加步骤按钮，临时步骤初始化为1，如果不为1，让step+temp_step*/
    add_new_pro_step();

});
/*每点击一次添加步骤按钮，临时步骤初始化为1，如果不为1，让step+temp_step*/
function add_new_pro_step() {
    if ($('.leixing').hasClass("to-block")) {
        if (data.name != "" && data.content.length != 0 || temp_arrayData.length != 0 ) {
            clear();
        } else {
            $.MsgBox.Alert('温馨提示','请先完成此次步骤再添加！');
            return;
        }
    } else {
        $('.pro_type').addClass('to-block');
    }
}

/*保存步骤*/
$('.save_img').click(function () {

    if ($('.leixing').hasClass("to-block")) {
        if (data.name != "" && data.content.length != 0 || temp_arrayData.length != 0) {
            chanellei_addsave();
        } else {
            $.MsgBox.Alert('温馨提示','请先完成此次步骤再保存！');
            return;
        }
    } else if (pr != "" || temp_arrayData.length != 0) {
        $('.pro_type').removeClass('to-block');
        $('.pro_save').addClass('to-block');
        $('.save_icon').removeClass('to-block');
        $('.select_icon').removeClass('to-none');
    } else {
        $.MsgBox.Alert('温馨提示','请先添加步骤再保存！');
        return;
    }
});


/*保存流程*/
$('.save_pro').click(function () {
    var img = $('.select_img').attr('src');
    var name = $('#pro_name').val();
    var html_span = $('.select_icon_span').html();

    for(let i=0;i<pr.length;i++) {
        if (pr[i].type == 3) {
            isParent = true;
        }
    }

    /*创建generator，使其顺序执行*/
    var compute = function * () {
        ipcrendererupdate.send('loadingIndexPage');
        closeWindow();
        isParent = false;
    }
    var generator = compute();


    if (html_span == "" && name != "") {
        var rg = /^[a-zA-Z0-9\u4E00-\u9FA5\.\+\-\_]{1,12}$/;
        if (rg.test(name)) {
            for(let i=0;i<global_datas.length;i++) {
                if (name == global_datas[i].proName && name != update_process_data.proName) {
                    $.MsgBox.Alert('温馨提示','此名称已存在！请重新填写');
                    break;
                }
                if(i==global_datas.length-1) {
                    var data2 = {
                        processId: process_id,
                        icon: img,
                        name: name,
                        isParent: isParent,
                        json: pr
                    }
                    console.log(data2);
                    var data1 = JSON.stringify(data2);
                    console.log(data1);
                    $.ajax({
                        url: "http://"+local_process_host+"/api/process/process/update",
                        data: data1,
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        success: function (getdata) {
                            /*创建成功执行方法*/
                            generator.next();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            /*加载空白流程页面*/
                            console.log("编辑流程失败");
                        }
                    });
                }
            }
        } else {
            $.MsgBox.Alert('温馨提示','名字不能为空且字符长度1-12位之间');
            return;
        }

    } else {
        $.MsgBox.Alert('温馨提示','请先确定图标和流程名称！');
        return;
    }
});



/***************************模块方法------------打开网址********************************************************************/
//查看效果
$('.url_box .list_box a').click(function () {
    $('.load').removeAttr('style');
    var src = $(this).siblings('input').val()
    if (src != "") {
        $('.loading').css('display', 'block');
        src = /^http.+/.test(src) ? src : "http://" + src;
        $('.url_box iframe').attr("src", src);
        $('.url_box iframe').load(function () {
            $('.load').css('display', 'block');
            $('.loading').removeAttr('style');
        })
        data.content = src;
    }
    if(!is_mid_Creater) {
        pr[pr.length-1].content = data.content;
    } else {
        pr[step_index].content = data.content;
    }

});

//关闭窗口
$('.type_close').on('click', function (event) {
    $('.pro_type').removeClass('to-block');
});
//ESC关闭窗口
$(document).keyup(function (event) {
    if (event.which == '27') {
        $('.pro_type').removeClass('to-block');
    }
});

//回车看效果
$(document).keydown(function (e) {
    if (e.keyCode == 13) {
        $('.url_box .list_box a').click();
    }
});

/***************************模块方法------------打开网址*************************************************************************/


/************************模块方法之------本地应用**********************************************************************************/


/*显示创建的本地应用*/
function init_localapp() {

    //获取可profile(EnvCfgSupportProfileList)
    let [Bottom_data]=[addon.EnvCfgProcessAppList()];

    Bottom_data = JSON.parse(Bottom_data);
    //把可profile的显示到页面上
    //此处为空，明天问下
    let sing_h = "";
    for (let i in Bottom_data) {

        var prourl = Bottom_data[i].appName;
        var appname = prourl.split(".")[0];

        sing_h += '<li class="' + Bottom_data[i].exePath + ' localapp_youjian">\
                      <img src="' + Bottom_data[i].iconPath + '">\
                     <span class="'+prourl+'">' + appname + '</span>\
                     <i></i>\
                 </li>';
    }
    sing_h += '<li class="li_add_localapp"><img src="images/add1.png"><span>添加本地应用</span></li>';
    $('.load_localapp').html(sing_h);


    /*创建本地应用步骤点击事件*/
    $(".spaces_box_type.add_localapp").each(function () {
        var i = $(this);
        var p = i.find("ul>li").not(".li_add_localapp");
        var timer = null;

        p.click(function () {
            var localapp = {};
            localapp.name = $(this).find("span").html();
            localapp.exePath = $(this).attr('class');
            localapp.iconPath = $(this).find("img").attr('src');
            if (!!$(this).hasClass("selected")) {
                $(this).removeClass("selected");
                removeByValue(temp_arrayData, localapp.name);
            } else {
                $(this).addClass("selected");
                temp_arrayData.push(localapp);
            }
            /*保存此时流程*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*保存此时流程*/
        })

        p.bind("dblclick.a", function () { //双击事件
            var exepath = $(this).attr('class');
            clearTimeout(timer); //在双击事件中，先清除前面click事件的时间处理
            addon.EnvCfgSetupExe(exepath);
        })
    });

    /*本地应用右键功能*/
    $(".localapp_youjian").mousedown(function (e) {

        if (e.which === 3) {

            var _this = this;
            var localappname = $(_this).find("span").attr('class');

            $(_this).contextMenu('sysMenu2',
                {

                    bindings: {
                        /*删除*/
                        'Li11': function (Item) {
                            $(_this).unbind('click');
                            addon.EnvCfgDeleteProcessApp(localappname);
                            init_localapp();
                        }
                    }
                }
            )
        }
    });

    /*本地应用--添加应用*/
    $(".li_add_localapp").click(function () {
        dialog.showOpenDialog({
            title: "My_process",
            defaultPath: "d://",
            buttonLabel: "选择",
            //properties:["openDirectory","createDirectory","multiSelections"],
            filters: [
                {name: 'All Files', extensions: ['*']}
                //{name: 'Images', extensions: ['jpg', 'png', 'gif']},
                //{name: 'Movies', extensions: ['mkv', 'avi', 'mp4']},
                //{name: 'Custom File Type', extensions: ['as']}
            ]
        }, function (filename) {
            if(typeof(filename)!='undefined'){
                //调用手动添加未被扫描的profile接口方法
                addon.EnvCfgAddApp(String(filename),"","");
                /*刷新新添加的应用*/
                init_localapp();
            }
        })
    });

}
/************************模块方法之-----本地应用**************************************************************************/

/******************************************聚合信息JS**********************************************************/

let allowDrop = (ev)=> {
    ev.preventDefault();
}

let drag = (ev)=> {
    ev.dataTransfer.setData("Text", $(ev.target).text());
}

let shuArr = [];
let loaddata = (d)=> {
    let data = juhe_Data;
    let datas = {};
    shuArr.push(d);
    for (let i = 0; i < data.length; i++) {
        if (data[i].juheName == d) {
            datas = data[i];
            break;
        }
    }
    var margintop = parseInt(datas.juheTop) + parseInt(datas.scroltop);

    $('.iframeAddJuhe').append('<div class="iframeBox" style="width:' + datas.juheWidth + 'px;height:' + datas.juheHeight + 'px;">' +
        '<iframe class="scroll" style="display:none;margin:-' + datas.juheTop + 'px 0px 0px -' + datas.juheLeft + 'px;" src="' + datas.juheUrl + '" frameborder="0" name="' + d + '" width="900px" height="600px"></iframe>' +
        '</div>')
    $('.iframeBox iframe[name=' + d + ']').load(function () {
        $(this).css({'marginTop': -margintop, height: $(this).contents().find('html').get(0).scrollHeight});
        $(this).contents().find('body,html').scrollLeft(datas.scrolleft);
        $(this).css('display', 'block');
        $('.loading').css('display', 'none');
    });

    temp_arrayData.push(datas);

    /*保存此时流程*/
    if(!is_mid_Creater) {
        data.content = temp_arrayData;
        pr[pr.length-1].content = data.content;
    } else {
        data.content = temp_arrayData;
        pr[step_index].content = data.content;
    }
    /*保存此时流程*/
}
let drop = (ev)=> {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("Text");
    loaddata(data);
    $('.loading').css('display', 'block');
}

/*删除聚合源*/

let drop_delete = (ev)=> {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("Text");

    delete_juhe(data);
}

let delete_juhe = (d)=> {

    if(confirm("确定删除此聚合源吗？")) {
        var juhename = d;

        $.ajax({
            url: "http://"+local_process_host+"/api/process/Polymer/destroy",
            data: {
                juheName: juhename,
            },
            type: "POST",
            dataType: "json",
            success: function (getdata) {
                /*加载页面*/
                init_hadJuhe(user_ID);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                /*加载空白流程页面*/
                console.log("删除聚合信息失败");
            }
        });
    } else{
    }
}
/******************************************聚合信息JS**********************************************************/




/*****************************************************************************单击方法**************************************/
/*打开选择图标*/
$('.select_img').click(function () {
    $('.select_icon').addClass('to-none');
    $('.save_icon').addClass('to-block');
});

/*图标选择li*/
$(".save_icon  li").click(function () {
    var num = $(this).index() + 1;
    $(".select_img").attr("src", 'images/icon/icon' + num + '.png');
    $('.select_icon_span').html("");
    $('.save_icon').removeClass('to-block');
    $('.select_icon').removeClass('to-none');
})

/*取消保存流程*/
$('.cancel_pro').click(function () {
    $('.pro_save').removeClass('to-block');
    $('.pro_type').removeClass('to-block');
    $('.save_icon').removeClass('to-block');
    $('.load').removeAttr('style').find('iframe').attr('src', "");
    $('.list_box input').val("");
    $('.searce_center').html("");
    $('.spaces_box_type').find('li').removeClass('selected');
    data = {};
    temp_arrayData = [];
});


/*****************************************************************************单击方法**************************************/

/********************************************************************************************子方法*************************/
//删除数组里此元素
function removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

/*完成，保存，隐藏创建页面，显示保存页面*/
function chanellei_addsave() {
    $('.network,.process,.tool,.localapp,.search,.appmarket,.juhe,.socialgroup,.mystorage').removeClass('to-block');
    $('.save_icon').removeClass('to-block');
    $('.select_icon').removeClass('to-none');
    $('.pro_save').addClass('to-block');

}

/*完成一步清除*/
function clear() {
    $('.network,.process,.tool,.localapp,.search,.appmarket,.juhe,.socialgroup,.mystorage').removeClass('to-block');
    $('.pro_type').addClass('to-block');
    $('.load').removeAttr('style').find('iframe').attr('src', "");
    $('.list_box input').val("");
    $('.searce_center').html("");
    $('.spaces_box_type').find('li').removeClass('selected');
    data = {};
    temp_arrayData = [];
    is_mid_Creater = false;
    $('.iframeBox').removeAttr('style').find('iframe').attr('src', "");
}


/*创建聚合信息*/
function add_juhe_span() {
    ipcrendererupdate.send('createJuheWindow', "","addJuheInfo");
}


/*通知更新聚合信息*/
ipcrendererupdate.on('newJuhe',(event)=>{
    init_hadJuhe(user_ID);
});

/********************************************************************************************子方法*************************/