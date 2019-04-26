nameBuilder = require('nameBuilder');

exports.spawnManager = class{
    constructor(sector){
        this.sector = sector;
        this.role = {};
        for(let i of this.sector.roleNames){
            this.role[i] = 0;
        }
        this.body = [];
        this.spawner = this.sector.spawn[0];
        this.energy = this.sector.room.energyAvailable;
        this.cap = this.sector.room.energyCapacityAvailable;
    }

    spawn(){
        //console.log(this.role.builder, this.role.miner, this.role.transporter, this.role.upgrader, this.role.scout);
        if(this.sector.role.miner > 0 && this.sector.role.transporter > 0 && this.role.upgrader > 0) this.spawnUpgrader();
        else if(this.sector.role.keeper == 0 && this.role.keeper > 0) this.spawnKeeper();
        else if(this.role.transporter > this.role.miner) this.spawnTransporter();
        else if(this.role.miner > 0 && this.sector.role.miner < 8) this.spawnMiner();
        else if(this.role.transporter > 0 && this.sector.role.transporter < 8) this.spawnTransporter();
        else if(this.role.builder > 0 && this.sector.role.builder < 5) this.spawnBuilder();
        else if(this.role.scout > 0) this.spawnScout();
    }

    spawnBuilder(){
        this.body = [MOVE,MOVE,CARRY,CARRY,WORK];
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('b'), {memory: {role: 'builder', sector: this.sector.name}}) == 0){
            nameBuilder.commitName('b');
        }
    }

    spawnKeeper(){
        console.log('Spawn Keeper');
        this.body = [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY];
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('k'), {memory: {role: 'keeper', sector: this.sector.name}}) == 0){
            nameBuilder.commitName('k');
        }
    }
    
    spawnMiner(){
        console.log('Spawn Miner');
        if(this.sector.miner == 0){
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
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('m'), {memory: {role: 'miner', sector: this.sector.name}}) == 0){
            nameBuilder.commitName('m');
        }
    }

    spawnScout(){
        this.body = [MOVE];
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('s'), {memory: {role: 'scout', sector: this.sector.name}}) == 0){
            nameBuilder.commitName('s');
        }
    }

    spawnTransporter(){
        console.log('Spawn Transporter');
        if(this.energy < 300) this.energy = 300;
        let cost = 150;
        let parts = Math.floor(this.energy/cost);
        for(let i=0;i<parts; i++){
            this.body.push(CARRY,CARRY,MOVE);
        }
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('t'), {memory: {role: 'transporter', sector: this.sector.name}}) == 0){
            nameBuilder.commitName('t');
        }
    }
    
    spawnUpgrader(){
        console.log('Spawn Upgrader');
        if(this.energy < 300) this.energy = 300;
        this.energy -= 200;
        let cost = 100;
        let parts = Math.floor(this.energy/cost);
        for(let i=0;i<parts; i++){
            this.body.push(WORK);
        }
        this.body.push(MOVE,CARRY,MOVE,CARRY);
        if(this.spawner.spawnCreep(this.body, nameBuilder.getName('u'), {memory: {role: 'upgrader', sector:this.sector.name}}) == 0){
            nameBuilder.commitName('u');
        }
    }
}