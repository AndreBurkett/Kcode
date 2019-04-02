nameBuilder = require('nameBuilder');

exports.spawnManager = class{
    constructor(){
        this.builder = 0;
        this.miner = 0;
        this.transporter = 0;
        this.upgrader = 0;
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
    
    spawn(){
        if(this.miner > 0) spawnMiner(1);
        else if(this.transporter > 0) this.spawnTransporter();
        else if(this.builder > 0) this.spawnBuilder();
        else if(this.upgrader > 0) this.spawnUpgrader();
    }
}