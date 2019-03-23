nameBuilder = require('nameBuilder');

exports.spawnManager = class{
    constructor(chamber){
        this.chamber = chamber;
        if(this.chamber.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'miner'}).length > 0) this.energyCap = this.chamber.room.energyAvailable;
        else this.energyCap = 300;
        this.body = [];
        switch(this.chamber.controller.level){
            case 1:
                this.spawnLvl1();
                break;
            case 2:
                this.spawnLvl2();
                break;
            case 3:
                this.spawnLvl3();
                break;
            case 4:
                this.spawnLvl3();
                break;
            case 5:
                this.spawnLvl5();
                break;
            case 6:
                this.spawnLvl5();
                break;
            case 7:
                this.spawnLvl5();
                break;
            case 8:
                this.spawnLvl5();
        }
    }
    spawnBuilder(cap){
        this.energyCap = Math.min(this.energyCap, cap);
        this.numParts = Math.floor(this.energyCap/200);
        for(let i = 0; i < this.numParts; i++) this.body.push(WORK,CARRY,MOVE);
        for (let x in this.chamber.spawns) {
            this.chamber.spawns[x].spawnCreep(this.body, nameBuilder.getName('b'), { memory: { role: 'builder', task: 'idle' } });
        }
    }
    spawnDefender(cap, target){
        this.energyCap = Math.min(this.energyCap, cap);
        this.numParts = Math.floor(this.energyCap/210);
        for(let i = 0; i < this.numParts; i++) this.body.push(TOUGH);
        for(let i = 0; i < this.numParts; i++) this.body.push(MOVE,MOVE,ATTACK);
        for (let x in this.chamber.spawns) {
            this.chamber.spawns[x].spawnCreep(this.body, nameBuilder.getName('def'), { memory: { role: 'defender', target: target } });
        }
    }
    spawnMiner(cap){
        this.energyCap = Math.min(this.energyCap, cap);
        this.numParts = Math.floor((this.energyCap - 100)/100);
        for(let i = 0; i < this.numParts; i++) this.body.push(WORK);
        this.body.push(MOVE,CARRY);
        for (let x in this.chamber.spawns) {
            this.chamber.spawns[x].spawnCreep(this.body, nameBuilder.getName('m'), { memory: { role: 'miner', task: 'idle' } });
        }
    }
    spawnUpgrader(cap){
        this.energyCap = Math.min(this.energyCap, cap);
        this.numParts = Math.floor((this.energyCap-100)/100);
        for(let i = 0; i < this.numParts; i++) this.body.push(WORK);
        this.body.push(CARRY, MOVE);
        for (let x in this.chamber.spawns) {
            this.chamber.spawns[x].spawnCreep(this.body, nameBuilder.getName('u'), { memory: { role: 'upgrader', task: 'idle' } });
        }
    }

    spawnLvl1(){
        if (this.chamber.creepCountDrones < 2) {
            for (let x in this.chamber.spawns) {
                this.chamber.spawns[x].spawnCreep([WORK, CARRY, CARRY, MOVE], nameBuilder.getName('d'), { memory: { role: 'drone', task: 'idle' } });
            }
        }
        else if (this.chamber.creepCountBuilders < 1) {
            this.spawnBuilder(300);
        }
        else if (this.chamber.room.energyAvailable > 200) {
            for (let x in this.chamber.spawns) {
                this.chamber.spawns[x].spawnCreep([WORK, CARRY, CARRY, MOVE], nameBuilder.getName('a'), { memory: { role: 'acolyte', task: 'idle' } });
            }
        }
    }
    spawnLvl2(){
        if (this.chamber.room.energyAvailable >= 300) {
            if (this.chamber.creepCountDrones < 1) {
                for (let x in this.chamber.spawns) {
                    this.chamber.spawns[x].spawnCreep([WORK, WORK, CARRY, MOVE], nameBuilder.getName('d'), { memory: { role: 'drone', task: 'idle' } });
                }
            }
            else if (this.chamber.creepCountMiners < 3) this.spawnMiner(400);
            else if (this.chamber.creepCountTransporters < 1){
                for (let x in this.chamber.spawns) {
                    this.chamber.spawns[x].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], nameBuilder.getName('t'), { memory: { role: 'transporter', task: 'idle' } });
                }
            }
            else if (this.chamber.creepCountBuilders < 3) this.spawnBuilder(600);
            else if(this.chamber.creepCountUpgraders < 5) this.spawnUpgrader(400);
        }
    }
    spawnLvl3(){
        if (this.chamber.room.energyAvailable >= 300) {
            if (this.chamber.creepCountMiners < 2) this.spawnMiner(600);
            else if (this.chamber.creepCountTransporters < 1) {
                for (let x in this.chamber.spawns) {
                    this.chamber.spawns[x].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], nameBuilder.getName('t'), { memory: { role: 'transporter', task: 'idle' } });
                }
            }
            else if (this.chamber.creepCountBuilders < Math.min(2, (this.chamber.cSites.length+1)/10)) this.spawnBuilder(600);
            else if (this.chamber.creepCountUpgraders < 4) this.spawnUpgrader(400);
            else if (this.chamber.defenderNeeded) this.spawnDefender(450, this.chamber.defenderNeeded);
            else if (this.chamber.sendScout){
                this.chamber.spawns[0].spawnCreep([TOUGH, MOVE], nameBuilder.getName('scout'), {memory: {role: 'scout', target: this.chamber.sendScout}})
            }
        }
    }
    spawnLvl5(){
        if (this.chamber.room.energyAvailable >= 300) {
            if (this.chamber.creepCountMiners < 2 || !this.chamber.creepCountMiners) this.spawnMiner(600);
            else if (this.chamber.creepCountTransporters < 2 || !this.chamber.creepCountTransporters) {
                for (let x in this.chamber.spawns) {
                    this.chamber.spawns[x].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], nameBuilder.getName('t'), { memory: { role: 'transporter', task: 'idle' } });
                }
            }
            else if (this.chamber.creepCountBuilders < Math.min(2, (this.chamber.cSites.length+1)/10) || !this.chamber.creepCountBuilders) this.spawnBuilder(600);
            else if (this.chamber.creepCountStorageKeepers < 1 || !this.chamber.creepCountStorageKeepers){
                this.chamber.spawns[0].spawnCreep([CARRY, CARRY, MOVE], nameBuilder.getName('sk'), { memory: { role: 'storageKeeper', task: 'idle' } });
            }
            else if (this.chamber.creepCountUpgraders < 2 || !this.chamber.creepCountUpgraders) this.spawnUpgrader(600);
            else if(this.chamber.defenderNeeded) this.spawnDefender(650, this.chamber.defenderNeeded)
            else if(this.chamber.eBuilderNeeded){
                this.chamber.spawns[0].spawnCreep([MOVE, MOVE, WORK, WORK, CARRY, CARRY], nameBuilder.getName('eB'), {memory: { role: 'eBuilder', target: this.chamber.eBuilderNeeded}});
            }
            else if (this.chamber.sendScout){
                this.chamber.spawns[0].spawnCreep([TOUGH, MOVE], nameBuilder.getName('scout'), {memory: {role: 'scout', target: this.chamber.sendScout}})
            }
            else if (this.chamber.claimerNeeded){
                this.chamber.spawns[0].spawnCreep([MOVE, CLAIM], nameBuilder.getName('c'), {memory: { role: 'claimer', target: this.chamber.claimerNeeded}});
            }
        }
    }
}