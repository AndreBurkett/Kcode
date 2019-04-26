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
        if(!Memory.sector[this.sector.name].storage[this.storage.id]){
            Memory.sector[this.sector.name].storage[this.storage.id] = {};
        }
        if(!Memory.sector[this.sector.name].storage[this.storage.id].keeper){
            Memory.sector[this.sector.name].storage[this.storage.id].keeper = [];
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
            if(!Memory.sector[this.sector.name].source[this.source[i].id].pathReset){
                Memory.sector[this.sector.name].source[this.source[i].id].pathReset = 0;
            }
            if(!Memory.sector[this.sector.name].source[this.source[i].id].path || Memory.sector[this.sector.name].source[this.source[i].id].pathReset > 999){
                Memory.sector[this.sector.name].source[this.source[i].id].path = this.getCenterPath(this.source[i].pos);
                Memory.sector[this.sector.name].source[this.source[i].id].pathReset = 0;
            }
            Memory.sector[this.sector.name].source[this.source[i].id].pathReset++;
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
            if(!Memory.sector[this.sector.name].controller[this.room.controller.id].pathReset){
                Memory.sector[this.sector.name].controller[this.room.controller.id].pathReset = 0;
            }
            if(this.spawns.length >0 && !Memory.sector[this.sector.name].controller[this.room.controller.id].path || Memory.sector[this.sector.name].controller[this.room.controller.id].pathReset > 999){
                Memory.sector[this.sector.name].controller[this.room.controller.id].path = this.getCenterPath(this.room.controller.pos);
                Memory.sector[this.sector.name].controller[this.room.controller.id].pathReset = 0;
            }
            Memory.sector[this.sector.name].controller[this.room.controller.id].pathReset++;
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
    getCenterPath(pos){
        let x = Memory.sector[this.sector.name].center[0];
        let y = Memory.sector[this.sector.name].center[1];
        let posList = [
            new RoomPosition(x - 6, y, this.sector.name),
            new RoomPosition(x + 6, y, this.sector.name),
            new RoomPosition(x, y - 6, this.sector.name),
            new RoomPosition(x, y + 6, this.sector.name),
        ];
        let path;
        for(let i in posList){
            path = PathFinder.search(pos, posList[i], {swampCost: 1, roomCallback: this.roomCostMatrix});
            if(!minPath) var minPath = path;
            if(path.path.length < minPath.path.length) minPath = path;
        }
        return minPath.path;
    }

    getCostMatrix(){
        var costs = new PathFinder.CostMatrix;
        if(this.owner != 'hostile'){
            let structure = this.room.find(FIND_STRUCTURES);
            let creeps = this.room.find(FIND_CREEPS);
            for(let i in structure){
                if (!_.contains([STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_RAMPART, STRUCTURE_LINK], structure[i].structureType)) {
                    costs.set(structure[i].pos.x, structure[i].pos.y, 255);
                }
                else if(_.contains[STRUCTURE_ROAD], structure[i].structureType){
                    //costs.set(structure[i].pos.x, structure[i].pos.y, 1); #may cause getCenterPath to break
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
