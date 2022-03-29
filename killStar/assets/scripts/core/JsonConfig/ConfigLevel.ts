// "name": "jiaju_34",
// "types": [
//     "化妆镜",
//     "桌子",
//     "化妆品用品",
//     "家具"
// ]
export class ConfigItemLevel{
    id:number = 0;
    map:Array<Array< number>> = null
}
export default class ConfigLevel {
        constructor() {}
        datas: ConfigItemLevel[] = [];
        map : Map<number,Array<Array< number>>> = null;
        
        load(jsonData:cc.JsonAsset){
            
            let json: Array<JSON> = jsonData.json;
            
            this.map = new Map<number,Array<Array< number>>>();

            // console.log("===element===",json)
            for (let index = 0; index < json.length; index++) {
                const element = json[index];
                // console.log("===element===",element)
                let data = new ConfigItemLevel();
                data.id = element["id"];
                data.map = element["levelInfo"];
                this.datas.push(data);
                this.map.set(data.id,data.map);
            }
        }
        getData(id : number) {
            return this.map.get(id);
        }
}

