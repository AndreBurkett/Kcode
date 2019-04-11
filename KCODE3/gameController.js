tm = require('taskManager');
s = require('sectorController');
am = require('assignmentManager');
cm = require('constructionManager');

exports.gameController = class{
    constructor(){
        this.assigner = new am.assignmentManager();
        //Create Memory
        if(!Memory.sector) Memory.sector = {};
        if(!Memory.source) Memory.source = {};
        if(!Memory.spawn) Memory.spawn = {};
        if(!Memory.controller) Memory.controller = {};
        
        //Create Sector Controllers
        this.sector = [];
        for(let i in Game.rooms){
            this.sector.push(new s.sectorController(Game.rooms[i]));
        }
        //Iterate over sectors
        for(let i in this.sector){
            if(this.sector[i].owner == 'me'){
                for(let j in this.sector[i].exits){
                    let exit = this.sector[i].exits[j];
                    if(Game.rooms[exit]){
                        //console.log(Game.rooms[this.sector[i].exits[j]]);
                    }
                    else{
                        //Assign Scout
                        if(Memory.sector[exit] && Memory.sector[exit].scout){
                            console.log(exit);

                        }
                        else{
                            Memory.sector[exit] = {};
                            Memory.sector[exit].scout = [];
                        }
                    }
                }
            }
        }
        //Iterate over creeps
        for(let name in Memory.creeps){
            //Clear Memory
            if(!Game.creeps[name]){        
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
                continue;
            }
            if(!Game.creeps[name].memory.id) Game.creeps[name].memory.id = Game.creeps[name].id;
            //Assign Creeps
            if(!Game.creeps[name].memory.assignment){
                switch(Game.creeps[name].memory.role){
                    case 'builder':
                        this.assigner.builder.push(Game.creeps[name]);
                        break;
                    case 'miner':
                        this.assigner.miner.push(Game.creeps[name]);
                        break;
                    case 'upgrader':
                        this.assigner.upgrader.push(Game.creeps[name]);
                        break;
                    case 'transporter':
                        this.assigner.transporter.push(Game.creeps[name]);
                        break;
                }
            }
            let run = new tm.creepManager(Game.creeps[name]);
        }
        //Create Construction Manager
        this.constructor = new cm.constructionManager(this.assigner);

        //Iterate over sources
        for(let i of Object.keys(Memory.source)){
            if(Memory.source[i].owner != 'hostile'){
                //Assign Miners
                let workParts = 0
                if(Memory.source[i].miner && Memory.source[i].miner.length > 0){
                    for(let j in Memory.source[i].miner){
                        let creep = Game.getObjectById(Memory.source[i].miner[j]);
                        if(creep){
                            workParts += _.filter(creep.body, function(bp){return bp.type == WORK;}).length;
                            
                        }
                        else{
                            Memory.source[i].miner.splice(j,1);
                        }
                    }
                    if(workParts < 5 && Memory.source[i].miner.length < Memory.source[i].space){
                        this.assigner.assignMiner(5-workParts, i);
                    }
                }
                else{
                    this.assigner.assignMiner(5-workParts, i);
                }
                //Assign Transporters
                if(Memory.source[i].transporter && Memory.source[i].transporter.length > 0){
                    for(let j in Memory.source[i].transporter){
                        let creep = Game.getObjectById(Memory.source[i].transporter[j]);
                        if(creep){
                            if(!creep.memory.assignment) creep.memory.assignment = i;
                        }
                        else{
                            //delete Memory.source[i].transporter[j];
                            Memory.source[i].transporter.splice(j,1);
                        }
                    }
                }
                else{
                    this.assigner.assignTransporter(i);
                }
                //Create Source Containers
                if(Memory.source[i].spawnPath){
                    let pos = new RoomPosition(Memory.source[i].spawnPath.path[0].x, Memory.source[i].spawnPath.path[0].y, Memory.source[i].spawnPath.path[0].roomName);
                    let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                    if(container == false){
                        let site = pos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                        if(site == false){
                            Game.rooms[pos.roomName].createConstructionSite(pos, STRUCTURE_CONTAINER);
                        }
                    }
                }
            }
        }
        //Iterate over controllers
        for(let i of Object.keys(Memory.controller)){
            let controller = Game.getObjectById(i);
            //Assign Upgraders
            if(Memory.controller[i].upgrader && Memory.controller[i].upgrader.length > 0 && controller && controller.my){
                for(let j in Memory.controller[i].upgrader){
                    let creep = Game.getObjectById(Memory.controller[i].upgrader[j]);
                    if(creep && creep != null){

                    }
                    else{
                        //delete Memory.controller[i].upgrader[j];
                        Memory.controller[i].upgrader.splice(j,1);
                    }
                }
            }
            else if(controller && controller.my){
                this.assigner.assignUpgrader(i);
            }
            //Check if Spawn exist in room
            if(Memory.controller[i].spawnPath){
                //Create Controller Container
                if(controller.level < 5){
                    this.assignControllerTransporter(i, controller);
                    let pos = new RoomPosition(Memory.controller[i].spawnPath.path[0].x, Memory.controller[i].spawnPath.path[0].y, Memory.controller[i].spawnPath.path[0].roomName);
                    let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                    if(container == false){
                        let site = pos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                        if(site == false){
                            Game.rooms[pos.roomName].createConstructionSite(pos, STRUCTURE_CONTAINER);
                        }
                    }
                    /*
                    //Assign Transporters
                    if(Memory.controller[i].transporter && Memory.controller[i].transporter.length > 0 && controller && controller.my){
                        for(let j in Memory.controller[i].transporter){
                            let creep = Game.getObjectById(Memory.controller[i].transporter[j]);
                            if(creep && creep != null){
        
                            }
                            else{
                                Memory.controller[i].transporter.splice(j,1);
                            }
                        }
                    }
                    else if(controller && controller.my){
                        this.assigner.assignTransporter(i);
                    }*/
                }
                //Create Controller Link
                else if(controller.level >= 5){
                    let lpos = new RoomPosition(Memory.controller[i].spawnPath.path[1].x, Memory.controller[i].spawnPath.path[1].y, Memory.controller[i].spawnPath.path[1].roomName);
                    let link = lpos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK});
                    if(link == false){
                        this.assignControllerTransporter(i, controller);
                        let site = lpos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_LINK});
                        if(site == false){
                            Game.rooms[lpos.roomName].createConstructionSite(lpos, STRUCTURE_LINK);
                        }
                    }
                }
            }

        }
        //Iterate over towers
        var tower = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        for(let i in tower){
            let run = new tm.towerManager(tower[i]);
        }
        //Spawn Creeps
        this.assigner.spawnManager.spawn();
    }

    assignControllerTransporter(id, controller){
        if(Memory.controller[id].transporter && Memory.controller[id].transporter.length > 0 && controller && controller.my){
            for(let j in Memory.controller[id].transporter){
                let creep = Game.getObjectById(Memory.controller[id].transporter[j]);
                if(creep && creep != null){

                }
                else{
                    Memory.controller[id].transporter.splice(j,1);
                }
            }
        }
        else if(controller && controller.my){
            this.assigner.assignTransporter(id);
        }
    }
}