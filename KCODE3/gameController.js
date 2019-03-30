s = require('sectorController');
am = require('assignmentManager');

exports.gameController = class{
    constructor(){
        this.assigner = new am.assignmentManager();
        //Create Memory
        delete Memory.sector;
        delete Memory.source;
        if(!Memory.sector) Memory.sector = {};
        if(!Memory.source) Memory.source = {};
        
        //Create Sector Controllers
        let sector = [];
        for(let i in Game.rooms){
            sector.push(new s.sectorController(Game.rooms[i]));
        }
        //Iterate over creeps
        for(let name in Game.creeps){
            if(!Game.creeps[name].memory.assignment){
                switch(Game.creeps[name].memory.role){
                    case 'miner':
                        this.assigner.miner.push(Game.creeps[name]);
                }
            }
        }
        //Iterate over sources
        for(let i of Object.keys(Memory.source)){
            let workParts = 0
            if(Memory.source[i].miner && Memory.source[i].miner.length > 0){
                for(let j in Memory.source[i].miner[j]){
                    let creep = Game.getObjectById(Memory.source[i].miner[j]);
                    workParts += _.filter(creep.body, function(bp){return bp == Worker;}).length;
                }
                if(workParts < 5 && Memory.source[i].miner[j].length < Memory.source[i].space){
                    this.assigner.assignMiner(5-workParts, i);
                }
            }
            else{
                this.assigner.assignMiner(5-workParts, i);                
            }
        }
    }
}