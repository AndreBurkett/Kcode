var acolyte = {
    run: function (creep) {
        var target;
        if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'upgrade')){
            creep.memory.task = 'upgrade';
            target = creep.room.controller;
            if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
        else{
            creep.memory.task = 'mine';
            target = creep.room.controller.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
    }
};
module.exports = acolyte;