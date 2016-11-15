/**
 * Created by afterloe on 16-1-7.
 */
const [fs,uuid,dBug,dataPath,msgSender] = [require("fs"), require('node-uuid'), true, `${process.env.APPDATA}/EngineeringMate`,require('electron').ipcRenderer];
let _callback = new Array();
let datas = [];
let [userDir,readVersionInfo,deleteFile,updateLoinInfos,postFiles,randomCode,readUserInfo,vers,result,writeJournal,getTime,formatDate,getDataPath,writeData,hook,getdatas] = [

/**
 * userDir
 *
 * 创建用户缓存目录
 *
 * @param userId  用户id
 * @param callback 回调函数
 */
    (userId, callback) => {
        let [__path,__dbPath] = [`${dataPath}`];
        if (!userId) {
            callback(new Error("No user login"));
            return;
        }
        __path += `/${userId}`;
        if (!fs.existsSync(__path)) fs.mkdirSync(__path);
        __dbPath = `${__path}/mate.db`;
        if (!fs.existsSync(__dbPath)) {
            let readStream = fs.createReadStream("../tmp/app.db"),
                writeStream = fs.createWriteStream(__dbPath);
            readStream.pipe(writeStream);
            writeStream.end(() => {
                if (callback) callback(null, __path);
            });
        } else {
            callback(null, __path);
        }
    },
/**
 * readVersionInfo
 *
 * 读取版本信息
 */(()=> {
        //let cache = new Object(),
            handler = str => {
                let [array,property,queue, key, value] = [fs.readFileSync(str).toString("UTF8").split("\r\n"), new Object()];
                for (let str of array) {
                    if ((queue = str.indexOf("=")) === -1) continue;
                    key = str.substr(0, queue);
                    value = str.substr(queue + 1);
                    property[key] = value;
                }
                return property;
            };

        return path => {
            //return path in cache ? cache[path] : cache[path] = handler(path);
            return handler(path);
        };
    })(),
/**
 * deleteFile
 *
 * 删除文件/文件夹
 *
 * @param __path  要删除的目录
 * @param callback 回调函数
 */
    (__path, callback) => {
        if (!fs.existsSync(__path)) throw new Error(`Error: file ${__path} not exists`);
        let __state = fs.statSync(__path);
        if (__state.isDirectory()) {
            let files = fs.readdirSync(__path);
            for (let file of files)
                this.deleteFile(__path + "/" + file, callback);
            fs.rmdirSync(__path);
        } else {
            try {
                fs.unlinkSync(__path);
                if (callback) callback(null, `File ==> ${__path} Delete SUCCESS`);
            } catch (err) {
                if (callback) callback(new Error(`${__path} delete fail, ${err.message}`), __path);
            }
        }
    },
/**
 * updateLoinInfos
 *
 * 修改登录信息
 *
 * @param 职业行业
 */
    (infos, callback) => {
        if (!infos instanceof Object) {
            if (callback) callback(new Error("Failed Params type"));
            return;
        }
        let target = this.readJson(`${dataPath}/tmp/pid`, true);
        if (!target) {
            if (callback) callback(new Error("Failed to read config"));
            return;
        }
        Object.assign(infos, target);
        if (!target["id"] || "" == target["id"]) target["id"] = target["userId"];
        configuer.encryption(target, `${dataPath}/tmp/pid`);
        if (callback) callback();
    },
/**
 * postFiles
 *
 * 发送文件
 *
 * @param fileKeyValue  需要传递的文件内容
 * @param req                 请求对象
 */
    (fileKeyValue, req) => {
        let boundaryKey = Math.random().toString(16);
        let [enddata,files,contentLength,contentBinary] = ['\r\n----' + boundaryKey + '--', new Array(), 0];
        for (let obj of fileKeyValue) {
            let content = "\r\n----" + boundaryKey + "\r\n" + "Content-Type: application/octet-stream\r\n"
                + "Content-Disposition: form-data; name=\"" + obj.urlKey + "\"; filename=\""
                + obj.urlName + "\"\r\n" + "Content-Transfer-Encoding: binary\r\n\r\n";
            contentBinary = new Buffer(content, 'utf-8');//当编码为ascii时，中文会乱码。
            files.push({contentBinary, filePath: obj["urlValue"]});
        }
        for (let file of files) {
            let stat = fs.statSync(file["filePath"]);
            contentLength += file.contentBinary.length;
            contentLength += stat.size;
        }

        req.setHeader('device', 'pc');
        req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
        req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));

        // 将参数发出
        let fileindex = 0;
        var doOneFile = () => {
            req.write(files[fileindex].contentBinary);
            let fileStream = fs.createReadStream(files[fileindex].filePath, {bufferSize: 4 * 1024});
            fileStream.pipe(req, {end: false});
            fileStream.on('end', () => {
                fileindex++;
                if (fileindex == files.length) {
                    req.end(enddata);
                } else {
                    doOneFile();
                }
            });
        };
        if (fileindex == files.length) {
            req.end(enddata);
        } else {
            doOneFile();
        }
    },
/**
 * randomCode
 *
 * 获取UUID
 *
 * @returns {string}
 */
    () => uuid.v1().split("-").join(""),
/**
 * readUserInfo
 *
 *   读取用户信息
 *
 *   @return  用户登录信息
 */
    () => {
        let userInfo;
        try {
            userInfo = fs.existsSync(`${this.getDataPath()}/pid`) ? configuer.decryption(`${this.getDataPath()}/pid`) : undefined;
        } catch (err) {
            userInfo = undefined;
        }
        return userInfo;
    },
/**
 * vers
 *
 *   获取网页版本
 */
    dBug ? Math.random() * 100 : 2016,
/**
 * result
 *
 *  通用数据返回格式
 *
 * @param results   需要返回的数据
 * @param code     状态码
 * @param msg       执行信息
 * @param flag       执行结果
 * @returns object   封装好的返回数据
 */
    (results = {}, code = 0, msg = "SUCCESS", flag = true) => {
        results, code, msg, flag
    },
/**
 * writeJournal
 *
 * 写出工作日志
 */
    () => {
        let journalDate = this.formatDate(new Date());
        configuer.encryption(journalDate, `${this.getDataPath()}/journal`);
    },
/**
 * getTime
 *
 * 获取时间
 *
 * @param time 是否转换到时间戳
 * @returns {*} 时间戳 | 格式化日期
 */
        time => {
        let date = new Date(),
            simpleTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return time ? date.getTime() : simpleTime;
    },
/**
 * formatDate
 *
 * 格式化时间
 *
 * @param b 需要格式化的时间
 * @param g 格式【默认 yyyy-MM-dd hh:mm:ss】
 */
    (b, g) => {
        b || (b = new Date())
        let a = {
            "M+": b.getMonth() + 1,
            "d+": b.getDate(),
            "h+": b.getHours(),
            "m+": b.getMinutes(),
            "s+": b.getSeconds(),
            "q+": Math.floor((b.getMonth() + 3) / 3),
            S: b.getMilliseconds()
        };
        g || (g = "yyyy-MM-dd hh:mm:ss");
        /(y+)/.test(g) && (g = g.replace(RegExp.$1, (b.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var c in a)(new RegExp("(" + c + ")")).test(g) && (g = g.replace(RegExp.$1, 1 == RegExp.$1.length ? a[c] : ("00" + a[c]).substr(("" + a[c]).length)));
        return g
    },
/**
 * getDataPath
 *
 * @returns {*}
 */
    () => {
        if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
        return dataPath;
    },
/**
 * writeData
 *
 */
    (data, path, flag,callbank) => {
        data = JSON.stringify(data);
        if (flag)
            configuer.encryption(data, path);
        else
            fs.writeFileSync(path, data);
        if(callbank)callbank();
    },
/**
 * hook
 *
 */
    (fileName, callback) => {
        msgSender.send("hook-file", {
            file: fileName
        });
        _callback.push({
            fileName, callback
        });
    },

/**
 * getdatas
 *
 */
(userid) => {

    $.ajax({
        url: "http://192.168.1.205:4000/api/process/process/read?userId="+userid,
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        success: function (getdata) {
            datas = getdata;
            console.log(datas);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*若报错，或没有数据则加载空白流程页面*/

        }
    });
    return datas;
}

];



module.exports.userDir = userDir;

module.exports.readVersionInfo = readVersionInfo;

module.exports.deleteFile = deleteFile;

module.exports.updateLoinInfos = updateLoinInfos;

module.exports.postFiles = postFiles;

module.exports.randomCode = randomCode;

module.exports.readUserInfo = readUserInfo;

module.exports.vers = vers;

module.exports.result = result;

module.exports.writeJournal = writeJournal;

module.exports.getTime = getTime;

module.exports.formatDate = formatDate;

module.exports.getDataPath = getDataPath;

module.exports.writeData = writeData;

module.exports.hook = hook;

module.exports.getdatas = getdatas;

/**
 * uploadMateSite
 *
 * 更新mate设置
 *
 * @param conf
 */
module.exports.uploadMateSite = (conf, callback) => {
    try {
        let defaultConf = this.readJson("../conf/mate-site", true);
        if (conf["rememberMe"] == undefined || typeof conf["rememberMe"] != "boolean")
            conf["rememberMe"] = defaultConf["rememberMe"];
        if (conf["autoUpdate"] == undefined || typeof conf["autoUpdate"] != "boolean")
            conf["autoUpdate"] = defaultConf["autoUpdate"];
        if (conf["defaultAccount"] == undefined)
            conf["defaultAccount"] = defaultConf["defaultAccount"];
        if (conf["defaultPass"] == undefined)
            conf["defaultPass"] = defaultConf["defaultPass"];
        defaultConf = null;
        this.deleteFile("../conf/mate-site", () => {
            configuer.encryption(conf, "../conf/mate-site");
            if (callback && callback.call) callback();
        });
    } catch (err) {
        if (callback && callback.call) callback(err);
    }
};

var hexcase = 0, b64pad = "", chrsz = 8;
module.exports.hex_md5 = function (b) {
    return binl2hex(core_md5(str2binl(b), b.length * chrsz));
};

/**
 * 读取配置文件
 *
 * @param path 文件路径
 * @param flag 是否解密。
 */
module.exports.readJson = (path, flag) => {
    if (path && !fs.existsSync(path)) return undefined;
    if (flag) {
        let value;
        try {
            value = configuer.decryption(path);
        } catch (err) {
            return undefined;
        }
        return value;
    } else {
        let readBytes = fs.readFileSync(path, "utf8");
        if (0 === readBytes.length) {
            return undefined;
        } else {
            return JSON.parse(readBytes);
        }
    }
};

function b64_md5(b) {
    return binl2b64(core_md5(str2binl(b), b.length * chrsz))
}
function str_md5(b) {
    return binl2str(core_md5(str2binl(b), b.length * chrsz))
}
function hex_hmac_md5(b, g) {
    return binl2hex(core_hmac_md5(b, g))
}
function b64_hmac_md5(b, g) {
    return binl2b64(core_hmac_md5(b, g))
}
function str_hmac_md5(b, g) {
    return binl2str(core_hmac_md5(b, g))
}


function md5_vm_test() {
    return "900150983cd24fb0d6963f7d28e17f72" == hex_md5("abc")
}
function core_md5(b, g) {
    b[g >> 5] |= 128 << g % 32;
    b[(g + 64 >>> 9 << 4) + 14] = g;
    for (var a = 1732584193, c = -271733879, d = -1732584194, e = 271733878, f = 0; f < b.length; f += 16)var h = a, k = c, l = d, m = e, a = md5_ff(a, c, d, e, b[f + 0], 7, -680876936), e = md5_ff(e, a, c, d, b[f + 1], 12, -389564586), d = md5_ff(d, e, a, c, b[f + 2], 17, 606105819), c = md5_ff(c, d, e, a, b[f + 3], 22, -1044525330), a = md5_ff(a, c, d, e, b[f + 4], 7, -176418897), e = md5_ff(e, a, c, d, b[f + 5], 12, 1200080426), d = md5_ff(d, e, a, c, b[f + 6], 17, -1473231341), c = md5_ff(c, d, e, a, b[f + 7], 22, -45705983), a = md5_ff(a, c, d, e, b[f + 8], 7,
        1770035416), e = md5_ff(e, a, c, d, b[f + 9], 12, -1958414417), d = md5_ff(d, e, a, c, b[f + 10], 17, -42063), c = md5_ff(c, d, e, a, b[f + 11], 22, -1990404162), a = md5_ff(a, c, d, e, b[f + 12], 7, 1804603682), e = md5_ff(e, a, c, d, b[f + 13], 12, -40341101), d = md5_ff(d, e, a, c, b[f + 14], 17, -1502002290), c = md5_ff(c, d, e, a, b[f + 15], 22, 1236535329), a = md5_gg(a, c, d, e, b[f + 1], 5, -165796510), e = md5_gg(e, a, c, d, b[f + 6], 9, -1069501632), d = md5_gg(d, e, a, c, b[f + 11], 14, 643717713), c = md5_gg(c, d, e, a, b[f + 0], 20, -373897302), a = md5_gg(a, c, d, e, b[f + 5], 5, -701558691), e = md5_gg(e, a, c, d, b[f +
    10], 9, 38016083), d = md5_gg(d, e, a, c, b[f + 15], 14, -660478335), c = md5_gg(c, d, e, a, b[f + 4], 20, -405537848), a = md5_gg(a, c, d, e, b[f + 9], 5, 568446438), e = md5_gg(e, a, c, d, b[f + 14], 9, -1019803690), d = md5_gg(d, e, a, c, b[f + 3], 14, -187363961), c = md5_gg(c, d, e, a, b[f + 8], 20, 1163531501), a = md5_gg(a, c, d, e, b[f + 13], 5, -1444681467), e = md5_gg(e, a, c, d, b[f + 2], 9, -51403784), d = md5_gg(d, e, a, c, b[f + 7], 14, 1735328473), c = md5_gg(c, d, e, a, b[f + 12], 20, -1926607734), a = md5_hh(a, c, d, e, b[f + 5], 4, -378558), e = md5_hh(e, a, c, d, b[f + 8], 11, -2022574463), d = md5_hh(d, e, a, c, b[f +
    11], 16, 1839030562), c = md5_hh(c, d, e, a, b[f + 14], 23, -35309556), a = md5_hh(a, c, d, e, b[f + 1], 4, -1530992060), e = md5_hh(e, a, c, d, b[f + 4], 11, 1272893353), d = md5_hh(d, e, a, c, b[f + 7], 16, -155497632), c = md5_hh(c, d, e, a, b[f + 10], 23, -1094730640), a = md5_hh(a, c, d, e, b[f + 13], 4, 681279174), e = md5_hh(e, a, c, d, b[f + 0], 11, -358537222), d = md5_hh(d, e, a, c, b[f + 3], 16, -722521979), c = md5_hh(c, d, e, a, b[f + 6], 23, 76029189), a = md5_hh(a, c, d, e, b[f + 9], 4, -640364487), e = md5_hh(e, a, c, d, b[f + 12], 11, -421815835), d = md5_hh(d, e, a, c, b[f + 15], 16, 530742520), c = md5_hh(c, d, e,
        a, b[f + 2], 23, -995338651), a = md5_ii(a, c, d, e, b[f + 0], 6, -198630844), e = md5_ii(e, a, c, d, b[f + 7], 10, 1126891415), d = md5_ii(d, e, a, c, b[f + 14], 15, -1416354905), c = md5_ii(c, d, e, a, b[f + 5], 21, -57434055), a = md5_ii(a, c, d, e, b[f + 12], 6, 1700485571), e = md5_ii(e, a, c, d, b[f + 3], 10, -1894986606), d = md5_ii(d, e, a, c, b[f + 10], 15, -1051523), c = md5_ii(c, d, e, a, b[f + 1], 21, -2054922799), a = md5_ii(a, c, d, e, b[f + 8], 6, 1873313359), e = md5_ii(e, a, c, d, b[f + 15], 10, -30611744), d = md5_ii(d, e, a, c, b[f + 6], 15, -1560198380), c = md5_ii(c, d, e, a, b[f + 13], 21, 1309151649), a = md5_ii(a,
        c, d, e, b[f + 4], 6, -145523070), e = md5_ii(e, a, c, d, b[f + 11], 10, -1120210379), d = md5_ii(d, e, a, c, b[f + 2], 15, 718787259), c = md5_ii(c, d, e, a, b[f + 9], 21, -343485551), a = safe_add(a, h), c = safe_add(c, k), d = safe_add(d, l), e = safe_add(e, m);
    return [a, c, d, e]
}
function md5_cmn(b, g, a, c, d, e) {
    return safe_add(bit_rol(safe_add(safe_add(g, b), safe_add(c, e)), d), a)
}
function md5_ff(b, g, a, c, d, e, f) {
    return md5_cmn(g & a | ~g & c, b, g, d, e, f)
}
function md5_gg(b, g, a, c, d, e, f) {
    return md5_cmn(g & c | a & ~c, b, g, d, e, f)
}
function md5_hh(b, g, a, c, d, e, f) {
    return md5_cmn(g ^ a ^ c, b, g, d, e, f)
}
function md5_ii(b, g, a, c, d, e, f) {
    return md5_cmn(a ^ (g | ~c), b, g, d, e, f)
}
function core_hmac_md5(b, g) {
    var a = str2binl(b);
    16 < a.length && (a = core_md5(a, b.length * chrsz));
    for (var c = Array(16), d = Array(16), e = 0; 16 > e; e++)c[e] = a[e] ^ 909522486, d[e] = a[e] ^ 1549556828;
    a = core_md5(c.concat(str2binl(g)), 512 + g.length * chrsz);
    return core_md5(d.concat(a), 640)
}
function safe_add(b, g) {
    var a = (b & 65535) + (g & 65535);
    return (b >> 16) + (g >> 16) + (a >> 16) << 16 | a & 65535
}
function bit_rol(b, g) {
    return b << g | b >>> 32 - g
}
function str2binl(b) {
    for (var g = [], a = (1 << chrsz) - 1, c = 0; c < b.length * chrsz; c += chrsz)g[c >> 5] |= (b.charCodeAt(c / chrsz) & a) << c % 32;
    return g
}
function binl2str(b) {
    for (var g = "", a = (1 << chrsz) - 1, c = 0; c < 32 * b.length; c += chrsz)g += String.fromCharCode(b[c >> 5] >>> c % 32 & a);
    return g
}
function binl2hex(b) {
    for (var g = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", a = "", c = 0; c < 4 * b.length; c++)a += g.charAt(b[c >> 2] >> c % 4 * 8 + 4 & 15) + g.charAt(b[c >> 2] >> c % 4 * 8 & 15);
    return a
}
function binl2b64(b) {
    for (var g = "", a = 0; a < 4 * b.length; a += 3)for (var c = (b[a >> 2] >> a % 4 * 8 & 255) << 16 | (b[a + 1 >> 2] >> (a + 1) % 4 * 8 & 255) << 8 | b[a + 2 >> 2] >> (a + 2) % 4 * 8 & 255, d = 0; 4 > d; d++)g = 8 * a + 6 * d > 32 * b.length ? g + b64pad : g + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c >> 6 * (3 - d) & 63);
    return g
};
