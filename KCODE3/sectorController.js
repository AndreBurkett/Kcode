exports.sectorController = class{
    constructor(sector){
        this.room = sector;
        this.terrain = Game.map.getRoomTerrain(this.room.name)
        //Create Sector Memory
        if(!Memory.sector[this.room.name]) Memory.sector[this.room.name] = {};
        if(!Memory.sector[this.room.name].source){
            let source = this.room.find(FIND_SOURCES);
            console.log(source);
            for(let i in source){
                console.log(i);
                Memory.sector[this.room.name].source.push(source[i].id);
                Memory.sector[this.room.name].source[i].space = this.getfreeSpace(i.pos);
            }
        }
    }
    getfreeSpace(pos){
        let space = 0;
            for(let i=-1;i<=1;i++){
                for(let j=-1;j<=1;j++){
                    if(this.terrain.get(pos.x + i, pos.y + j) != 'wall'){
                        space++;
                    }
                }
            }
        return space;
    }
}