s = require('sectorController');

exports.gameController = class{
    constructor(){
        //Create Memory
        if(!Memory.sector) Memory.sector = {};
        if(!Memory.source) Memory.source = {};
        //Create Sector Controllers
        let sector = [];
        for(let i in Game.rooms){
            sector.push(new s.sectorController(Game.rooms[i]));
        }

        //Iterate over sources
        /*
        for(let i in Memory.source){
            let workParts = 0
            for(let j in Memory.source[i].miner[j]){
                let creep = Game.getObjectById(Memory.source[i].miner[j])
                workParts += _.filter(creep.body, function(bp){return bp == Worker;}).length;
            }
            if(workParts < 5 && Memory.source[i].miner[j].length < Memory.source[i].space){
                this.assignMiner(5-workParts, Memory.source[i])
            } 
        }*/
    }

    assignMiner(workParts, source){
        
    }
}