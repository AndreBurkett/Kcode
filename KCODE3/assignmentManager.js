exports.assignmentManager = class{
    constructor(){
        this.miner = [];
    }

    assignMiner(workNeeded, source){
        if(this.miner.length > 0){
            for(let i in this.miner){
                let workParts = _.filter(this.miner[i].body, function(bp){return bp == WORK;}).length;
                if(workParts <= workNeeded){
                    Memory.source[source].miner.push(this.miner[i]);
                    workNeeded -= workParts;
                }
            }
            if(workNeeded > 0){
                this.spawnMiner(workParts);
                return;
            }
        }
        this.spawnMiner(workParts);
    }

    spawnMiner(workParts){
        let spawner = Game.spawns['Spawn1'];
        spawner.spawnCreep([WORK,CARRY,MOVE], 'm', {memory: {role: 'miner'}});
    }
}