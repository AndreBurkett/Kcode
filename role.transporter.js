var transporter = {
    run: function (creep) {
        var target;
        if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'deposit')){
            creep.memory.task = 'deposit';
            delete creep.memory.pickupTarget;
            delete creep.memory.withdrawTarget;
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)});
            if (!target) target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)});
            if (!target) creep.memory.task = 'idle';
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            creep.memory.task = 'pickup';
            if(creep.memory.withdrawTarget){
                target = Game.getObjectById(creep.memory.withdrawTarget);
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
            }
            else if(creep.memory.pickupTarget){
                target = Game.getObjectById(creep.memory.pickupTarget);
                if (creep.pickup(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
            }
            else{
                var targetList = creep.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= s.storeCapacity*0.75 });
                if(targetList.length > 0){
                    target = creep.pos.findClosestByRange(targetList);
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
                    creep.memory.withdrawTarget = target.id
                }
                else{
                    targetList = creep.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= creep.carryCapacity});
                    if(targetList.length > 0){
                        target = creep.pos.findClosestByRange(targetList);
                        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
                        creep.memory.withdrawTarget = target.id
                    }
                    else {
                        target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                        if (creep.pickup(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
                        //creep.memory.pickupTarget = target.id
                    }
                }
            }            
        }
    }
};
module.exports = transporter;