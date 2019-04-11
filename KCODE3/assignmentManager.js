nameBuilder = require('nameBuilder');
sm = require('spawnManager');

exports.assignmentManager = class{
    constructor(){
        this.spawnManager = new sm.spawnManager()
        this.builder = [];
        this.miner = [];
        this.scout = [];
        this.upgrader = [];
        this.transporter = [];
    }

    assignBuilder(site, type){
        if(this.builder.length > 0 ){
            for(let i in this.builder){
                Memory.construction[type][site].builder.push(this.builder[i].id);
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
    assignScout(assignment){
        if(this.scout.length > 0){
            if(Memory.sector[assignment]){
                Memory.sector[assignment].scout.push(this.scout[0].id);
                this.scout[0].memory.assignment = assignment;
                this.scout.slice(0,1);
            }
        }
        else this.spawnManager.scout++;
    }
    assignTransporter(assignment){
        if(this.transporter.length > 0){
            for(let i in this.transporter){
                if(Memory.source[assignment]){
                    Memory.source[assignment].transporter.push(this.transporter[i].id);
                }
                else if(Memory.controller[assignment]){
                    Memory.controller[assignment].transporter.push(this.transporter[i].id);
                }
                this.transporter[i].memory.assignment = assignment;
                this.transporter.splice(i,1);
            }
        }
        else this.spawnManager.transporter++;
    }

    assignUpgrader(controller){
        if(Memory.controller[controller].upgraderRequest > 0){
            Memory.controller[controller].upgraderRequest--;
        }
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