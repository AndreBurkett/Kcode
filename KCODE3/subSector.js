bc = require('bunkerController');

exports.subSector = class{
    constructor(subSector, sector){
        this.room = subSector;
        this.sector = sector;
        this.exits = Game.map.describeExits(this.room.name);
        this.storage = this.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_STORAGE})[0];
        this.terrain = Game.map.getRoomTerrain(this.room.name)
        this.source = this.room.find(FIND_SOURCES);
        this.spawns = this.room.find(FIND_MY_SPAWNS);
        this.owner = this.getOwner();
        this.roomCostMatrix = this.getCostMatrix();
        
        //Create Sector Memory
        if(!Memory.sector[this.sector.name].subSector[this.room.name]){
            Memory.sector[this.sector.name].subSector[this.room.name] = {};
        }
        //Set Owner in Memory
        Memory.sector[this.sector.name].subSector[this.room.name].owner = this.owner;
        //Set Cost Matrix in Memory
        Memory.sector[this.sector.name].subSector[this.room.name].CostMatrix = this.roomCostMatrix.serialize();
        //Sector Scout Memory
        if(!Memory.sector[this.sector.name].subSector[this.room.name].scout) Memory.sector[this.sector.name].subSector[this.room.name].scout = [];
        
        //Create Storage Memory
        if(!Memory.sector[this.sector.name].storage[this.storage]){
            Memory.sector[this.sector.name].storage[this.storage] = {};
        }
        if(!Memory.sector[this.sector.name].storage[this.storage].keeper){
            Memory.sector[this.sector.name].storage[this.storage].keeper = [];
        }

        //Create Source Memory
        for(let i in this.source){
            if(!Memory.sector[this.sector.name].source[this.source[i].id]){
                Memory.sector[this.sector.name].source[this.source[i].id] = {};
                Memory.sector[this.sector.name].source[this.source[i].id].space = this.getfreeSpace(this.source[i].pos);
            }
            if(!Memory.sector[this.sector.name].source[this.source[i].id].pos){
                Memory.sector[this.sector.name].source[this.source[i].id].pos = {};
                Memory.sector[this.sector.name].source[this.source[i].id].pos.x = this.source[i].pos.x;
                Memory.sector[this.sector.name].source[this.source[i].id].pos.y = this.source[i].pos.y;
                Memory.sector[this.sector.name].source[this.source[i].id].pos.roomName = this.source[i].pos.roomName;
            }
            if(!Memory.sector[this.sector.name].source[this.source[i].id].miner){
                Memory.sector[this.sector.name].source[this.source[i].id].miner = [];
            }
            if(!Memory.sector[this.sector.name].source[this.source[i].id].transporter){
                Memory.sector[this.sector.name].source[this.source[i].id].transporter = [];
            }
            if(!Memory.sector[this.sector.name].source[this.source[i].id].spawnPath){
                if(this.spawns && this.spawns.length > 0){
                    Memory.sector[this.sector.name].source[this.source[i].id].spawnPath = this.getPath(this.source[i].pos, this.spawns[0].pos);
                }
                else{
                    let spawn = Game.spawns['Spawn1'];
                    Memory.sector[this.sector.name].source[this.source[i].id].spawnPath = this.getPath(this.source[i].pos, spawn.pos);
                }
            }
            //update owner
            Memory.sector[this.sector.name].source[this.source[i].id].owner = this.owner;
        }
        //Create Controller Memory
        if(this.room.controller){
            if(!Memory.sector[this.sector.name].controller[this.room.controller.id]){
                Memory.sector[this.sector.name].controller[this.room.controller.id] = {};
                Memory.sector[this.sector.name].controller[this.room.controller.id].space = this.getfreeSpace(this.room.controller);
            }
            if(!Memory.sector[this.sector.name].controller[this.room.controller.id].pos){
                Memory.sector[this.sector.name].controller[this.room.controller.id].pos = {};
                Memory.sector[this.sector.name].controller[this.room.controller.id].pos.x = this.room.controller.pos.x;
                Memory.sector[this.sector.name].controller[this.room.controller.id].pos.y = this.room.controller.pos.y;
                Memory.sector[this.sector.name].controller[this.room.controller.id].pos.roomName = this.room.controller.pos.roomName;
            }
            if(!Memory.sector[this.sector.name].controller[this.room.controller.id].upgrader){
                Memory.sector[this.sector.name].controller[this.room.controller.id].upgrader = [];
            }
            if(!Memory.sector[this.sector.name].controller[this.room.controller.id].upgraderRequest){
                Memory.sector[this.sector.name].controller[this.room.controller.id].upgraderRequest = 0;
            }
            if(!Memory.sector[this.sector.name].controller[this.room.controller.id].transporter){
                Memory.sector[this.sector.name].controller[this.room.controller.id].transporter = [];
            }
            if(this.spawns.length >0 && !Memory.sector[this.sector.name].controller[this.room.controller.id].spawnPath){
                for(let i in this.spawns){
                    Memory.sector[this.sector.name].controller[this.room.controller.id].spawnPath = this.getPath(this.room.controller.pos, this.spawns[i].pos);
                }
            }
        }        
        //Create Bunker Controller
        if(this.room.name == this.sector.name) this.bunker = new bc.bunkerController(this.sector);
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
        if(this.room.controller){
            if(this.room.controller.level && this.room.controller.level > 0){
                if(this.room.controller.my) owner = 'me'
                else owner = 'hostile';
            }
            else owner = 'neutral';
        }
        else owner = 'hostile';
        return owner;
    }
    getPath(pos1, pos2){
        let path = PathFinder.search(pos1, pos2, {swampCost: 1, ignoreRoads: true, roomCallback: this.roomCostMatrix});
        return path;
    }

    getCostMatrix(){
        var costs = new PathFinder.CostMatrix;
        if(this.owner != 'hostile'){
            let structure = this.room.find(FIND_STRUCTURES);
            let creeps = this.room.find(FIND_CREEPS);
            for(let i in structure){
                if (!_.contains([STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_RAMPART], structure[i].structureType)) {
                    costs.set(structure[i].pos.x, structure[i].pos.y, 255);
                }
            }
            for(let i in creeps){
                costs.set(creeps[i].pos.x, creeps[i].pos.y, 255);
            }
        }
        else{
            for(let x = 0; x<50; x++){
                for(let y = 0; y<50; y++){
                    costs.set(x, y, 255);
                }
            }
        }
        return costs;
    }
}
