var miner = {
    run: function (creep) {
        let source = creep.memory.assignment;
        if(creep.carry.energy == creep.carryCapacity){
            let pos = new RoomPosition(Memory.source[source].spawnPath.path[0].x, Memory.source[source].spawnPath.path[0].y, Memory.source[source].spawnPath.path[0].roomName);
            let container = pos.lookFor(STRUCTURE_CONTAINER)[0];
            if(creep.transfer(container, RESOURCE_ENERGY == ERR_NOT_IN_RANGE)){
                creep.build(container);
            }
        }
        else{
            let target = Game.getObjectById(source);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
    }
};
module.exports = miner;