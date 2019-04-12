exports.sectorController = class{
    constructor(name){
        this.name = name;
        this.rooms = this.getRoomsInRange();
    }
    getRoomsInRange(){
        let rooms = [];
        for(let name of Object.keys(Memory.sector)){
            let d = Game.map.getRoomLinearDistance(this.name, name);
            if(d <= 2){
                rooms.push(d);
            }
        }
        return rooms;
    }
}