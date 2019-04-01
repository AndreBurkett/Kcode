var builder = require('role.builder');
var miner = require('role.miner');
var transporter = require('role.transporter');
var upgrader = require('role.upgrader');

exports.creepManager = class{
    constructor(creep){
        switch(creep.memory.role){
            case 'builder':
                builder.run(creep);
                break;
            case 'miner':
                miner.run(creep);
                break;
            case 'transporter':
                transporter.run(creep);
                break;
            case 'upgrader':
                upgrader.run(creep);
                break;
        }
    }
}