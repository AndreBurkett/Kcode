var srcm = require('sourceManager');

var miner = {
    run: function (creep) {
        function build(){
            target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
            if(creep.build(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
            //else creep.drop(RESOURCE_ENERGY);
        }
        var target;
        if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'deposit')){
            creep.memory.task = 'deposit';
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)
            });
            if (!target) build();
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if(creep.pos.getRangeTo(target) <= 2) creep.moveTo(target);
                else build();
            }
        }
        else{
            target = creep.memory.target;
            if(creep.memory.target && target != creep.room.name){
                //creep.moveTo(new RoomPosition(25, 25, target));
            }
            creep.memory.task = 'mine';
            if(creep.memory.target) target = Game.getObjectById(creep.memory.target);
            else {
                let sourceList = creep.room.find(FIND_SOURCES);
                var targetList = [];
                for(let i in sourceList){
                    let src = new srcm.sourceManager(sourceList[i]);
                    if(src.getAvailability()) targetList.push(sourceList[i]);
                }
                target = creep.pos.findClosestByRange(targetList);
                if (target) creep.memory.target = target.id;
            }
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
    }
};
module.exports = miner;