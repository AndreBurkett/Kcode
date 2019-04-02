nameBuilder = require('nameBuilder');
sm = require('spawnManager');

exports.assignmentManager = class{
    constructor(){
        this.spawnManager = new sm.spawnManager()
        this.builder = [];
        this.miner = [];
        this.upgrader = [];
        this.transporter = [];
    }

    assignBuilder(site){
        if(this.builder.length > 0 ){
            for(let i in this.builder){
                Memory.construction[site].builder.push(this.builder[i].id);
                this.builder[i].memory.assignment = site;
                this.builder.splice(i,1);
            }
        }
        else this.spawnManager.builder++;
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
                this.spawnManager.miner++;
                return;
            }
        }
        this.spawnManager.miner++;
    }
    
    assignTransporter(source){
        if(this.transporter.length > 0){
            for(let i in this.transporter){
                Memory.source[source].transporter.push(this.transporter[i].id);
                this.transporter[i].memory.assignment = source;
                this.transporter.splice(i,1);
            }
        }
        else this.spawnManager.transporter++;
    }

    assignUpgrader(controller){
        if(this.upgrader.length > 0){
            for(let i in this.upgrader){
                Memory.controller[controller].upgrader.push(this.upgrader[i].id);
                this.upgrader[i].memory.assignment = controller;
                this.upgrader.splice(i,1);
            }
        }
        else this.spawnManager.upgrader++;
    }    
}