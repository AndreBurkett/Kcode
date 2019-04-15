s = require('sector');
am = require('assignmentManager');
cm = require('constructionManager');
tm = require('taskManager');

exports.sectorController = class{
    constructor(name){
        this.name = name;
        this.builders = _.filter(Game.creeps, (c) => c.memory.sc == this.name && c.memory.role == 'builder').length;
        this.miners = _.filter(Game.creeps, (c) => c.memory.sc == this.name && c.memory.role == 'miner').length;
        this.scouts = _.filter(Game.creeps, (c) => c.memory.sc == this.name && c.memory.role == 'scout').length;
        this.transporters = _.filter(Game.creeps, (c) => c.memory.sc == this.name && c.memory.role == 'transporter').length;
        this.upgraders = _.filter(Game.creeps, (c) => c.memory.sc == this.name && c.memory.role == 'upgrader').length;
        this.assigner = new am.assignmentManager(this);


        this.rooms = this.getRoomsInRange();
        this.sectorList = [];
        
        
        //Iterate over creeps
        for(let name in Memory.creeps){
            if(Memory.creeps[name].sc && Memory.creeps[name].sc == this.name){
                //Assign Creeps
                if(!Game.creeps[name].memory.assignment){
                    switch(Game.creeps[name].memory.role){
                        case 'builder':
                        this.assigner.builder.push(Game.creeps[name]);
                        break;
                        case 'miner':
                        this.assigner.miner.push(Game.creeps[name]);
                        break;
                        case 'scout':
                        this.assigner.scout.push(Game.creeps[name]);
                        break;
                        case 'upgrader':
                        this.assigner.upgrader.push(Game.creeps[name]);
                        break;
                        case 'transporter':
                        this.assigner.transporter.push(Game.creeps[name]);
                        break;
                    }
                }
            }
            let run = new tm.creepManager(Game.creeps[name]);
        }

        //Create Sectors
        for(let i of this.rooms){
            if(Game.rooms[i]) this.sectorList.push(new s.sector(Game.rooms[i], this));
        }

        //Iterate over sectors
        for(let i in this.sector){
            if(this.sector[i].owner != 'hostile'){
                for(let j in this.sector[i].exits){
                    let exit = this.sector[i].exits[j];
                    if(Game.rooms[exit]){
                        
                    }
                    else{
                        //Assign Scout
                        let minDistance = 99;
                        for(let k in Game.spawns){
                            let d = Game.map.getRoomLinearDistance(Game.spawns[k].room.name, exit);
                            //console.log(exit, d);
                            if(d < minDistance) minDistance = d;
                        }
                        if(minDistance <= 2){
                            if(Memory.sector[exit]){
                                if(Memory.sector[exit].owner != 'hostile'){
                                    if(Memory.sector[exit].scout && Memory.sector[exit].scout.length > 0){
                                        for(let k in Memory.sector[exit].scout){
                                            let creep = Game.getObjectById(Memory.sector[exit].scout[k]);
                                            if(creep && creep != null){
                        
                                            }
                                            else Memory.sector[exit].scout.splice(k,1);
                                        }
                                    }
                                    else this.assigner.assignScout(exit);
                                }
                            }
                            else{
                                Memory.sector[exit] = {};
                                Memory.sector[exit].scout = [];
                            }
                        }
                    }
                }
            }
        }
        //Create Construction Manager
        this.constructor = new cm.constructionManager(this.assigner);

        //Iterate over sources
        for(let i of Object.keys(Memory.source)){
            if(Memory.source[i].controller == this.name){
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
                    if(Memory.source[i].spawnPath && Game.rooms[Memory.source[i].spawnPath.path[0].roomName]){
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
        }
        //Iterate over controllers
        for(let i of Object.keys(Memory.controller)){
            if(Memory.controller[i].controller == this.name){
                let controller = Game.getObjectById(i);
                //Assign Upgraders
                if(Memory.controller[i].upgraderRequest > 0){
                    this.assigner.assignUpgrader(i);
                }
                if(Memory.controller[i].upgrader && Memory.controller[i].upgrader.length > 0 && controller && controller.my){
                    for(let j in Memory.controller[i].upgrader){
                        let creep = Game.getObjectById(Memory.controller[i].upgrader[j]);
                        if(creep && creep != null){
    
                        }
                        else{
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
                    }
                    //Create Controller Link
                    else if(controller.level >= 5){
                        let lpos = new RoomPosition(Memory.controller[i].spawnPath.path[1].x, Memory.controller[i].spawnPath.path[1].y, Memory.controller[i].spawnPath.path[1].roomName);
                        let link = lpos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK})[0];
                        if(link == false){
                            this.assignControllerTransporter(i, controller);
                            let site = lpos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_LINK});
                            if(site == false){
                                Game.rooms[lpos.roomName].createConstructionSite(lpos, STRUCTURE_LINK);
                            }
                        }
                        else Memory.controller[i].link = link.id;
                    }
                }
            }
        }
        
        //Spawn Creeps
        this.assigner.spawnManager.spawn();

        //Create GUI
        this.gui();
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

    getRoomsInRange(){
        let rooms = [];
        for(let name of Object.keys(Memory.sector)){
            let d = Game.map.getRoomLinearDistance(this.name, name);
            if(d <= 2){
                rooms.push(name);
            }
        }
        return rooms;
    }

    gui(){
        let gui = new RoomVisual(this.name);
        let room = Game.rooms[this.name];
        gui.text('Energy:', 1,37, {align:'left'});
        gui.text(room.energyAvailable + '/' + room.energyCapacityAvailable, 6,37, {align:'left'});
        gui.text('Builders:', 1,38, {align:'left'});
        gui.text(this.builders + '/1', 6,38, {align:'left'});
        gui.text('Miners:', 1,39, {align:'left'});
        gui.text(this.miners + '/1', 6,39, {align:'left'});
        
        gui.text('Scouts:', 1,40, {align:'left'});
        gui.text(this.scouts + '/' + this.assigner.spawnManager.scout, 6,40, {align:'left'});

        gui.text('Transporters:', 1,41, {align:'left'});
        gui.text(this.transporters + '/1', 6,41, {align:'left'});
        gui.text('Upgraders:', 1,42, {align:'left'});
        gui.text(this.upgraders + '/1', 6,42, {align:'left'});
    }
}