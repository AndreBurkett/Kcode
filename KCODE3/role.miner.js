var miner = {
    run: function (creep) {
        function transport(){
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)
            });
            if (target){
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else dump();
        }

        function dump(){
            let pos = new RoomPosition(Memory.source[source].spawnPath.path[0].x, Memory.source[source].spawnPath.path[0].y, Memory.source[source].spawnPath.path[0].roomName);
            let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
            if(container){
                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(container);
            }
            else{
                let target = Game.getObjectById(source);
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
            }
        }
        
        let source = creep.memory.assignment;
        if(creep.carry.energy == creep.carryCapacity){
            if(Memory.source[source].transporter.length == 0){
                transport();
            }
            else{
                dump();
            }
        }
        else{
            let target = Game.getObjectById(source);
            if(target){
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
            }
            else{
                //target = new RoomPosition(Memory.source[source].pos.x, Memory.source[source].pos.y, Memory.source[source].pos.roomName);
                creep.moveTo(target);
            }
        }
    }
};
module.exports = miner;