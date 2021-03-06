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
                {filter: (s) => s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_LINK
            });
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
        else{
            creep.memory.task = 'pickup';
            energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
            if(creep.pickup(energy) == ERR_NOT_IN_RANGE) creep.moveTo(energy);
        }
    }
};
module.exports = upgrader;