var acolyte = require('role.acolyte');
var builder = require('role.builder');
var claimer = require('role.claimer');
var defender = require('role.defender');
var drone = require('role.drone');
var eBuilder = require('role.eBuilder');
var miner = require('role.miner');
var scout = require('role.scout');
var storageKeeper = require('role.storageKeeper')
var transporter = require('role.transporter');
var upgrader = require('role.upgrader');

exports.creepManager = class{
    constructor(creep){
        switch(creep.memory.role){
            case 'acolyte':
                acolyte.run(creep);
                break;
            case 'builder':
                builder.run(creep);
                break;
            case 'claimer':
                claimer.run(creep);
                break;
            case 'defender':
                defender.run(creep);
                break;
            case 'drone':
                drone.run(creep);
                break;
            case 'eBuilder':
                eBuilder.run(creep);
                break;
            case 'miner':
                miner.run(creep);
                break;
            case 'scout':
                scout.run(creep);
                break;
            case 'storageKeeper':
                storageKeeper.run(creep);
                break;
            case 'transporter':
                if(creep.ticksToLive < 25 && creep.carry == 0) creep.suicide();
                else transporter.run(creep);
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