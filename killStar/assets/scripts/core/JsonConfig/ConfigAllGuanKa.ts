

// "type": "梳妆台",
// "finds": [
//     "jiaju_34",
//     "jiaju_44",
//     "jiaju_39",
//     "jiaju_16"
// ],
// "need": 3
export class ConfigItemAllGuanKa{
    type : string = "";
    finds : string[] = [];
    need : number = 0;
}
export default class ConfigAllGuanKa {
        constructor() {}
        datas: ConfigItemAllGuanKa[] = [];
        map : Map<number,ConfigItemAllGuanKa> = null;
        load(jsonData:cc.JsonAsset){
            let json: Array<JSON> = jsonData.json;
            this.map = new Map<number,ConfigItemAllGuanKa>();
            for (let index = 0; index < json.length; index++) {
                const element = json[index];
                let data = new ConfigItemAllGuanKa();
                data.type = element["type"];
                data.finds = element["finds"];
                data.need = element["need"];
                this.datas.push(data);
                this.map.set(index +1 ,data);
            }
        }
        getData(id : number) {
            return this.map.get(id);
        }
}

