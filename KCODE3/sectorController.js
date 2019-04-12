exports.sector = class{
    constructor(name){
        this.name = name;
    }
    getRoomsInRange(){
        for(let i of Memory.sector){
            console.log(i);
        }
    }
}