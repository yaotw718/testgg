const [localLanguage,http,https,fs,path,qs,os] = [require("localLanguage/GetSystemLanguage"),require("http"),require("https"),require("fs"),require("path"),require('querystring'),require("os")];
const siteConfig = fs.readFileSync(path.join(__dirname,"..","config","site"),"utf8");
const [ei,type,version] = [require("computerinfo/computerinfo"),os.type().replace("_"," "),os.release()];
const ua = "Mozilla/5.0 (" + type + " " + version + "; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36";
let httpsAgent = require('https-agent');
let agent = httpsAgent({
    passphrase: 'client'
});
//获取token
function getToken(){
    let [pidPath,pid] = [path.join(__dirname,"..","..","..","..","pid")];
    if(fs.existsSync(pidPath)){
        try{
            pid = JSON.parse(fs.readFileSync(pidPath));
            return pid.token;
        }catch(e){
            return pid;
        }
    }else{
        return pid;
    }
};

//获取请求的基本信息
function getBaseURL(protocol){
    let config,baseURL,hostname,port;
    try{
        config = JSON.parse(siteConfig);
    }catch(e){
        return null;
    };
    if(undefined == protocol){
        protocol = "http";
        hostname = config.hostname["https"];
        if(config.port)port = config.port["https"];
    }else{
        hostname = config.hostname[protocol];
        if(config.port)port = config.port[protocol];
    };
    baseURL = protocol + "://" + hostname;
    if(port)baseURL = baseURL + ":" + port;
    return baseURL;
}

//获取系统语言
function getLanguage(){
    let localLan = localLanguage.GetSystemLanguage( );
    //console.log(localLan);
    //return "chinese" == localLan?"zh-CN":"en-US";
    //return "en-US";
    return "zh-CN";
};
//获取请求头
function getHeaders(){
    return {
        "Content-Type": 'application/x-www-form-urlencoded',
        "ei":ei.GetComputerInfo(),
        "User-Agent":ua,
        "token": token = getToken(),
        "language":getLanguage()
    };
}
//获取请求参数
function getParams(params){
    let [protocol,config,httpObj] = [params.protocol];
    try{
        config = JSON.parse(siteConfig);
    }catch(e){
        return null;
    };
    //判断协议
    if("local" == protocol)httpObj = http;
    if("http" == protocol)httpObj = http;
    if(undefined == protocol)httpObj = http;

    //请求体参数
    let content = qs.stringify(params.data);
    let option = {
        "headers":{
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length":content.length,
            "ei":ei.GetComputerInfo(),
            "User-Agent":ua,
            "token": token = getToken(),
            "language":getLanguage()
        },
        "rejectUnauthorized": false, //设置忽略验证
        "method":params.method,
        "path":encodeURI(params.path)
    };
    //判断域名或IP
    if(undefined == protocol){
        if(config.port)option.port = config.port["https"];
        option.hostname = config.hostname["https"];
    }else{
        if(config.port)option.port = config.port[protocol];
        option.hostname = config.hostname[protocol];
    };
    return {httpObj:httpObj,option:option,content:content};
};
/**
 *  后端通讯
 *
 * @param data          通讯内容
 * @param callback    回调函数
 */
//请求一般数据
function accessMaster (params,callback){
    let reqParams = getParams(params);
    if(!reqParams){
        callback(new Error("参数错误"));
        return;
    };
    let {httpObj,option,content} = reqParams;
    //console.log(JSON.stringify(option));
    let req = httpObj.request(option, response => {
            response.setEncoding("utf-8");
    let content = [];
    response.on("data", chunk => {
        //console.log(chunk);
        content.push(chunk);
});
response.on("end", () => {
    //console.log(content.join(""));
    if(callback)callback(null, content.join(""));
});
});

req.setTimeout(15 * 1000, () => {
    console.log("timeout");
if(callback)callback(new Error("请求超时"));
});
if(content.length) {
    req.write(content);
};
req.on('error', err => {
    console.log(err);
if(callback)callback(err);
return;
});
req.end(() => {
    console.log("communication over");
});
};
//请求流数据
function accessMasterByte (params,callback){
    let reqParams = getParams(params);
    if(!reqParams){
        callback(new Error("参数错误"));
        return;
    };
    let {httpObj,option,content} = reqParams;
    let tmpPath = path.join(__dirname,"..","tmp");
    if(!fs.existsSync(tmpPath))fs.mkdirSync(tmpPath);
    tmpPath = path.join(tmpPath,params.id + ".zip");
    let req = httpObj.request(option, response => {
            response.pipe(fs.createWriteStream(tmpPath));
    response.on("end",()=>{
        if(callback)callback(null,tmpPath);
});
});

req.setTimeout(15 * 1000, () => {
    console.log("timeout");
if(callback)callback(new Error("请求超时"));
});
if(content.length) {
    req.write(content);
};
req.on('error', err => {
    console.log(err);
if(callback)callback(err);
return;
});
req.end(() => {
    console.log("communication over");
});
};

module.exports ={
    accessMaster,
    accessMasterByte,
    getToken,
    getLanguage,
    getHeaders,
    getBaseURL
};