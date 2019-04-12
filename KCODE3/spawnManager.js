nameBuilder = require('nameBuilder');

exports.spawnManager = class{
    constructor(){
        this.builder = 0;
        this.miner = 0;
        this.scout = 0;
        this.transporter = 0;
        this.upgrader = 0;

        this.body = [];
        this.spawner = Game.spawns['Spawn1'];
        this.energy = this.spawner.room.energyAvailable;
    }

    spawn(){
        console.log(this.builder, this.miner, this.transporter, this.upgrader, this.scout);
        if(this.transporter > this.miner) this.spawnTransporter();
        else if(this.miner > 0) this.spawnMiner(1);
        else if(this.transporter > 0) this.spawnTransporter();
        else if(this.upgrader > 0) this.spawnUpgrader();
        else if(this.builder > 0) this.spawnBuilder();
        else if(this.scout > 0) this.spawnScout();
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

    spawnScout(){
        this.body = [MOVE];
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('s'), {memory: {role: 'scout'}}) == 0){
            nameBuilder.commitName('s');
        }
    }

    spawnTransporter(){
        if(this.energy < 300) this.energy = 300;
        let cost = 150;
        let parts = Math.floor(this.energy/cost);
        for(let i=0;i<parts; i++){
            this.body.push(CARRY,CARRY,MOVE);
        }
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('t'), {memory: {role: 'transporter'}}) == 0){
            nameBuilder.commitName('t');
        }
    }
    
    spawnUpgrader(){
        if(this.energy < 300) this.energy = 300;
        this.energy -= 100;
        let cost = 100;
        let parts = Math.floor(this.energy/cost);
        for(let i=0;i<parts; i++){
            this.body.push(WORK);
        }
        this.body.push(CARRY,MOVE)
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('u'), {memory: {role: 'upgrader'}}) == 0){
            nameBuilder.commitName('u');
        }
    }
}