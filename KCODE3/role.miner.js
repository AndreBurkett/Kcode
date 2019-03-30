var miner = {
    run: function (creep) {
        var target = Game.getObjectById(creep.memory.assignment);
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
    }
};
module.exports = miner;