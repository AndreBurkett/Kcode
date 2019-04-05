nameBuilder = require('nameBuilder');

exports.spawnManager = class{
    constructor(){
        this.builder = 0;
        this.miner = 0;
        this.transporter = 0;
        this.upgrader = 0;

        this.body = [];
        this.spawner = Game.spawns['Spawn1'];
        this.energy = this.spawner.room.energyAvailable;
    }

    spawn(){
        console.log(this.builder, this.miner, this.transporter, this.upgrader);
        if(this.miner > 0) this.spawnMiner(1);
        else if(this.transporter > 0) this.spawnTransporter();
        else if(this.builder > 0) this.spawnBuilder();
        else if(this.upgrader > 0) this.spawnUpgrader();
    }

    spawnBuilder(){
        this.body = [MOVE,MOVE,CARRY,CARRY,WORK];
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('b'), {memory: {role: 'builder'}}) == 0){
            nameBuilder.commitName('b');
        }
    }
    
    spawnMiner(workParts){
        this.body = [MOVE,CARRY,WORK,WORK];
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('m'), {memory: {role: 'miner'}}) == 0){
            nameBuilder.commitName('m');
        }
    }

    spawnTransporter(){
        if(this.energy < 300) this.energy = 300;
        let cost = 150;
        for(let i=0;i<this.energy; i+=cost){
            this.body.push(CARRY,CARRY,MOVE);
        }
        console.log(this.body);
        console.log(this.spawner.spawnCreep(this.body, nameBuilder.getName('t'), {memory: {role: 'transporter'}}));
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('t'), {memory: {role: 'transporter'}}) == 0){
            nameBuilder.commitName('t');
        }
    }
    
    spawnUpgrader(){
        if(this.energy < 300) this.energy = 300;
        this.energy -= 100;
        let cost = 100;
        for(let i=0;i<this.energy; i+=cost){
            this.body.push(WORK);
        }
        this.body.push(CARRY,MOVE)
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('u'), {memory: {role: 'upgrader'}}) == 0){
            nameBuilder.commitName('u');
        }
    }
}