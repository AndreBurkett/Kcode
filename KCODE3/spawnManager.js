nameBuilder = require('nameBuilder');

exports.spawnManager = class{
    constructor(sc){
        this.sc = sc;
        this.builder = 0;
        this.miner = 0;
        this.scout = 0;
        this.transporter = 0;
        this.upgrader = 0;

        this.body = [];
        this.spawner = Game.spawns['Spawn1'];
        this.energy = this.spawner.room.energyAvailable;
        this.cap = this.spawner.room.energyCapacityAvailable;
    }

    spawn(){
        //console.log(this.builder, this.miner, this.transporter, this.upgrader, this.scout);
        if(this.sc.miners > 0 && this.sc.transporters > 0 && this.upgrader > 0) this.spawnUpgrader();
        else if(this.transporter > this.miner) this.spawnTransporter();
        else if(this.miner > 0 && this.sc.miners < 8) this.spawnMiner();
        else if(this.transporter > 0 && this.sc.transporters < 8) this.spawnTransporter();
        else if(this.builder > 0 && this.sc.builders < 5) this.spawnBuilder();
        else if(this.scout > 0) this.spawnScout();
    }

    spawnBuilder(){
        this.body = [MOVE,MOVE,CARRY,CARRY,WORK];
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('b'), {memory: {role: 'builder', sc:this.sc.name}}) == 0){
            nameBuilder.commitName('b');
        }
    }
    
    spawnMiner(){
        if(this.sc.miners == 0){
            this.body = [MOVE,CARRY,WORK,WORK];
        }
        else{
            let energy = Math.min(this.cap, 500);
            let parts = Math.floor(energy/100);
            for(let i = 0; i<parts; i++){
                this.body.push(WORK);
            }
            this.body.push(MOVE,CARRY)
        }
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('m'), {memory: {role: 'miner', sc:this.sc.name}}) == 0){
            nameBuilder.commitName('m');
        }
    }

    spawnScout(){
        this.body = [MOVE];
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('s'), {memory: {role: 'scout', sc:this.sc.name}}) == 0){
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
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('t'), {memory: {role: 'transporter', sc:this.sc.name}}) == 0){
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
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('u'), {memory: {role: 'upgrader', sc:this.sc.name}}) == 0){
            nameBuilder.commitName('u');
        }
    }
}