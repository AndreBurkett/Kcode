var role = require('role');

exports.miner = class miner extends role.role{
    constructor(creep) {
        super(creep);
        
        if(this.assignment){
            this.source = Game.getObjectById(this.assignment);
            if(this.creep.carry.energy == this.creep.carryCapacity){
                if(Memory.sector[this.creep.memory.sector].source[this.assignment].transporter.length == 0){
                    this.transport();
                }
                else{
                    this.dump();
                }
            }
            else{
                if(this.source){
                    if(this.creep.harvest(this.source) == ERR_NOT_IN_RANGE) this.safeMove(this.source.pos);
                }
                else{
                    let pos = this.getPos(Memory.sector[this.creep.memory.sector].source[this.assignment].pos);
                    this.safeMove(pos);
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
        let pos = new RoomPosition(Memory.sector[this.creep.memory.sector].source[this.assignment].spawnPath.path[0].x, Memory.sector[this.creep.memory.sector].source[this.assignment].spawnPath.path[0].y, Memory.sector[this.creep.memory.sector].source[this.assignment].spawnPath.path[0].roomName);
        let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
        if(container){
            if(this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) this.safeMove(container.pos);
        }
        else{
            if(this.creep.harvest(this.source) == ERR_NOT_IN_RANGE) this.safeMove(this.source.pos);
        }
    }
}
