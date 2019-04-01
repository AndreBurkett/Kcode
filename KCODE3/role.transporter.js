var transporter = {
    run: function (creep) {
        
        if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'deposit')){
            creep.memory.task = 'deposit';
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)});
                if (!target) target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)});
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        else{
            creep.memory.task = 'withdraw';
            let source = creep.memory.assignment;
            if (source){
                let pos = new RoomPosition(Memory.source[source].spawnPath.path[0].x, Memory.source[source].spawnPath.path[0].y, Memory.source[source].spawnPath.path[0].roomName);
                let container = pos.lookFor(STRUCTURE_CONTAINER)[0];
                if(container && container.store >= creep.carryCapacity){
                    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(container);
                    }
                }
                else{
                    energy = pos.findClosestByRange(FIND_DROPPED_ENERGY);
                    if(creep.pickup(energy) == ERR_NOT_IN_RANGE) creep.moveTo(energy);
                }
            }
       }
       
    }
};
module.exports = transporter;