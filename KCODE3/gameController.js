s = require('sectorController');

exports.gameController = class{
    constructor(){
        //Create Memory
        if(!Memory.sector) Memory.sector = {};
        if(!Memory.source) Memory.source = {};
        if(!Memory.creepList) Memory.creepList = {};
        if(!Memory.creepList.miner) Memory.creepList.miner = {};

        //Create Sector Controllers
        let sector = [];
        for(let i in Game.rooms){
            sector.push(new s.sectorController(Game.rooms[i]));
        }

        //Iterate over sources
        for(let i in Memory.source){
            let workParts = 0
            if(Memory.source[i].miner && Memory.source[i].miner.length > 0){
                for(let j in Memory.source[i].miner[j]){
                    let creep = Game.getObjectById(Memory.source[i].miner[j]);
                    workParts += _.filter(creep.body, function(bp){return bp == Worker;}).length;
                }
                if(workParts < 5 && Memory.source[i].miner[j].length < Memory.source[i].space){
                    this.assignMiner(5-workParts, Memory.source[i]);
                }
            }
            else{
                this.assignMiner(5-workParts, Memory.source[i]);                
            }
        }
    }

    assignMiner(workParts, source){
        if(Memory.creepList.miner && Memory.creepList.miner.length > 0){
            for(let i in Memory.creepList.miner){
                if(Memory.creepList.miner[i].workParts == workParts){
                    Memory.source[source].miner = Memory.creepList.miner[i];
                    return;
                }
            }
        }
        this.spawnMiner(workParts);
    }

    spawnMiner(workParts){
        spawner = Game.spawns['Spawn1'];
        spawner.spawnCreep([WORK,CARRY,MOVE]);
    }
}