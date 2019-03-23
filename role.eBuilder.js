var srcm = require('sourceManager');

var eBuilder = {
    run: function (creep) {
        var target = creep.memory.target;
        if(creep.room.name == target){
            
            if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'build')){
                creep.memory.task = 'build';
                target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
                if(!target){
                    target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                }
                if(creep.build(target) == ERR_NOT_IN_RANGE) creep.moveTo(target, {reusePath: 10});
            }
            else{
                creep.memory.task = 'mine';
                if(creep.memory.mineTarget) target = Game.getObjectById(creep.memory.mineTarget);
                else {
                    let sourceList = creep.room.find(FIND_SOURCES);
                    var targetList = [];
                    for(let i in sourceList){
                        let src = new srcm.sourceManager(sourceList[i]);
                        if(src.getAvailability()) targetList.push(sourceList[i]);
                    }
                    target = creep.pos.findClosestByRange(targetList);
                    if (target) creep.memory.mineTarget = target.id;
                }
                if (creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target, {reusePath: 10});
            }
        }
        else if(creep.carry.energy == creep.carryCapacity) creep.moveTo(new RoomPosition(25, 25, target));
        else{
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, 
                {filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= creep.carryCapacity) || (s.structureType == STRUCTURE_LINK && s.energy >= creep.carryCapacity)
                });
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
    }
};
module.exports = eBuilder;