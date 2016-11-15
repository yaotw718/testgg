/***************************************************************************��ʼ��**********************************************/
/*��Ⱦ����2*/
const ipcrenderer = require('electron').ipcRenderer;
const [path, Electron] = [require("path"), require("electron")];
const myConfig = require(path.join(__dirname,"..", "configuration"));
const [lib] = [require(path.join(__dirname,"..","lib"))];
const {dialog}=require('electron').remote;
const addon=require(`${__dirname}/../Interface/EnvConfigPluginNode`);
//����ip��ַ
const local_process_host=myConfig.pro_ip;
//���Ի�����ip��ַ
const local_tool_host=myConfig.tool_ip;
/*�û�ID*/
var user_ID;
/*�����������*/
var pr = [];
/*���̲������*/
var data = {};
//�Ҽ����м䴴�����裬���������ʱ��ǰ���
var step_index = 0;

//�Ƿ�Ϊ��;����
var is_mid_Creater = false;
//�Ƿ�Ϊ������
var isParent = false;
//��;ɾ����Ҫɾ�������
var mid_delete = 0;
/*����������ʱ����*/
var temp_arrayData = [];
/*��ѯ���ľۺ���Ϣ����*/
var juhe_Data = [];
/*ȫ�ִ��û���������*/
var global_datas = [];
/*�༭�ĵ�ǰ�������*/
var update_step_index = 0;
/*��ǰ�����Ƿ�Ϊ�������༭*/
var is_update_step = false;
/*����DIV����*/
var divDatas = [];
/*����DIV������*/
var stepData = {};

/***************************************************************************��ʼ��**********************************************/

/********************************�̷߳�������ʼ����*******************************************/


//����
let _Window = (data) => {
    ipcrenderer.send("system", {
        tacticBlock : data,
        _win:"contextFrameWindow"
    });
}
//������С����󡢻�ԭ���ر�
let closeWindow = () => {
    _Window("closeWindow");
}
let minWindow = () => {
    _Window("miniWindow");
}

/********************************�̷߳���*******************************************/


/********************************��ʼ������ҳ������*************************************************************************/
/*��ʼ������ҳ������*/
$(function () {

    let prourl = location.href;
    let tmp = prourl.split("?")[1];
    user_ID = tmp.split("=")[1];
    $('.pro_type').addClass('to-block');

    /*��ȡ����*/
    $.ajax({
        url: "http://"+local_process_host+"/api/process/process/read?userId=" + user_ID,
        type: "GET",
        dataType: "json",
        success: function (getdata) {
            console.log(getdata);
            global_datas = getdata;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*��������û����������ؿհ�����ҳ��*/
            /* loadingEmpty();*/
        }
    });

});

/*�����������ҵĴ洢���罻Ⱥ����ҳ��*/
function init_search_page(getdata) {
    /*�����ҵ�Ӧ������*/
    console.log(getdata);
    var searchdatas = JSON.parse(getdata);
    console.log(searchdatas);
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
            '<span >δ�ҵ�Ӧ���������г�����</span>' +
            '</li>');
    }
    if($(".load_socialgroup").html() == "") {
        $(".load_socialgroup").html('<li>' +
            '<img src="images/delete.png">' +
            '<span >δ�ҵ�Ӧ���������г�����</span>' +
            '</li>');
    }
    if($(".load_mystorage").html() == "") {
        $(".load_mystorage").html('<li>' +
            '<img src="images/delete.png">' +
            '<span >δ�ҵ�Ӧ���������г�����</span>' +
            '</li>');
    }

    /*����ѡ���������罻Ⱥ���ҵĴ洢ҳ��*/
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

            /*�����ʱ����*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*�����ʱ����*/
        })
    });
}

/*�����ҵ�Ӧ������*/
function init_markapp_page(getdata) {
    /*�����ҵ�Ӧ������*/
    console.log(getdata);
    var markapp = JSON.parse(getdata);
    console.log(markapp);
    var markapp_h = "";
    for (let i = 0; i < markapp.result.length; i++) {
        markapp_h += '<li class="runpro" id="' + markapp.result[i]._id + '">\
                            <img src="' + markapp.result[i].icon + '">\
                            <span class="normal_span" id="' + markapp.result[i].version + '">' + markapp.result[i].name + '</span>\
                            <i></i>\
                            </li>';
    }
    $('.load_appmarket').html(markapp_h);

    /*����ѡ���ҵ�Ӧ��ҳ��*/
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

            /*�����ʱ����*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*�����ʱ����*/
        })
    });
}

/*���ظ��Ի���������*/
function init_process_page() {
    /*���ظ��Ի���������*/
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

    /*����ѡ����Ի�����ҳ��*/
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
                //С�������
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
                }else if(select_prodata[j].type == 6||select_prodata[j].type == 4||select_prodata[j].type == 8||select_prodata[j].type == 9) {
                    for (let k = 0; k < select_prodata[j].content.length; k++) {
                        var sm_con = {};
                        sm_con.img = select_prodata[j].content[k].icon;
                        sm_con.name = select_prodata[j].content[k].name;
                        sm_con.content = select_prodata[j].content[k].content;
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

            /*�����ʱ����*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*�����ʱ����*/
        })
    });
}


/*���ظ��Թ���ҳ��*/
function init_tool_page(getdata) {
    /*���ظ��Թ���ҳ��*/
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
            '<span >������Ӹ��Ի����ߣ�</span>' +
            '</li>');
    }

    /*����ѡ����Ի�����ҳ��*/
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
            console.log(temp_arrayData);
            /* JSON.parse(jsonstr); //���Խ�json�ַ���ת����json����
             JSON.stringify(jsonobj); //���Խ�json����ת����json�Է��� */

            data.content = temp_arrayData;
            console.log(data);
            let pr_data = JSON.stringify(data);
            console.log(pr_data);
            console.log(JSON.parse(pr_data));

            $(".proo_main_create div.selected_step").attr("prDatas",pr_data);
            /*$(".proo_main_create div[id='pro_step_id_"+stepData.num+"']").attr("prDatas",pr_data);*/
            /*�����ʱ����*/
            /*   if(update_step_index == 0){
             data.content = temp_arrayData;
             } else {
             pr[update_step_index - 1].content = temp_arrayData;
             }*/
            /*console.log(data);*/
            /*�����ʱ����*/
        })
    });
}

/*��ʾ���оۺ���Ϣ*/
function init_hadJuhe(user_ID) {

    $.ajax({
        url: "http://"+local_process_host+"/api/process/Polymer/read?userId=" + user_ID,
        type: "GET",
        dataType: "json",
        success: function (getdata) {
            juhe_Data = getdata;
            /*����ҳ��*/
            /*���оۺ���Ϣ��ʼ������ҳ��*/
            init_hadJuhe_page(getdata);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*��������û����������ؿհ�����ҳ��*/
            /* loadingEmpty();*/
        }
    });
}

/*���оۺ���Ϣ��ʼ������ҳ��*/
function init_hadJuhe_page(getdata) {
    /*��ȡ����*/
    if (getdata.length > 0) {
        let _h = ""
        for (let i = 0; i < getdata.length; i++) {
            _h += '<li><i  draggable="true" ondragstart="drag(event)">' + getdata[i].juheName + '</i></li>';
        }
        $('.had_juhe_ul').html(_h);
    }
}

function init_type2_tool() {
    /*��ȡ���Ի���������*/
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

/*Ӧ���г����ݳ�ʼ��*/
function init_search_data() {
    //����Ӧ���б�
    lib.netRequest.accessMaster({
        method: "GET",
        path:"/user/personal/appList"
    },function(err,data){
        init_search_page(data);
    });
}

/*Ӧ���г����ݳ�ʼ��*/
function init_markapp_data() {
    //����Ӧ���б�
    lib.netRequest.accessMaster({
        method: "GET",
        path:"/user/personal/appList"
    },function(err,data){
        init_markapp_page(data);
    });
}

/********************************��ʼ������ҳ������*************************************************************************/

/*ѡ������*/
$('#add_type_step li').click(function () {
    var id_num = $(this).attr("id");
    var type_name = $(this).find('span').text();
    $('.pro_type').removeClass('to-block');
    $("#type" + id_num).addClass('to-block');
    /*��ͬ���ͣ���ʼ����ͬ����*/
    if(id_num == 1) {                /*����ַ*/
        $('.list_box input').val("www.baidu.com");
    } else if (id_num == 2){        /*���Ի�����*/
        init_type2_tool();
    } else if (id_num == 3){        /*���Ի�����*/
        init_process_page();
    } else if (id_num == 4){        /*����*/
        init_search_data();
    } else if (id_num == 5){        /*����Ӧ��*/
        init_localapp();
    } else if (id_num == 6){        /*Ӧ���г�*/
        init_markapp_data();
    } else if (id_num == 7){        /*�ۺ���Ϣ*/
        init_hadJuhe(user_ID);
    } else if (id_num == 8){        /*�罻Ⱥ*/
        init_search_data();
    } else if (id_num == 9){        /*�ҵĴ洢*/
        init_search_data();
    }

    /*�鿴divDatas���ж��ٲ���*/
    var order_step = divDatas.length + 1;

    data.name = type_name;
    data.type = id_num;
    data.content = "";

    stepData.num = order_step;
    stepData.type = id_num;

    /*����������һ�е���Ĵ���������ֱ�ӵ�������*/
    if (!is_mid_Creater) {

        $(".proo_main_create").find('div').removeClass('selected_step');
        $(".proo_main_create").append('<div prDatas="" onclick="update_step('+order_step+','+id_num+')" id="pro_step_id_'+ order_step +'" class="proo_box_cont proo_box_cont_' + id_num + ' selected_step">' +
            '<span>' + order_step + '</span>' +
            '</div>');

        divDatas.push(stepData);

    } else {
        //��������м�������
        //�´���һ��divDatas
        var div_tem = [];
        var step_data = {};
        /*������м䣬����*/
        console.log(divDatas);
        /*�������ݵ�һ���֣�����ǰ��Ĳ���*/
        for (let i = 0; i < step_index; i++) {
            divDatas[i].prdatas = JSON.parse($(".proo_main_create div[id='pro_step_id_"+divDatas[i].num+"']").attr("prDatas"));
            div_tem.push(divDatas[i]);
        }
        //�Ҽ����м䴴�����裬��ʱ��ӵĲ������
        var add_step_num = 0;

        /*�������ݵڶ����֣��������Ӳ���*/
        add_step_num = parseInt(step_index) +parseInt(1);

        step_data.num = add_step_num;
        step_data.type = id_num;
        step_data.prdatas = "";
        div_tem.push(step_data);


        /*�������ݵ������֣�����������Ĳ���*/
        for(let i=step_index; i<divDatas.length; i++) {
            divDatas[i].prdatas = JSON.parse($(".proo_main_create div[id='pro_step_id_"+divDatas[i].num+"']").attr("prDatas"));
            divDatas[i].num ++;
            div_tem.push(divDatas[i]);
        }
        let sing_h = "";
        for (let i = 0; i < div_tem.length; i++) {
            let div_string = JSON.stringify(div_tem[i].prdatas);
            sing_h += '<div prDatas="" onclick="update_step('+div_tem[i].num+','+div_tem[i].type+')" id="pro_step_id_'+ div_tem[i].num +'" class="proo_box_cont proo_box_cont_' + div_tem[i].type + '">' +
                '<span>' + div_tem[i].num + '</span>' +
                '</div>';
            $(".proo_main_create div[id='pro_step_id_"+div_tem[i].num+"']").attr("prDatas",div_string);
        }
        $(".proo_main_create").html(sing_h);
        $(".proo_main_create div[id='pro_step_id_"+add_step_num+"']").addClass('selected_step');

        divDatas = div_tem;
    }

    /*�м�ɾ������*/
    function delete_pro_step(para) {

        //��������м�������
        //�´���һ��PR
        var pr_tem = [];

        mid_delete = parseInt(step_index) -parseInt(1);

        for (let i = 0; i < mid_delete ; i++) {
            divDatas[i].prdatas = $(".proo_main_create div[id='pro_step_id_"+divDatas[i].num+"']").attr("prDatas");
            pr_tem.push(divDatas[i]);
        }

        for(let i=step_index; i<divDatas.length; i++) {
            divDatas[i].num --;
            divDatas[i].prdatas = $(".proo_main_create div[id='pro_step_id_"+divDatas[i].num+"']").attr("prDatas");
            pr_tem.push(divDatas[i]);
        }
        let sing_h = "";
        for (let i = 0; i < pr_tem.length; i++) {
            sing_h += '<div prDatas="'+pr_tem[i].prdatas+'" onclick="update_step('+pr_tem[i].num+','+pr_tem[i].type+')" id="pro_step_id_'+ pr_tem[i].num +'" class="proo_box_cont proo_box_cont_' + pr_tem[i].type + '">' +
                '<span >' + pr_tem[i].num + '</span>' +
                '</div>';
        }
        $(".proo_main_create").html(sing_h);

        divDatas = pr_tem;

        //��ʼ��ҳ��������
        $('.pro_type').removeClass('to-block');

        /*�Ҽ����ܣ����*/
        $(".proo_main_create .proo_box_cont").mousedown(function (e) {

            if (e.which === 3) {

                var _this = this;
                step_index = $(_this).find("span").html();

                $(_this).contextMenu('sysMenu',
                    {
                        bindings: {
                            /*�½�����*/
                            'Li1': function (Item) {
                                $(_this).unbind('click');
                                add_new_pro_step();
                                is_mid_Creater = true;
                            },
                            /*ɾ��*/
                            'Li2': function (Item) {
                                $(_this).unbind('click');
                                if ($('.leixing').hasClass("to-block") && data.content == "" && !$(_this).hasClass('selected_step')) {
                                    $.MsgBox.Alert('��ܰ��ʾ','������ɴ˴β�������ӣ�');
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

    /*�Ҽ����ܣ����*/
    $(".proo_main_create .proo_box_cont").mousedown(function (e) {

        if (e.which === 3) {

            var _this = this;
            step_index = $(_this).find("span").html();

            $(_this).contextMenu('sysMenu',
                {
                    bindings: {
                        /*�½�����*/
                        'Li1': function (Item) {
                            $(_this).unbind('click');
                            add_new_pro_step();
                            is_mid_Creater = true;
                        },
                        /*ɾ��*/
                        'Li2': function (Item) {
                            $(_this).unbind('click');

                            if ($('.leixing').hasClass("to-block") && data.content == "" && !$(_this).hasClass('selected_step')) {
                                $.MsgBox.Alert('��ܰ��ʾ','������ɴ˴β�������ӣ�');
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


/*************************************************����Ѵ����Ĳ��裬�ܻ������ݲ��ɱ༭**************************************/
function update_step(order_step,id_num) {
    /*����Ǵ�����������༭*/
    if(!is_update_step) {
        if ($('.leixing').hasClass("to-block")) {
            if (data.name != "" && data.content.length != 0 || temp_arrayData.length != 0 ) {
                clear();
            } else {
                $.MsgBox.Alert('��ܰ��ʾ','������ɴ˴β�������ӣ�');
                return;
            }
        }
    } else if(is_update_step){      /*����Ǵӱ༭���༭*/
        if(pr[update_step_index - 1].content.length == 0) {
            $.MsgBox.Alert('��ܰ��ʾ','������ɴ˴β�������ӣ�');
            return;
        } else {
            temp_arrayData = [];
        }
    }

    console.log(data);
    /*���д����*/
    $(".proo_main_create div[id='pro_step_id_"+order_step+"']").addClass('selected_step').siblings("div").removeClass("selected_step");
    $('.save_icon').removeClass('to-block');
    $('.select_icon').addClass('to-none');
    $('.pro_type').removeClass('to-block');
    /*���д����*/

    is_update_step = true;

    if(id_num == 1){
        $('.process,.tool,.localapp,.search,.appmarket,.juhe,.socialgroup,.mystorage').removeClass('to-block');
        $('.network').addClass('to-block');
        $('.load').removeAttr('style').find('iframe').attr('src', pr[order_step-1].content);
        $('.list_box input').val(pr[order_step-1].content);
        update_step_index = order_step;
        console.log(update_step_index);
        console.log(pr);

    } else if(id_num == 2) {
        $('.network,.process,.localapp,.search,.appmarket,.juhe,.socialgroup,.mystorage').removeClass('to-block');
        $('.tool').addClass('to-block');

        $('.spaces_box_type').find('li').removeClass('selected');
        console.log(pr);
        update_step_index = order_step;
        var toolname;
        for(let i= 0; i<pr[update_step_index - 1].content.length; i++){
            toolname = pr[update_step_index - 1].content[i].name;
            $(".load_had_tool li[cfgName='"+toolname+"']").addClass('selected');
            temp_arrayData.push(pr[update_step_index - 1].content[i]);
        }
        clear();
        console.log(update_step_index);
        console.log(pr);
    }

}
/*************************************************����Ѵ����Ĳ��裬�ܻ������ݲ��ɱ༭**************************************/

/*�Ҽ����ܣ���� �������*/
$(".proo_main_create .proo_box_cont").mousedown(function (e) {

    if (e.which === 3) {

        var _this = this;
        step_index = $(_this).find("span").html();

        $(_this).contextMenu('sysMenu',
            {
                bindings: {
                    /*�½�����*/
                    'Li1': function (Item) {
                        $(_this).unbind('click');
                        add_new_pro_step();
                        is_mid_Creater = true;
                    },
                    /*ɾ��*/
                    'Li2': function (Item) {
                        $(_this).unbind('click');
                        if ($('.leixing').hasClass("to-block") && data.content == "" && !$(_this).hasClass('selected_step')) {
                            $.MsgBox.Alert('��ܰ��ʾ','������ɴ˴β�������ӣ�');
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


/*�����Ӱ�ť�¼�*/
$('.proo_box_add').on('click', function (event) {
    event.preventDefault();
    $('.pro_save').removeClass('to-block');
    /*ÿ���һ����Ӳ��谴ť����ʱ�����ʼ��Ϊ1�������Ϊ1����step+temp_step*/
    add_new_pro_step();
    update_step_index = 0;
});
/*ÿ���һ����Ӳ��谴ť����ʱ�����ʼ��Ϊ1�������Ϊ1����step+temp_step*/
function add_new_pro_step() {
    /*����Ǵ���ӻ��н����������*/
    if(!is_update_step) {
        if ($('.leixing').hasClass("to-block")) {
            if (data.name != "" && data.content != "") {
                clear();
            } else {
                $.MsgBox.Alert('��ܰ��ʾ','������ɴ˴β�������ӣ�');
                return;
            }
        } else {
            $('.pro_type').addClass('to-block');
        }
    } else if(is_update_step) {     /*����Ǵӱ༭�����*/
        if(pr[update_step_index - 1].content.length == 0) {
            $.MsgBox.Alert('��ܰ��ʾ','������ɴ˴β�������ӣ�');
            return;
        } else {
            $('.network,.process,.tool,.localapp,.search,.appmarket,.juhe,.socialgroup,.mystorage').removeClass('to-block');
            $('.pro_type').addClass('to-block');
            is_update_step = false;
        }
    }
}

/*���沽��*/
$('.save_img').click(function () {
    console.log(divDatas);
    /*�Զ�����*/
    if (global_datas != "") {
        var pro_num_ti = global_datas.length - 1;
        var pro_name_ti = global_datas[pro_num_ti].processId;
        $('#pro_name').val("����" + pro_name_ti);
    } else {
        $('#pro_name').val("����");
    }

    if ($('.leixing').hasClass("to-block")) {
        if (data.name != "" && data.content != "") {
            chanellei_addsave();
        } else {
            $.MsgBox.Alert('��ܰ��ʾ','������ɴ˴β����ٱ��棡');
            return;
        }
    } else if (pr != "" || temp_arrayData.length != 0) {
        $('.pro_type').removeClass('to-block');
        $('.pro_save').addClass('to-block');
        $('.save_icon').addClass('to-block');
        $('.select_icon').addClass('to-none');
    } else {
        $.MsgBox.Alert('��ܰ��ʾ','������Ӳ����ٱ��棡');
        return;
    }
});


/*��������*/
$('.save_pro').click(function () {
    var img = $('.select_img').attr('src');
    var name = $('#pro_name').val();

    //�˴��ᱨ��Ӧ�������棬�ֿ����棬Ū��������
    console.log(divDatas);

    for(let i=0;i<divDatas.length;i++) {
        var prdata = {};
        prdata = JSON.parse($(".proo_main_create div[id='pro_step_id_"+divDatas[i].num+"']").attr("prDatas"));
        prdata.num = divDatas[i].num;
        pr.push(prdata);
    }
    console.log(pr);

    for(let i=0;i<pr.length;i++) {
        if (pr[i].type == 3) {
            isParent = true;
        }
    }

    /*����generator��ʹ��˳��ִ��*/
    var compute = function * () {
        ipcrenderer.send('loadingIndexPage');
        closeWindow();
        isParent = false;
    }
    var generator = compute();

    if (!$(".select_icon").hasClass("to-none") && name != "") {
        var rg = /^[a-zA-Z0-9\u4E00-\u9FA5\.\+\-\_]{1,12}$/;
        if (rg.test(name) && global_datas != "") {
            for(let i=0;i<global_datas.length;i++) {
                if (name == global_datas[i].proName) {
                    $.MsgBox.Alert('��ܰ��ʾ','�������Ѵ��ڣ���������д');
                    break;
                }
                if(i==global_datas.length-1) {
                    var data2 = {
                        userId: user_ID,
                        imgUrl: img,
                        proName: name,
                        isParent: isParent,
                        queryString: pr
                    }
                    var data1 = JSON.stringify(data2);
                    $.ajax({
                        url: "http://"+local_process_host+"/api/process/process/create",
                        data: data1,
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        success: function () {
                            /*�����ɹ�ִ�з���*/
                            generator.next();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {

                        }
                    });
                }
            }
        } else if (rg.test(name) && global_datas == "") {
            var data2 = {
                userId: user_ID,
                imgUrl: img,
                proName: name,
                isParent: isParent,
                queryString: pr
            }
            var data1 = JSON.stringify(data2);
            $.ajax({
                url: "http://"+local_process_host+"/api/process/process/create",
                data: data1,
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                success: function () {
                    /*�����ɹ�ִ�з���*/
                    generator.next();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        } else {
            $.MsgBox.Alert('��ܰ��ʾ','���ֲ���Ϊ�����ַ�����1-12λ֮��');
            return;
        }

    } else {
        $.MsgBox.Alert('��ܰ��ʾ','����ȷ��ͼ����������ƣ�');
        return;
    }
});


/***************************ģ�鷽��------------����ַ********************************************************************/
//�鿴Ч��
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
    console.log(data);

    var pr_data = JSON.stringify(data);

    $(".proo_main_create div[id='pro_step_id_"+stepData.num+"']").attr("prDatas",pr_data );

});

//�رմ���
$('.type_close').on('click', function (event) {
    $('.pro_type').removeClass('to-block');
});
//ESC�رմ���
$(document).keyup(function (event) {
    if (event.which == '27') {
        $('.pro_type').removeClass('to-block');
    }
});

//�س���Ч��
$(document).keydown(function (e) {
    if (e.keyCode == 13) {
        $('.url_box .list_box a').click();
    }
});

/***************************ģ�鷽��------------����ַ*************************************************************************/


/************************ģ�鷽��֮------����Ӧ��**********************************************************************************/


/*��ʾ�����ı���Ӧ��*/
function init_localapp() {

    //��ȡ��profile(EnvCfgSupportProfileList)
    let [Bottom_data]=[addon.EnvCfgProcessAppList()];

    Bottom_data = JSON.parse(Bottom_data);
    //�ѿ�profile����ʾ��ҳ����
    //�˴�Ϊ�գ���������
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
    sing_h += '<li class="li_add_localapp"><img src="images/add1.png"><span>��ӱ���Ӧ��</span></li>';
    $('.load_localapp').html(sing_h);

    /*��������Ӧ�ò������¼�*/
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
            /*�����ʱ����*/
            if(!is_mid_Creater) {
                data.content = temp_arrayData;
                pr[pr.length-1].content = data.content;
            } else {
                data.content = temp_arrayData;
                pr[step_index].content = data.content;
            }
            /*�����ʱ����*/
        })

        p.bind("dblclick.a", function () { //˫���¼�
            var exepath = $(this).attr('class');
            clearTimeout(timer); //��˫���¼��У������ǰ��click�¼���ʱ�䴦��
            addon.EnvCfgSetupExe(exepath);
        })

    });

    /*����Ӧ���Ҽ�����*/
    $(".localapp_youjian").mousedown(function (e) {

        if (e.which === 3) {

            var _this = this;
            var localappname = $(_this).find("span").attr('class');

            $(_this).contextMenu('sysMenu2',
                {

                    bindings: {
                        /*ɾ��*/
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

    /*����Ӧ��--���Ӧ��*/
    $(".li_add_localapp").click(function () {
        dialog.showOpenDialog({
            title: "My Process",
            defaultPath: "d://",
            buttonLabel: "ѡ��",
            //properties:["openDirectory","createDirectory","multiSelections"],
            filters: [
                {name: 'All Files', extensions: ['*']}
                //{name: 'Images', extensions: ['jpg', 'png', 'gif']},
                //{name: 'Movies', extensions: ['mkv', 'avi', 'mp4']},
                //{name: 'Custom File Type', extensions: ['as']}
            ]
        }, function (filename) {
            if(typeof(filename)!='undefined'){
                //�����ֶ����δ��ɨ���profile�ӿڷ���
                addon.EnvCfgAddApp(String(filename),"","");
                /*ˢ������ӵ�Ӧ��*/
                init_localapp();
            }
        })
    });
}
/************************ģ�鷽��֮-----����Ӧ��**************************************************************************/

/******************************************�ۺ���ϢJS**********************************************************/

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

    /*�����ʱ����*/
    if(!is_mid_Creater) {
        data.content = temp_arrayData;
        pr[pr.length-1].content = data.content;
    } else {
        data.content = temp_arrayData;
        pr[step_index].content = data.content;
    }
    /*�����ʱ����*/
}
let drop = (ev)=> {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("Text");
    loaddata(data);
    $('.loading').css('display', 'block');
}

/*ɾ���ۺ�Դ*/

let drop_delete = (ev)=> {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("Text");

    delete_juhe(data);
}

let delete_juhe = (d)=> {

    if(confirm("ȷ��ɾ���˾ۺ�Դ��")) {
        var juhename = d;

        $.ajax({
            url: "http://"+local_process_host+"/api/process/Polymer/destroy",
            data: {
                juheName: juhename,
            },
            type: "POST",
            dataType: "json",
            success: function (getdata) {
                /*����ҳ��*/
                init_hadJuhe(user_ID);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                /*���ؿհ�����ҳ��*/
                console.log("ɾ���ۺ���Ϣʧ��");
            }
        });
    } else{
    }
}
/******************************************�ۺ���ϢJS**********************************************************/




/*****************************************************************************��������**************************************/
/*��ѡ��ͼ��*/
$('.select_img').click(function () {
    $('.select_icon').addClass('to-none');
    $('.save_icon').addClass('to-block');
});

/*ͼ��ѡ��li*/
$(".save_icon  li").click(function () {
    var num = $(this).index() + 1;
    $(".select_img").attr("src", 'images/icon/icon' + num + '.png');
    $('.save_icon').removeClass('to-block');
    $('.select_icon').removeClass('to-none');
})

/*ȡ����������*/
$('.cancel_pro').click(function () {
    $('.pro_save').removeClass('to-block');
    $('.pro_type').removeClass('to-block');
    $('.save_icon').removeClass('to-block');
    $('.load').removeAttr('style').find('iframe').attr('src', "");
    $('.list_box input').val("");
    $('.searce_center').html("");
    $('.spaces_box_type').find('li').removeClass('selected');
    data = {};
    stepData = {};
    temp_arrayData = [];
});


/*****************************************************************************��������**************************************/

/********************************************************************************************�ӷ���*************************/
//ɾ���������Ԫ��
function removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

/*��ɣ����棬���ش���ҳ�棬��ʾ����ҳ��*/
function chanellei_addsave() {
    $('.network,.process,.tool,.localapp,.search,.appmarket,.juhe,.socialgroup,.mystorage').removeClass('to-block');
    $('.save_icon').addClass('to-block');
    $('.select_icon').addClass('to-none');
    $('.pro_save').addClass('to-block');
}

/*���һ�����*/
function clear() {
    $('.network,.process,.tool,.localapp,.search,.appmarket,.juhe,.socialgroup,.mystorage').removeClass('to-block');
    $('.pro_type').addClass('to-block');
    $('.load').removeAttr('style').find('iframe').attr('src', "");
    $('.list_box input').val("");
    $('.searce_center').html("");
    $('.spaces_box_type').find('li').removeClass('selected');
    stepData = {};
    data = {};
    temp_arrayData = [];
    is_mid_Creater = false;
    $('.iframeBox').removeAttr('style').find('iframe').attr('src', "");
}

/*�����ۺ���Ϣ*/
function add_juhe_span() {
    ipcrenderer.send('createJuheWindow', "","addJuheInfo");
}


/*֪ͨ���¾ۺ���Ϣ*/
ipcrenderer.on('newJuhe',(event)=>{
    init_hadJuhe(user_ID);
});

/********************************************************************************************�ӷ���*************************/