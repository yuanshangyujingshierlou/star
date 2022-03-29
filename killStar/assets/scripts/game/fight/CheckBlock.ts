// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FightConst from "./FightConst";
import ItemBlock from "./ItemBlock";
import FightManger from "./FightManger";
import FunUtils from "../../core/Util/FunUtils";


export default class CheckBlock {

    Map:Array<Array< ItemBlock>> = null; 
    MapData:Array<Array<Array<ItemBlock>>> = null; 
    HintTable = []
    constructor(){
    }
    init(){
        let num = FightConst.FightNum.rowNum;
        this.Map = FightManger.getInstance().Map;
        this.MapData = []
        for (let row = 0; row < num; row++) { //行
            this.MapData[row] = [];
            for (let vertical = 0; vertical < num; vertical++) { //列
                this.MapData[row][vertical] = [];
                if(this.Map[row][vertical]){
                  this.Map[row][vertical].isSingle = false;
                  this.Map[row][vertical].initItemType();
                }
            }
        }
    }
    //检测
    check(){
        let num = FightConst.FightNum.rowNum;
        for (let row = 0; row < num; row++) { //行
            for (let vertical = 0; vertical < num; vertical++) { //列
                if(this.Map[row][vertical]){
                    this.pushMapData(this.Map[row][vertical],row, vertical,true)
                    let target = this.Map[row][vertical];
                    let x = target.xId;
                    let y = target.yId;
                    //判断是否是单独的
                    let isSingle = true;
                    if ((x - 1) >= 0 && this.Map[x - 1][y] &&(this.Map[x - 1][y].colorType == target.colorType)) {
                        isSingle = false;
                    }
                    if ((x + 1) < FightConst.FightNum.rowNum && this.Map[x + 1][y]&& (this.Map[x + 1][y].colorType == target.colorType)) {
                        isSingle = false;
                    }
                    if ((y - 1) >= 0 && this.Map[x][y - 1] && (this.Map[x][y - 1].colorType == target.colorType)) {
                        isSingle = false;
                    }
                    if ((y + 1) < FightConst.FightNum.rowNum && this.Map[x][y + 1]&& (this.Map[x][y + 1].colorType == target.colorType)) {
                        isSingle = false;
                    }
                    this.Map[row][vertical].isSingle = isSingle;
                }
                // cc.log(row, vertical, this.Map[row][vertical].isSingle, this.Map[row][vertical].colorType)
                // cc.log(row, vertical, this.MapData[row][vertical], this.Map[row][vertical].colorType)

            }
        }
    }

    pushMapData(target:ItemBlock, row, vertical,isSet){
        if(isSet){
            for (let row = 0; row < FightConst.FightNum.rowNum; row++) { //行
                for (let vertical = 0; vertical < FightConst.FightNum.rowNum; vertical++) { //列
                    if(this.Map[row][vertical]){
                      this.Map[row][vertical].isPushMapData = false;
                    }
                }
            }
        }
        target.isPushMapData = true
        this.MapData[row][vertical].push(target)
        let x = target.xId;
        let y = target.yId;
        if ((x - 1) >= 0 && this.Map[x - 1][y]) {
          if (!this.Map[x - 1][y].isPushMapData && this.Map[x - 1][y].colorType == target.colorType) {
            this.pushMapData(this.Map[x - 1][y], row, vertical,false)
          }
        }
        if ((x + 1) < FightConst.FightNum.rowNum && this.Map[x + 1][y]) {
          if (!this.Map[x + 1][y].isPushMapData && this.Map[x + 1][y].colorType == target.colorType) {
            this.pushMapData(this.Map[x + 1][y], row, vertical,false)
          }
        }
        if ((y - 1) >= 0 && this.Map[x][y - 1]) {
          if (!this.Map[x][y - 1].isPushMapData && this.Map[x][y - 1].colorType == target.colorType) {
            this.pushMapData(this.Map[x][y - 1], row, vertical,false)
          }
        }
        if ((y + 1) < FightConst.FightNum.rowNum && this.Map[x][y + 1]) {
          if (!this.Map[x][y + 1].isPushMapData && this.Map[x][y + 1].colorType == target.colorType) {
            this.pushMapData(this.Map[x][y + 1], row, vertical,false)
          }
        }
    }
    //检测游戏是否结束
    checkGameOver(){
      let num = FightConst.FightNum.rowNum;
      let singleNum = 0
      for (let row = 0; row < num; row++) { //行
          for (let vertical = 0; vertical < num; vertical++) { //列
              if(this.Map[row][vertical]){
                  if(!this.Map[row][vertical].isSingle){
                    return {isGameOver:false,singleNum:singleNum};
                  }
                  singleNum ++;
              }
          }
        }
        return {isGameOver:true,singleNum:singleNum}
    }
    //设置提示数组
    setHint(){
        let num = FightConst.FightNum.rowNum;
        let length = 0
        for (let row = 0; row < num; row++) { //行
            for (let vertical = 0; vertical < num; vertical++) { //列
                if(this.MapData[row][vertical]  && this.MapData[row][vertical].length > 1 ){
                    let dataLength = this.MapData[row][vertical].length;
                    if(dataLength > length){
                        length = dataLength;
                        this.HintTable = this.MapData[row][vertical];
                    }
                }
            }
        }
    }

    //检查换颜色(单独的优先返回)
    checkInColor(){
        let tabel = [];
        let num = FightConst.FightNum.rowNum;
        for (let row = 0; row < num; row++) { //行
            for (let vertical = 0; vertical < num; vertical++) { //列
                if(this.Map[row][vertical] && this.MapData[row][vertical]  && this.MapData[row][vertical].length == 1 ){
                    tabel.push(this.MapData[row][vertical])
                }
            }
        }
        if(tabel.length >= 1){
          let num = FunUtils.getRandom(0,(tabel.length - 1))
          return tabel[num]
        }else{
            for (let row = 0; row < num; row++) { //行
                for (let vertical = 0; vertical < num; vertical++) { //列
                    if(this.Map[row][vertical] && this.MapData[row][vertical]){
                        return this.MapData[row][vertical]
                    }
                }
            }
        }
    }
    //检测红包是否显示
    checkHongBaoShow(){
        let length = 0
        let num = FightConst.FightNum.rowNum;
        for (let row = 0; row < num; row++) { //行
            for (let vertical = 0; vertical < num; vertical++) { //列
                if(this.Map[row][vertical] ){
                    length++;
                }
            }
        }
        if(length <= 80){
            return true;
        }
        return false;
    }
    //检测炸弹
    checkBomb(row,vertical){
        let table = []
        table.push(this.Map[row][vertical])
        if(row - 1 >= 0){
            if(this.Map[row - 1][vertical]){
                table.push(this.Map[row - 1][vertical])
            }
            if(vertical - 1 >= 0){
                if (this.Map[row - 1][vertical - 1]) {
                    table.push(this.Map[row - 1][vertical - 1])
                }
            }
            if(vertical + 1 <= 9){
                if(this.Map[row - 1][vertical + 1]){
                    table.push(this.Map[row - 1][vertical + 1])
                }
            }
        }
        if(row + 1 <= 9){
            if(this.Map[row + 1][vertical]){
                table.push(this.Map[row + 1][vertical])
            }
            if(vertical - 1 >= 0){
                if(this.Map[row + 1][vertical - 1]){
                    table.push(this.Map[row + 1][vertical - 1])
                }
            }
            if(vertical + 1 <= 9){
                if(this.Map[row + 1][vertical + 1]){
                    table.push(this.Map[row + 1][vertical + 1]) 
                }
            }
        }
        if(vertical - 1 >= 0 ){
            if(this.Map[row ][vertical - 1]){
                table.push(this.Map[row ][vertical - 1])     
            }
        }
        if(vertical + 1 <= 9){
            if(this.Map[row ][vertical + 1]){
                table.push(this.Map[row ][vertical + 1])    
            }
        }
        return table;
    }
}
