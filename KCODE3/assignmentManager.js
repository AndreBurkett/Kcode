nameBuilder = require('nameBuilder');

exports.assignmentManager = class{
    constructor(){
        this.miner = [];
        this.upgrader = [];
        this.transporter = [];
    }

    assignMiner(workNeeded, source){
        if(this.miner.length > 0){
            for(let i in this.miner){
                let workParts = _.filter(this.miner[i].body, function(bp){return bp == WORK;}).length;
                if(workParts <= workNeeded){
                    Memory.source[source].miner.push(this.miner[i].id);
                    this.miner[i].memory.assignment = source;
                    this.miner.splice(i,1);
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

    assignUpgrader(controller){
        if(this.upgrader.length > 0){
            for(let i in this.upgrader){
                Memory.controller[controller].upgrader.push(this.upgrader[i].id);
                this.upgrader[i].memory.assignment = controller;
                this.upgrader.splice(i,1);
            }
        }
        else this.spawnUpgrader();
    }

    spawnMiner(workParts){
        let spawner = Game.spawns['Spawn1'];
        if(spawner.spawnCreep([WORK,CARRY,MOVE], nameBuilder.getName('m'), {memory: {role: 'miner'}}) == 0){
            nameBuilder.commitName('m');
        }
    }
    
    spawnUpgrader(){
        let spawner = Game.spawns['Spawn1'];
        if(spawner.spawnCreep([WORK,CARRY,MOVE], nameBuilder.getName('u'), {memory: {role: 'upgrader'}}) == 0){
            nameBuilder.commitName('u');
        }
    }
}