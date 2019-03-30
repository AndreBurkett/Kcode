var upgrader = {
    run: function (creep) {
        var target;
        if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'upgrade')){
            creep.memory.task = 'upgrade';
            target = Game.getObjectById(creep.memory.assignment);
            if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
        else if(creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0) || (s.structureType == STRUCTURE_LINK && s.energy > 0)}).length > 0){
            creep.memory.task = 'pickup';
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, 
                {filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= creep.carryCapacity) || (s.structureType == STRUCTURE_LINK && s.energy >= creep.carryCapacity)
                });
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
        else{
            creep.memory.task = 'mine';
            target = creep.room.controller.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
    }
};
module.exports = upgrader;