bc = require('bunkerController');

exports.sectorController = class{
    constructor(sector){
        this.room = sector;
        this.terrain = Game.map.getRoomTerrain(this.room.name)
        this.source = this.room.find(FIND_SOURCES);
        this.spawns = this.room.find(FIND_MY_SPAWNS);
        this.owner = this.getOwner();
        //Create Bunker Controller
        if(this.spawns[0]) this.bunker = new bc.bunkerController(this.spawns[0]);

        //Create Sector Memory
        if(!Memory.sector[this.room.name]){
            Memory.sector[this.room.name] = {};
        }
        //Create Source Memory
        for(let i in this.source){
            if(!Memory.source[this.source[i].id]){
                Memory.source[this.source[i].id] = {};
                Memory.source[this.source[i].id].space = this.getfreeSpace(this.source[i].pos);
            }
            //if(!Memory.source[this.source[i].id].pos){
            Memory.source[this.source[i].id].pos = JSON.stringify(this.source[i].pos);
            //}
            if(!Memory.source[this.source[i].id].miner){
                Memory.source[this.source[i].id].miner = [];
            }
            if(!Memory.source[this.source[i].id].transporter){
                Memory.source[this.source[i].id].transporter = [];
            }
            if(this.spawns.length >0 && !Memory.source[this.source[i].id].spawnPath){
                for(let j in this.spawns){
                    Memory.source[this.source[i].id].spawnPath = this.getPath(this.source[i].pos, this.spawns[j].pos);
                }
            }
            //update owner
            Memory.source[this.source[i].id].owner = this.owner;
        }
        //Create Controller Memory
        if(!Memory.controller[this.room.controller.id]){
            Memory.controller[this.room.controller.id] = {};
            Memory.controller[this.room.controller.id].space = this.getfreeSpace(this.room.controller);
        }
        if(!Memory.controller[this.room.controller.id].upgrader){
            Memory.controller[this.room.controller.id].upgrader = [];
        }
        if(!Memory.controller[this.room.controller.id].transporter){
            Memory.controller[this.room.controller.id].transporter = [];
        }
        if(this.spawns.length >0 && !Memory.controller[this.room.controller.id].spawnPath){
            for(let i in this.spawns){
                Memory.controller[this.room.controller.id].spawnPath = this.getPath(this.room.controller.pos, this.spawns[i].pos);
            }
        }

    }

    getfreeSpace(pos){
        let space = 0;
            for(let i=-1;i<=1;i++){
                for(let j=-1;j<=1;j++){
                    if(this.terrain.get(pos.x + i, pos.y + j) != 1){
                        space++;
                    }
                }
            }
        return space;
    }
    getOwner(){
        let owner;
        if(this.room.controller && this.room.controller.level && this.room.controller.level > 0){
            if(this.room.controller.my) owner = 'me'
            else owner = 'hostile';
        }
        else owner = 'neutral';
        return owner;
    }
    getPath(pos1, pos2){
        let path = PathFinder.search(pos1, pos2, {swampCost: 1, ignoreRoads: true, roomCallback: this.roomCostMatrix()});
        return path;
    }

    roomCostMatrix(){
        if(!this.costs){
            var costs = new PathFinder.CostMatrix;
            let structure = this.room.find(FIND_STRUCTURES);
            for(let i in structure){
                if (!_.contains([STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_RAMPART], structure[i].structureType)) {
                    costs.set(structure[i].pos.x, structure[i].pos.y, 255);
                }
            }
            this.costs = costs;
        }
        return this.costs;
    }
}