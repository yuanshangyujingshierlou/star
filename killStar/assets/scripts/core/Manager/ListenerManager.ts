/**
 * 消息中心ts版本
 * author : lidongdong
 * time: 2019.08.30
 */
var bindFuncList = [];// 保存监听函数
var emitList = []; // 没有注册的监听 保存下来

export default class ListenerManager{
    private static instance: ListenerManager;
    public static getInstance(): ListenerManager
    {
        if(this.instance == null)
        {
            this.instance = new ListenerManager();
        }
        return this.instance;
    }
    /**
     * 检查改监听是否已经存在
     * @param target this
     * @param key  唯一标识
     * @param backFunc 回调函数
     */
    hasMessage(target:any,key:any,backFunc:Function){
        let msgs = bindFuncList[key] 
        for (var i in msgs){
            if(target ==msgs[i].body && backFunc ==msgs[i].func ){
                return true;
            }
        }
        return false 
    }
    /**
     * 添加事件监听
     * @param target this
     * @param key  唯一标识
     * @param backFunc 回调函数
     */
    addMessage(target:any,key:any,backFunc:Function){
        let msgObj = {body:target,func:backFunc}
        if (bindFuncList[key]){
            if(this.hasMessage(target,key,backFunc)){
                return
            }
            bindFuncList[key].push(msgObj);
        }else {
            var ary = new Array();
            ary.push(msgObj);
            bindFuncList[key] = ary;
        }
    }
    /**
     * 发送信息
     * @param data  {key:"",args:""}
     * {监听的事件的名字} key
     * {调用时传的参数} args 
     */
    sendMessage(data:any){
        var key = data.key
        var args = data.args
        var ary = bindFuncList[key];
        if(ary){// 如果已经注册了事件，就直接发送消息
            for (var i in ary) {
                if (ary.hasOwnProperty(i)) {//判断自身属性是否存在
                    try {
                        if(ary[i].body && ary[i].func){
                            ary[i].func.call(ary[i].body,args);
                        }
                    } catch (error) {
                        
                    }
                }
            }
        }else {// 没有注册，先将要发送的消息保存，然后等待事件注册后，再一起emit
            if (emitList[key]){
                emitList[key].push(args);
            }else {
                let ary = new Array();
                ary.push(args);
                emitList[key] = ary;
            }
        }
    }
    /**
     * 发送没有监听到到数据
     */
    sendNoMessage(){
        for (var key in emitList) {
            if (emitList.hasOwnProperty(key)) {
                var emitAry = emitList[key];
                for (var j in emitAry) {
                    if (emitAry.hasOwnProperty(j)) {
                        var args = emitAry[j];// 去除参数
                        var ary = bindFuncList[key];// 去除监听的方法
                        // 开始执行事件
                        for (var iterator in ary) {
                            if (ary.hasOwnProperty(iterator)) {
                                try {
                                    ary[iterator].call(this,args);
                                } catch (error) {

                                }
                            }
                        }
                        
                    }
                }
            }
        }
        emitList = [];
    }

    /**
     * 删除某个消息的所有事件
     * @param key 唯一标识
     * 
     */
    removeMessageByKey(key:any){
        if(bindFuncList[key]){
            bindFuncList[key] = null;
        }
    }

    /**
     * 删除某个对象的某个事件
     * @param target 对象
     * @param key 唯一标识
     */
    removeMessageFromTargetByKey(target:any,key:any){
        var msgs = bindFuncList[key] 
        for (var j in msgs){
            if(msgs[j].body == target){
                msgs.splice(j,1);
            }
        }
    }
    /**
     * 删除某个对象的所有事件
     * @param target 对象
     */
    removeMessageByTarget(target){
        for (var i in bindFuncList){
            for (var j in bindFuncList[i]){
                let tempTarget = bindFuncList[i][j].body
                if(tempTarget == target){
                    bindFuncList[i].splice(j,1);
                }
            }
        }
    }
    // 清空全部的事件监听
    removeAllMessag(){
        bindFuncList = [];
    }
}
