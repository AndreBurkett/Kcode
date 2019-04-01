nameBuilder = require('nameBuilder');

exports.assignmentManager = class{
    constructor(){
        this.builder = [];
        this.miner = [];
        this.upgrader = [];
        this.transporter = [];
    }

    assignBuilder(site){
        if(this.builder.length > 0 ){
            for(let i in this.builder){
                //Memory.site[site].builder.push(this.builder[i].id);
                this.builder[i].memory.assignment = site;
                this.builder.splice(i,1);
            }
        }
        else this.spawnBuilder;
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
    
    assignTransporter(source){
        if(this.transporter.length > 0){
            for(let i in this.transporter){
                Memory.source[source].transporter.push(this.transporter[i].id);
                this.transporter[i].memory.assignment = source;
                this.transporter.splice(i,1);
            }
        }
        else this.spawnTransporter();
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

    spawnBuilder(){
        let spawner = Game.spawns['Spawn1'];
        if(spawner.spawnCreep([WORK,CARRY,MOVE], nameBuilder.getName('b'), {memory: {role: 'builder'}}) == 0){
            nameBuilder.commitName('b');
        }
    }
    
    spawnMiner(workParts){
        let spawner = Game.spawns['Spawn1'];
        if(spawner.spawnCreep([WORK,CARRY,MOVE], nameBuilder.getName('m'), {memory: {role: 'miner'}}) == 0){
            nameBuilder.commitName('m');
        }
    }

    spawnTransporter(){
        let spawner = Game.spawns['Spawn1'];
        if(spawner.spawnCreep([CARRY,MOVE], nameBuilder.getName('t'), {memory: {role: 'transporter'}}) == 0){
            nameBuilder.commitName('t');
        }
    }
    
    spawnUpgrader(){
        let spawner = Game.spawns['Spawn1'];
        if(spawner.spawnCreep([WORK,CARRY,MOVE], nameBuilder.getName('u'), {memory: {role: 'upgrader'}}) == 0){
            nameBuilder.commitName('u');
        }
    }
}