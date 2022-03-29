import JsFunc = require("./JsFunc");
import AdaptarManager from "../Manager/AdaptarManager";

export default class FunUtils {

    public static showTip = function (_txt,coler?:cc.Color) {
        cc.loader.loadRes("prefabs/common/showTip", function (err, prefab) {
            var tipNode:cc.Node = cc.instantiate(prefab);
            var tipBgNode :cc.Node = tipNode.getChildByName("tip_bg")
            var tipLabel :cc.Label = tipNode.getChildByName("tip_label").getComponent(cc.Label);
            var scene = cc.director.getScene()
            scene.addChild(tipNode);
            tipNode.setPosition(cc.v2(cc.winSize.width * .5,cc.winSize.height * .5));
            tipLabel.string = _txt;
            let label = tipLabel as any;
            label._forceUpdateRenderData && label._forceUpdateRenderData(true);
            tipBgNode.width = label.node.width + 20;
            // var callFunc = function () {
            //     tipNode.destroy();
            // }
            // let jumpAction = cc.sequence(cc.moveBy(2, 0, 150), cc.callFunc(function () {
            //     callFunc();
            // }, this, 0));
            // tipNode.runAction(jumpAction);
            // tipNode.runAction(cc.fadeOut(2));
            let tween = cc.tween;
            tween(tipNode)
                .parallel(
                    tween().by(2,{position:cc.v2( 0, 150)}),
                    tween().to(2,{opacity:0})
                )
                .call(() => {
                    tipNode.destroy();
                })
                .start()
        });
    }
    public static httpDelay = function () {
        cc.loader.loadRes("prefabs/common/ViewHttpDelay", function (err, prefab) {
            var node:cc.Node = cc.instantiate(prefab);
            var scene = cc.director.getScene()
            scene.addChild(node);
            node.setPosition(cc.v2(AdaptarManager.getInstance().fullWidth * .5,AdaptarManager.getInstance().fullHeight * .5));
            
        });
    }
    /**
     * 格式化字符串
     * "-{1}-",abc
     */
    public static format = function (...args) {
        // var arguments = args;
        var result = undefined;
        if (args.length > 0) {
            result = args[0];
            for (var i = 1; i < args.length; i++) {
                if (args[i] != undefined) {
                    var reg = new RegExp("({)" + (i) + "(})", "g"); //RegExp 正则表达式
                    result = result.replace(reg, args[i]); //replace 替换
                }
            }
        }
        return result;
    }
    /**
     * 产生任意长度随机字母数字组合
     * @param randomFlag 是否任意长度
     * @param min 任意长度最小位[固定位数]
     * @param max 任意长度最大位
     */
    public static randomWord(randomFlag, min, max) {
        var str = "",
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    }
    /**
     * 格式化时间 
     * timestamp 时间戳,为空时表示当前时间
     * format 格式化文案 如 YYYY年MM月DD日hh:mm:ss 不要补0就用一个字符的 M月D日
     */
    public static formatTime(format:any,timestampm:any){
        if(timestampm && timestampm < 10000000000){
            //如果时间戳是以秒为单位的,则改为以毫秒为单位
            timestampm = timestampm * 1000;
        }
        let day = timestampm ? new Date(parseInt(timestampm)) : new Date();
        let year = day.getFullYear() + "";
        let month = (day.getMonth()+1) + "";//别删+1
        let date = day.getDate() + "";
        let hour = day.getHours() + "";
        let minute = day.getMinutes() + "";
        let second = day.getSeconds() + "";
        let ret = format;

        ret = ret.replace("YYYY",year)
        ret = ret.replace("MM",(month.length == 2 ? month : "0" + month))
        ret = ret.replace("DD",date.length == 2 ? date : "0" + date)
        ret = ret.replace("hh",hour.length == 2 ? hour : "0" + hour)
        ret = ret.replace("mm",minute.length == 2 ? minute : "0" + minute)
        ret = ret.replace("ss",second.length == 2 ? second : "0" + second)

        ret = ret.replace("M",month )
        ret = ret.replace("D",date )
        ret = ret.replace("h",hour )
        ret = ret.replace("m",minute )
        ret = ret.replace("s",second )

        return ret;
    }
    /**
     * 深拷贝的实现
     * @param obj 拷贝的对象
     * @returns {*}拷贝后的对象
     */
    public static deepCopy(obj:any){
        if (typeof obj !== 'object') return obj;
        var newObj = obj instanceof Array ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
            }
        }
        return newObj;
    }
     /**
     * 控制姓名长度
     * @param name         字符串
     * @param Ilength      最大长度控制
     * @param insertStr    补字符串
     */
    public static trimName(name:string, Ilength:number, insertStr:string){
        if(!name)
        {
            return 'NULL';
        }
        name = name.toString();

        var tmp=0; //中文字符数记录
        var len=0; //单字符处理
        var okLen=0; //实际字符串长度
        var dowble = 0; //4字节字符

        Ilength *=2;//转为单字符长度，便于中英混杂。

        for(var i=0;i<name.length;i++){

            if(name.charCodeAt(i)>255){
                tmp+=2;
            }else{
                len+=1;
            }
                
            okLen+=1;

            //解决中英文混杂长度控制
            if(tmp+len>Ilength)
            {
                okLen += dowble - 1;
                return (name.substring(0,okLen)+insertStr);
            }
            

            if(name.codePointAt(i) > 0xFFFF){
                i++;
            
                if(i < name.length){
                    dowble += 1;
                }
            }
        }

        return (name.substring(0, okLen+dowble));
    }
    /**
     * 获取最小到最大的随机整数
     * @param {*} start 最小(包括)
     * @param {*} end 最大（包括）
     * Math.random()  0<=r<1 随机小数
     */
    public static getRandom(start:number, end:number){
        // var _count = count + 1
        // return n + Math.floor(Math.random() * (_count - n));
        return Math.floor(Math.random()*(end-start+1))+start;
    }

    /**
     * 打乱数组
     * @param endNum 结束数
     */
    public static getMessUpArr(endNum:number){
        let arr=[];
        for(var i = 0;i < endNum; i++){
            arr[i] = i;
        }
        arr.sort(function(){ return 0.5 - Math.random()})
        return arr
    }
    //获取配置
    public static getGameConfig(){
        let appurl = "https://lidongdong2253.gitee.io/project_config/jiayouhuyukejiyouxiangongshi/xiaoxiaoxiao_app_config.json"
        let url = appurl + "?dt=" + new Date().getTime();
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 30 * 1000;
        xhr.ontimeout = () => {
        };
        xhr.onreadystatechange = () => {
            if(xhr.status == 200 && xhr.readyState === 4) {
                let responseData = JSON.parse(xhr.responseText);
                // console.log("=====responseData.isGameOver=======",responseData.isGameOver)
                if(responseData.isGameOver){
                    cc.game.end();
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        xhr.send();
    }
}
