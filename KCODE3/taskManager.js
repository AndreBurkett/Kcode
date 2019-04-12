var builder = require('role.builder');
var m = require('role.miner');
var s = require('scout');
var t = require('transporter');
var upgrader = require('role.upgrader');

exports.creepManager = class{
    constructor(creep){
        var run;
        switch(creep.memory.role){
            case 'builder':
                builder.run(creep);
                break;
            case 'miner':
                run = new m.miner(creep);
                break;
            case 'scout':
                run = new s.scout(creep);
                break;
            case 'transporter':
                run = new t.transporter(creep);
                break;
            case 'upgrader':
                upgrader.run(creep);
                break;
        }
    }
}

exports.towerManager = class{
    constructor(tower){
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) tower.attack(target);
        else if(tower.energy >= 500){
            target = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.hits < 2000 && s.hits < s.hitsMax});
            tower.repair(target);
        }
    }
}