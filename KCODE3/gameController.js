tm = require('taskManager');
s = require('sectorController');
am = require('assignmentManager');

exports.gameController = class{
    constructor(){
        this.assigner = new am.assignmentManager();
        //Create Memory
        //delete Memory.sector;
        //delete Memory.source;
        if(!Memory.sector) Memory.sector = {};
        if(!Memory.source) Memory.source = {};
        if(!Memory.controller) Memory.controller = {};
        
        //Create Sector Controllers
        let sector = [];
        for(let i in Game.rooms){
            sector.push(new s.sectorController(Game.rooms[i]));
        }
        //Iterate over creeps
        for(let name in Memory.creeps){
            //Clear Memory
            if(!Game.creeps[name]){
                let assignment = Memory.creeps[name].assignment;
                if(assignment){
                    switch(Memory.creeps[name].role){
                        case 'miner':
                            delete Memory.source[assignment].miner[Memory.creeps[name].id];
                            break;
                        case 'transporter':
                            delete Memory.source[assignment].transporter[Memory.creeps[name].id];
                            break;
                        case 'upgrader':
                            delete Memory.controller[assignment].upgrader[Memory.creeps[name].id];
                            break;
                    }
                }
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
                continue;
            }
            if(!Game.creeps[name].memory.id) Game.creeps[name].memory.id = Game.creeps[name].id;
            //Assign Creeps
            if(!Game.creeps[name].memory.assignment){
                switch(Game.creeps[name].memory.role){
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
        //Iterate over sources
        for(let i of Object.keys(Memory.source)){
            //Assign Miners
            let workParts = 0
            if(Memory.source[i].miner && Memory.source[i].miner.length > 0){
                for(let j in Memory.source[i].miner){
                    let creep = Game.getObjectById(Memory.source[i].miner[j]);
                    if(creep){
                        workParts += _.filter(creep.body, function(bp){return bp == WORK;}).length;
                        console.log('m');
                        if(workParts < 5 && Memory.source[i].miner[j].length < Memory.source[i].space){
                            this.assigner.assignMiner(5-workParts, i);
                        }
                    }
                    else{
                        delete Memory.source[i].miner[j];
                    }
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

                    }
                    else{
                        delete Memory.source[i].transporter[j];
                    }
                }
            }
            else{
                console.log('t');
                this.assigner.assignTransporter(i);
            }
            //Create Source Containers
            if(Memory.source[i].spawnPath){
                let pos = new RoomPosition(Memory.source[i].spawnPath.path[0].x, Memory.source[i].spawnPath.path[0].y, Memory.source[i].spawnPath.path[0].roomName);
                let container = pos.lookFor(STRUCTURE_CONTAINER);
                if(!container){
                    Game.rooms[pos.roomName].createConstructionSite(pos, STRUCTURE_CONTAINER);
                }
            }
        }
        //Iterate over controllers
        for(let i of Object.keys(Memory.controller)){
            console.log(!Memory.controller[i].upgrader , Memory.controller[i].upgrader.length == 0);
            console.log(Memory.controller[i].upgrader);
            if(Memory.controller[i].upgrader && Memory.controller[i].upgrader.length > 0){
                for(let j in Memory.controller[i].upgrader){
                        let creep = Game.getObjectById(Memory.controller[i].upgrader[j]);
                        if(creep){

                        }
                        else{
                            delete Memory.controller[i].upgrader[j];
                        }
                }
            }
            else{
                console.log('u1');
                this.assigner.assignUpgrader(i);
            }
        }
    }
}