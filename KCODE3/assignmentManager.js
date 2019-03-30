nameBuilder = require('nameBuilder');

exports.assignmentManager = class{
    constructor(){
        this.miner = [];
    }

    assignMiner(workNeeded, source){
        if(this.miner.length > 0){
            for(let i in this.miner){
                let workParts = _.filter(this.miner[i].body, function(bp){return bp == WORK;}).length;
                if(workParts <= workNeeded){
                    console.log(source);
                    console.log(Memory.source[source]);
                    Memory.source[source].miner.push(this.miner[i]);
                    workNeeded -= workParts;
                }
            }
            if(workNeeded > 0){
                this.spawnMiner(workNeeded);
                return;
            }
        }
        this.spawnMiner(workNeeded);
    }

    spawnMiner(workParts){
        let spawner = Game.spawns['Spawn1'];
        if(spawner.spawnCreep([WORK,CARRY,MOVE], nameBuilder.getName('m'), {memory: {role: 'miner'}}) == 0){
            nameBuilder.commitName('m');
        }
    }
}