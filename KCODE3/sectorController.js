exports.sectorController = class{
    constructor(name){
        this.name = name;
        this.getRoomsInRange();
    }
    getRoomsInRange(){
        for(let i of Object.keys(Memory.sector)){
            console.log(i);
        }
    }
}