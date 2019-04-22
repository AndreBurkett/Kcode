var role = require('role');

exports.builder = class builder extends role.role{
    constructor(creep) {
        super(creep);
        var target;

        if(this.creep.carry.energy == this.creep.carryCapacity || (this.creep.carry.energy > 0 && this.creep.memory.task == 'build')){
            this.creep.memory.task = 'build';
            target = Game.constructionSites[this.assignment];
            console.log(target);
            if(target){
                if(this.creep.build(target) == ERR_NOT_IN_RANGE) this.safeMove(target.pos);
            }
            else{
                delete this.creep.memory.assignment;
                target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax});
                if(target){
                    if(this.creep.repair(target) == ERR_NOT_IN_RANGE) this.safeMove(target.pos);
                }
            }
        }
        else if(this.creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0}).length > 0){
            this.creep.memory.task = 'pickup';
            target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.creep.carryCapacity});
            if(this.creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) this.safeMove(target);
        }
        else{
            this.creep.memory.task = 'pickup';
            target = this.creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
            if (this.creep.pickup(target) == ERR_NOT_IN_RANGE) this.safeMove(target);
        }
    }
}