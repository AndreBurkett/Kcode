var role = require('role');

exports.keeper = class keeper extends role.role{
    constructor(creep) {
        super(creep);
        
        if(this.assignment){
            let storage = Game.getObjectById(this.assignment);
            if(storage){
                let pos = new RoomPosition(storage.pos.x, storage.pos.y + 2, storage.pos.roomName);
                let link = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK})[0];
                if(this.creep.carry[RESOURCE_ENERGY] == this.creep.carryCapacity){
                    this.creep.transfer()
                    if(this.creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) this.safeMove(link.pos);
                }
                else{
                    if(this.creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) this.safeMove(storage.pos);
                }
            }
        }
    }
}
