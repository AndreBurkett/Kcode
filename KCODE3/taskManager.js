var miner = require('role.miner');

exports.creepManager = class{
    constructor(creep){
        switch(creep.memory.role){
            case 'miner':
                miner.run(creep);
                break;
        }
    }
}