exports.sectorController = class{
    constructor(sector){
        this.room = sector;
        this.terrain = Game.map.getRoomTerrain(this.room.name)
        this.source = this.room.find(FIND_SOURCES);
        //Create Sector Memory
        if(!Memory.sector[this.room.name]){
            Memory.sector[this.room.name] = {};
        }
        if(!Memory.source[source[i].id]){
            for(let i in this.source){
                Memory.source[source[i].id] = {};
                Memory.source[source[i].id].space = this.getfreeSpace(source[i].pos);
                Memory.source[source[i].id].miner = {};
            }
        }
    }

    getfreeSpace(pos){
        let space = 0;
            for(let i=-1;i<=1;i++){
                for(let j=-1;j<=1;j++){
                    if(this.terrain.get(pos.x + i, pos.y + j) != 1){
                        console.log(pos.x + i, pos.y + j);
                        space++;
                    }
                }
            }
        return space;
    }
}