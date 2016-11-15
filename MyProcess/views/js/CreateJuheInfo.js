/*渲染进程3*/
const ipcrendererJuhe = require('electron').ipcRenderer;
const [path, Electron] = [require("path"), require("electron")];
const myConfig = require(path.join(__dirname,"..", "configuration"));
//流程ip地址
const local_process_host=myConfig.pro_ip;
const core = require('../bin/core');
let [user]=[core.readJson(`${__dirname}/../../../../pid`)];
var userid = user.user._id;
var juhedata = [];
//窗口
const {ipcRenderer} =require('electron');

//窗口
let _Window = (data) => {
    ipcrendererJuhe.send("system", {
        tacticBlock : data,
        _win:"createJuheWindow"
    });
}
//窗口最小、最大、还原、关闭
let closeWindow = () => {
    _Window("closeWindow");
}
let minWindow = () => {
    _Window("miniWindow");
}


$(function(){
    console.log(userid);
    $.ajax({
        url: "http://"+local_process_host+"/api/process/Polymer/read?userId=" + userid,
        type: "GET",
        dataType: "json",
        success: function (getdata) {
            juhedata = getdata;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*若报错，或没有数据则加载空白流程页面*/
            /* loadingEmpty();*/
        }
    });


    $('.loadtitle a:first').click(function(){
        if(!$(this).hasClass("del")) {
            var url = $('.loadtitle input[name=web]').val();
            if (url != "") {
                $('.loading').css('display', 'block');
                url = /^http.+/.test(url) ? url : "http://" + url;
                $('#main').attr("src", url);
                $('#main').load(function () {
                    $('.loading').removeAttr('style');
                    $('.loadtitle a:eq(1)').removeClass('del');
                })
            }
        }
    });
    $('.loadtitle a:eq(1)').click(function(){
        if(!$(this).hasClass("del")){
            var text=$(this).text();
            $(this).siblings('a:first').addClass('del')
            if(text=="截取"){
                $('.topBox').css('display','block');
                $(this).text('取消');
            }else{
                $('.topBox').css('display','none');
                $(this).text('截取');
                $('.jeq').remove();
                $('.loadtitle a:first').removeClass('del');
                $('.loadtitle a:last').addClass('del');
            }
        }
    });
    $('.showWeb').bind('mousedown',function(e){
        var y=e.pageY;
        var x=e.pageX;
        if(!$(e.target).hasClass("jeq")){
            $('.loadtitle a:last').addClass('del');
            $('.jeq').remove();
            $('.showWeb').append('<div class="jeq" style="top:'+(y-$(this).position().top)+'px;left:'+(x-$(this).position().left)+'px;"></div>');
            $(window).bind('mousemove.s',function(e){
                var _y=e.pageY-y;
                var _x=e.pageX-x;
                if(_y>100&_x>100){
                    $('.loadtitle a:last').removeClass('del');
                }else{
                    $('.loadtitle a:last').addClass('del');
                }
                $('.jeq').css({width:_x,height:_y});
            })
        }
    });
    $(window).on('mouseup',function(){
        $(this).unbind('mousemove.s');
    });
    var boo=true;
    $('body').on('mousemove','.jeq',function(e){
        var min_h=$(this).offset().top+this.offsetHeight-4;
        var min_w=$(this).offset().left+this.offsetWidth-4;
        if(e.pageX>min_w&&e.pageY>min_h&&boo){
            $(this).css("cursor","se-resize");
        }else if(e.pageX>min_w&&boo){
            $(this).css("cursor","e-resize");
        }else if(e.pageY>min_h&&boo){
            $(this).css("cursor","s-resize");
        }else if(boo){
            $(this).css("cursor","all-scroll");
        }
    });
    $('body').on('mousedown','.jeq',function(e){
        boo=false;
        var t=$('.jeq').css('cursor');
        var x=e.pageX;
        var y=e.pageY;
        var w=$(this).width();
        var h=$(this).height();
        var _t=parseInt($(this).css('top'));
        var _l=parseInt($(this).css('left'));
        $(window).bind('mousemove.jep',function(e){
            var _x=e.pageX;
            var _y=e.pageY;
            if(w+_x-x>100&h+_y-y>100){
                $('.loadtitle a:last').removeClass('del');
            }else{
                $('.loadtitle a:last').addClass('del');
            }
            switch(t){
                case "se-resize":
                    $('.jeq').css({width:w+_x-x,height:h+_y-y});
                    break;
                case "e-resize":
                    $('.jeq').css({width:w+_x-x});
                    break;
                case "s-resize":
                    $('.jeq').css({height:h+_y-y});
                    break;
                default:
                    var top=_t+_y-y;
                    var left=_l+_x-x
                    if(top<0){
                        top=0;
                    }else if(top>$('.showWeb').height()-$('.jeq').height()){
                        top=$('.showWeb').height()-$('.jeq').height();
                    }
                    if(left<0){
                        left=0;
                    }else if(left>$('.showWeb').outerWidth()-$('.jeq').width()){
                        left=$('.showWeb').outerWidth()-$('.jeq').width();
                    }
                    $('.jeq').css({top:top,left:left});
            }
        });
    });
    $('body').on('mouseup','.jeq',function(){
        boo=true;
        $(window).unbind('mousemove.jep');
    });
    $('.loadtitle a:last').click(function(){
        if(!$(this).hasClass('del')){
            var name=$('.loadtitle input[name=name]').val();
            var rg = /^[a-zA-Z0-9\u4E00-\u9FA5\.\+\-\_]{1,12}$/;

            /*创建generator，使其顺序执行*/
            var compute = function * ()
            {
                ipcrendererJuhe.send('loadingJuhePage');
                closeWindow();
            }
            var generator = compute();

            if(rg.test(name) && juhedata != "" ){
                for(let i=0;i<juhedata.length;i++) {
                    if (name == juhedata[i].juheName) {
                        $.MsgBox.Alert('温馨提示','此名称已存在！请重新填写');
                        break;
                    }
                    if(i==juhedata.length-1) {
                        if(confirm("确定截取当前区域吗？")) {
                            var jeq = $('.jeq');
                            var iframes = $(window.frames["main"].document);
                            $.ajax({
                                url: "http://"+local_process_host+"/api/process/Polymer/create",
                                data: {
                                    userId: userid,
                                    juheName: name,
                                    juheUrl: $('#main').attr('src'),
                                    juheTop: jeq.position().top,
                                    juheLeft: jeq.position().left,
                                    juheWidth: jeq.width(),
                                    juheHeight: jeq.height(),
                                    scroltop: iframes.scrollTop(),
                                    scrolleft: iframes.scrollLeft()
                                },
                                type: "POST",
                                contentType: "application/x-www-form-urlencoded",
                                dataType: "json",
                                success: function () {
                                    /*创建成功执行方法*/
                                    generator.next();
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {

                                }
                            });
                        }
                    }
                }

            } else if (rg.test(name) && juhedata == "") {
                if(confirm("确定截取当前区域吗？")) {
                    var jeq = $('.jeq');
                    var iframes = $(window.frames["main"].document);
                    $.ajax({
                        url: "http://"+local_process_host+"/api/process/Polymer/create",
                        data: {
                            userId: userid,
                            juheName: name,
                            juheUrl: $('#main').attr('src'),
                            juheTop: jeq.position().top,
                            juheLeft: jeq.position().left,
                            juheWidth: jeq.width(),
                            juheHeight: jeq.height(),
                            scroltop: iframes.scrollTop(),
                            scrolleft: iframes.scrollLeft()
                        },
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        dataType: "json",
                        success: function () {
                            /*创建成功执行方法*/
                            generator.next();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {

                        }
                    });
                }
            }else{
                $.MsgBox.Alert('温馨提示','名字不能为空且字符长度1-12位之间');
            }
        }
    });
});




