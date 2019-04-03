var builder = {
    run: function (creep) {
        var target;
        if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'build')){
            creep.memory.task = 'build';
            console.log(Game.constructionSites[creep.memory.assignment]);
            target = Game.getObjectById(creep.memory.assignment);
            if(target){
                if(creep.build(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
            }
        }
        else if(creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0}).length > 0){
            creep.memory.task = 'pickup';
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > creep.carryCapacity});
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
        else{
            creep.memory.task = 'pickup';
            target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
            if (creep.pickup(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
    }
};
module.exports = builder;