/**
 * Created by afterloe on 2016/7/10.
 *
 * @mail afterloeliu@jwis.cn
 * @version 1.0.0
 */
class EasyHook {
    constructor(execute) {
        this.execute = execute;
    }

    setHookFile(file) {
        if (!file) throw new Error("Lack parameters");
        this.fileName = file;
    }

    startTask(callback) {
        if (!callback) throw new Error("Lack listeners callback function");
        let _self = this;
        _self.hookTask = this.execute(this.fileName, {
            persistent: true,
            interval: 1000
        }, (curr, prev) => {
            callback(null,prev.mtime,_self.fileName);
        });
    }
}

module.exports = EasyHook;