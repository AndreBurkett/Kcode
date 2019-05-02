s = require('subSector');
am = require('assignmentManager');
tm = require('taskManager');

exports.sector = class{
    constructor(name){
        this.name = name;
        this.primaryController = Game.rooms[name].controller;
        this.room = Game.rooms[name];
        this.rooms = this.getRoomsInRange();
        this.spawn = this.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
        
        //Create Roles
        this.role = {};
        this.roleNames = ['builder', 'keeper', 'miner', 'scout', 'upgrader', 'transporter'];
        for(let i of this.roleNames){
            this.role[i] = _.filter(Game.creeps, (c) => c.memory.sector == this.name && c.memory.role == i).length;
        }

        //Create Memory
        if(!Memory.sector[name]) Memory.sector[name] = {};
        if(!Memory.sector[name].construction) Memory.sector[name].construction = {};
        if(!Memory.sector[name].controller) Memory.sector[name].controller = {};
        if(!Memory.sector[name].source) Memory.sector[name].source = {};
        if(!Memory.sector[name].spawn) Memory.sector[name].spawn = {};
        if(!Memory.sector[name].storage) Memory.sector[name].storage = {};
        if(!Memory.sector[name].subSector) Memory.sector[name].subSector = {};
        if(!Memory.sector[name].center){
            Memory.sector[name].center = [this.spawn[0].pos.x, this.spawn[0].pos.y + 2];
        }
        
        //Create Assigner
        this.assigner = new am.assignmentManager(this);
        
        //Iterate over creeps
        for(let name in Memory.creeps){
            let creep = Game.creeps[name];
            if(Memory.creeps[name].sector && Memory.creeps[name].sector == this.name){
                //Assign Creeps
                if(!creep.memory.assignment){
                    this.assigner.role[creep.memory.role].push(creep)
                }
            }
            let run = new tm.creepManager(creep);
        }
        
        //Create subSectors
        this.subSectorList = [];
        for(let i of this.rooms){
            if(Game.rooms[i]) this.subSectorList.push(new s.subSector(Game.rooms[i], this));
        }

        /*
        //Iterate over sectors
        for(let i in this.subSectorList){
            if(this.sector[i].owner != 'hostile'){
                for(let j in this.sector[i].exits){
                    let exit = this.sector[i].exits[j];
                    if(Game.rooms[exit]){
                        
                    }
                    else{
                        //Assign Scout
                        let distance = Game.map.getRoomLinearDistance(this.name, exit);
                        if(distance <= 2){
                            if(Memory.sector[this.name][exit]){
                                if(Memory.sector[this.name][exit].owner != 'hostile'){
                                    if(Memory.sector[this.name][exit].scout && Memory.sector[this.name][exit].scout.length > 0){
                                        for(let k in Memory.sector[this.name][exit].scout){
                                            let creep = Game.getObjectById(Memory.sector[this.name][exit].scout[k]);
                                            if(creep && creep != null){
                        
                                            }
                                            else Memory.sector[this.name][exit].scout.splice(k,1);
                                        }
                                    }
                                    else this.assigner.assignScout(exit);
                                }
                            }
                            else{
                                Memory.sector[this.name][exit] = {};
                                Memory.sector[this.name][exit].scout = [];
                            }
                        }
                    }
                }
            }
        }
        */
        

        //Iterate over constructionsites
        for(let i in Game.constructionSites){
            if(!Memory.sector[this.name].construction[i]){
                Memory.sector[this.name].construction[i] = {};
                Memory.sector[this.name].construction[i].builder = [];
            }
        }
        //Iterate over sites in memory
        for(let i of Object.keys(Memory.sector[this.name].construction)){
            if(Game.constructionSites[i]){
                if(Memory.sector[this.name].construction[i].builder.length > 0){
                    for(let j of Memory.sector[this.name].construction[i].builder){
                        let creep = Game.getObjectById(j);
                        if(!creep) Memory.sector[this.name].construction[i].builder.splice(j,1);
                    }
                }
                else this.assigner.assignRole(i, Memory.sector[this.name].construction, 'builder');
            }
            else{
                for(let j of Memory.sector[this.name].construction[i].builder){
                    let creep = Game.getObjectById(j);
                    if(!creep) Memory.sector[this.name].construction[i].builder.splice(j,1);
                    else delete creep.memory.assignment;
                }
                delete Memory.sector[this.name].construction[i];
            }
        }

        //Iterate over Storages
        for(let i of Object.keys(Memory.sector[this.name].storage)){
            if(Game.getObjectById(i)){
                if(Memory.sector[this.name].storage[i].keeper && Memory.sector[this.name].storage[i].keeper.length >0){
                    for(let j in Memory.sector[this.name].storage[i].keeper){
                        let creep = Game.getObjectById(Memory.sector[this.name].storage[i].keeper[j]);
                        if(!creep) Memory.sector[this.name].storage[i].keeper.splice(j,1);
                    }
                }
                else this.assigner.assignRole(i, Memory.sector[name].storage, 'keeper');
            }
            else delete Memory.sector[this.name].storage[i];
        }

        //Iterate over sources
        for(let i of Object.keys(Memory.sector[this.name].source)){
            if(Memory.sector[this.name].source[i].owner != 'hostile'){
                //Assign Miners
                if(Memory.sector[this.name].source[i].miner && Memory.sector[this.name].source[i].miner.length > 0){
                    for(let j in Memory.sector[this.name].source[i].miner){
                        let creep = Game.getObjectById(Memory.sector[this.name].source[i].miner[j]);
                        if(!creep) Memory.sector[this.name].source[i].miner.splice(j,1);
                    }
                }
                else this.assigner.assignRole(i, Memory.sector[this.name].source, 'miner');
                //Assign Transporters
                if(Memory.sector[this.name].source[i].transporter && Memory.sector[this.name].source[i].transporter.length > 0){
                    for(let j in Memory.sector[this.name].source[i].transporter){
                        let creep = Game.getObjectById(Memory.sector[this.name].source[i].transporter[j]);
                        if(!creep) Memory.sector[this.name].source[i].transporter.splice(j,1);
                    }
                }
                else this.assigner.assignRole(i, Memory.sector[this.name].source, 'transporter');
                //Create Source Containers
                if(Memory.sector[this.name].source[i].path && Game.rooms[Memory.sector[this.name].source[i].path[0].roomName]){
                    let pos = new RoomPosition(Memory.sector[this.name].source[i].path[0].x, Memory.sector[this.name].source[i].path[0].y, Memory.sector[this.name].source[i].path[0].roomName);
                    let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                    if(container == false){
                        let site = pos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                        if(site == false){
                            Game.rooms[pos.roomName].createConstructionSite(pos, STRUCTURE_CONTAINER);
                        }
                    }
                    //Create Source Roads
                    this.createRoad(Memory.sector[this.name].source[i].path);
                }
            }
        }
        //Iterate over controllers
        for(let i of Object.keys(Memory.sector[this.name].controller)){
            let controller = Game.getObjectById(i);
            //Assign Upgraders
            if(Memory.sector[this.name].controller[i].upgrader && Memory.sector[this.name].controller[i].upgrader.length > 0){
                for(let j in Memory.sector[this.name].controller[i].upgrader){
                    let creep = Game.getObjectById(Memory.sector[this.name].controller[i].upgrader[j]);
                    if(!creep) Memory.sector[this.name].controller[i].upgrader.splice(j,1);
                }
            }
            else if(controller && controller.my){
                this.assigner.assignRole(i, Memory.sector[this.name].controller, 'upgrader');
            }
            //Create Controller Road
            if(Memory.sector[this.name].controller[i].path && Memory.sector[this.name].controller[i].path[0].roomName){
                this.createRoad(Memory.sector[this.name].controller[i].path);
            }
            //Energy Transfer
            let lpos = new RoomPosition(Memory.sector[this.name].controller[i].path[1].x, Memory.sector[this.name].controller[i].path[1].y, Memory.sector[this.name].controller[i].path[1].roomName);
            let link = lpos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK})[0];
            if(link){
                Memory.sector[this.name].controller[i].link = link.id;
            }
            else{
                if(this.primaryController.level >= 5){
                    //Create Controller Link
                    let site = lpos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_LINK});
                    if(!site) Game.rooms[lpos.roomName].createConstructionSite(lpos, STRUCTURE_LINK);
                }
                else{
                    //Create Controller Container
                    let pos = new RoomPosition(Memory.sector[this.name].controller[i].path[0].x, Memory.sector[this.name].controller[i].path[0].y, Memory.sector[this.name].controller[i].path[0].roomName);
                    let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                    if(container == false){
                        let site = pos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                        if(site == false){
                            Game.rooms[pos.roomName].createConstructionSite(pos, STRUCTURE_CONTAINER);
                        }
                    }
                }
                if(Memory.sector[this.name].controller[i].transporter && Memory.sector[this.name].controller[i].transporter.length > 0){
                    for(let j in Memory.sector[this.name].controller[i].transporter){
                        let creep = Game.getObjectById(Memory.sector[this.name].controller[i].transporter[j]);
                        if(!creep) Memory.sector[this.name].controller[i].transporter.splice(j,1);
                    }
                }
                else if(controller && controller.my){
                    this.assigner.assignTransporter(i);
                }
            }
        }
        
        //Spawn Creeps
        this.assigner.spawnManager.spawn();

        //Create GUI
        this.gui();
    }

    build(site, type){
        let pos = new RoomPosition(site.x, site.y, site.roomName);
        let constructionExists = pos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == type})[0];
        if(constructionExists) return true
        else{
            let siteExists = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == type})[0];
            if(siteExists) return false;
            this.room.createConstructionSite(pos, type);
            return true;
        }
    }

    createRoad(mem){
        let numSites = 0;
        let max = 1;
        for(let i=2; i<=mem.length -1; i++){
            if(this.build(mem[i], STRUCTURE_ROAD)) numSites++;
            if(numSites >= max) return;
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
        gui.text(this.role.builder + '/1', 6,38, {align:'left'});
        gui.text('Miners:', 1,39, {align:'left'});
        gui.text(this.role.miner + '/1', 6,39, {align:'left'});
        
        gui.text('Scouts:', 1,40, {align:'left'});
        gui.text(this.role.scout + '/' + this.assigner.spawnManager.role.scout, 6,40, {align:'left'});

        gui.text('Transporters:', 1,41, {align:'left'});
        gui.text(this.role.transporter + '/1', 6,41, {align:'left'});
        gui.text('Upgraders:', 1,42, {align:'left'});
        gui.text(this.role.upgrader + '/1', 6,42, {align:'left'});
    }
}