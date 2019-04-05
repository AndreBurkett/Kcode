var miner = {
    run: function (creep) {
        let source = creep.memory.assignment;
        if(creep.carry.energy == creep.carryCapacity){
            console.log(Memory.source[source].transporter.length);
            let pos = new RoomPosition(Memory.source[source].spawnPath.path[0].x, Memory.source[source].spawnPath.path[0].y, Memory.source[source].spawnPath.path[0].roomName);
            let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
            if(container){
                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(container);
            }
            else{
                //let site = pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                //if(creep.build(site) == ERR_NOT_IN_RANGE) creep.moveTo(site);
                let target = Game.getObjectById(source);
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
            }
        }
        else{
            let target = Game.getObjectById(source);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
    }
};
module.exports = miner;