var miner = {
    run: function (creep) {
        let source = creep.memory.assignment;
        if(creep.carry.energy == creep.carryCapacity){
            let pos = new RoomPosition(Memory.source[source].spawnPath.path[0].x, Memory.source[source].spawnPath.path[0].y, Memory.source[source].spawnPath.path[0].roomName);
            let container = pos.lookFor(STRUCTURE_CONTAINER)[0];
            let site = _.find(pos.look(), function(s){s.structureType == STRUCTURE_CONTAINER});
            console.log(site);
            switch(creep.transfer(container, RESOURCE_ENERGY)){
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(container);
                    break;
                case ERR_INVALID_TARGET:
                    creep.build(container);
                    break;
            }
        }
        else{
            let target = Game.getObjectById(source);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
    }
};
module.exports = miner;