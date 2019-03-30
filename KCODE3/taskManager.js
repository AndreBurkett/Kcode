var miner = require('role.miner');
var upgrader = require('role.upgrader');

exports.creepManager = class{
    constructor(creep){
        switch(creep.memory.role){
            case 'miner':
                miner.run(creep);
                break;
            case 'upgrader':
                upgrader.run(creep);
                break;
        }
    }
}