var role = require('role');

exports.miner = class miner extends role.role{
    constructor(creep) {
        super(creep);
        
        this.assignment = this.creep.memory.assignment;
        if(this.assignment){
            if(this.creep.carry.energy == this.creep.carryCapacity){
                if(Memory.source[this.assignment].transporter.length == 0){
                    this.transport();
                }
                else{
                    this.dump();
                }
            }
            else{
                let target = Game.getObjectById(this.assignment);
                if(target){
                    if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) this.safeMove(target.pos);
                }
                else{
                    target = new RoomPosition(Memory.source[this.assignment].pos.x, Memory.source[this.assignment].pos.y, Memory.source[this.assignment].pos.roomName);
                    this.safeMove(target);
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
                this.safeMove(target.pos);
            }
        }
        else this.dump();
    }

    dump(){
        let pos = new RoomPosition(Memory.source[this.assignment].spawnPath.path[0].x, Memory.source[this.assignment].spawnPath.path[0].y, Memory.source[this.assignment].spawnPath.path[0].roomName);
        let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
        if(container){
            if(this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) this.safeMove(container.pos);
        }
        else{
            let target = Game.getObjectById(this.assignment);
            if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) this.safeMove(target.pos);
        }
    }
}
