var role = require('role');

exports.miner = class miner extends role.role{
    constructor(creep) {
        super(creep);
        
        let source = this.creep.memory.assignment;
        if(source){
            if(this.creep.carry.energy == this.creep.carryCapacity){
                if(Memory.source[source].transporter.length == 0){
                    this.transport();
                }
                else{
                    this.dump();
                }
            }
            else{
                let target = Game.getObjectById(source);
                if(target){
                    if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) this.creep.moveTo(target);
                }
                else{
                    target = new RoomPosition(Memory.source[source].pos.x, Memory.source[source].pos.y, Memory.source[source].pos.roomName);
                    this.creep.moveTo(target);
                }
            }
        }
    }
    transport(){
        let target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)
        });
        if (target){
            if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }
        }
        else this.dump();
    }

    dump(){
        let pos = new RoomPosition(Memory.source[source].spawnPath.path[0].x, Memory.source[source].spawnPath.path[0].y, Memory.source[source].spawnPath.path[0].roomName);
        let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
        if(container){
            if(this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) this.creep.moveTo(container);
        }
        else{
            let target = Game.getObjectById(source);
            if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) this.creep.moveTo(target);
        }
    }
}
