exports.transporter = class{
    constructor(creep){
        this.assignmentId = creep.memory.assignment;
        this.assignment = Game.getObjectById(creep.memory.assignment);
        if(this.assignment){
            if(Memory.source[this.assignmentId]) sourceTransport();
            else if(Memory.controller[this.assignmentId]) controllerTransport();    
        }
    }

    sourceTransport(){
        if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'deposit')){
            creep.memory.task = 'deposit';
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)});
                if (!target) target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)});
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        else{
            creep.memory.task = 'withdraw';
            let source = creep.memory.assignment;
            if(source && Memory.source[source].spawnPath){
                let pos = new RoomPosition(Memory.source[source].spawnPath.path[0].x, Memory.source[source].spawnPath.path[0].y, Memory.source[source].spawnPath.path[0].roomName);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                if(container && container.store[RESOURCE_ENERGY] >= creep.carryCapacity){
                    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(container);
                    }
                }
                else{
                    energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                    if(creep.pickup(energy) == ERR_NOT_IN_RANGE) creep.moveTo(energy);
                }
            }
       }
       
    }

    controllerTransport(){
        if(creep.carry.energy == creep.carryCapacity || (creep.carry.energy > 0 && creep.memory.task == 'deposit')){
            creep.memory.task = 'deposit';
            if(this.assignmentId && Memory.controller[this.assignmentId].spawnPath){
                let pos = new RoomPosition(Memory.controller[this.assignmentId].spawnPath.path[0].x, Memory.controller[this.assignmentId].spawnPath.path[0].y, Memory.controller[this.assignmentId].spawnPath.path[0].roomName);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                if(container){
                    if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
                else if(Memory.controller[this.assignmentId].upgrader[0]){
                    let upgrader = Game.getObjectById(Memory.controller[this.assignmentId].upgrader[0]);
                    if(upgrader){
                        if (creep.transfer(upgrader, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(upgrader);
                        }
                    }
                }
            }
        }
        else{
            creep.memory.task = 'withdraw';
            if(this.assignmentId && Memory.controller[this.assignmentId].spawnPath){
                let pos = new RoomPosition(Memory.controller[this.assignmentId].spawnPath.path[0].x, Memory.controller[this.assignmentId].spawnPath.path[0].y, Memory.controller[this.assignmentId].spawnPath.path[0].roomName);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s != container) && (s.structureType == STRUCTURE_CONTAINER || s.structureType == s.structureType == STRUCTURE_STORAGE) && s.energy > creep.carry.energy
                });
                if(target){
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                }
                else{
                    energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                    if(creep.pickup(energy) == ERR_NOT_IN_RANGE) creep.moveTo(energy);
                }
            }
            else{
                energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                if(creep.pickup(energy) == ERR_NOT_IN_RANGE) creep.moveTo(energy);
            }
        }  
    }
}