exports.transporter = class{
    constructor(creep){
        this.creep = creep;
        this.assignmentId = creep.memory.assignment;
        this.assignment = Game.getObjectById(creep.memory.assignment);
        if(this.assignment){
            if(Memory.source[this.assignmentId]) this.sourceTransport();
            else if(Memory.controller[this.assignmentId]) this.controllerTransport();    
        }
    }

    sourceTransport(){
        if(this.creep.carry.energy == this.creep.carryCapacity || (this.creep.carry.energy > 0 && this.creep.memory.task == 'deposit')){
            this.creep.memory.task = 'deposit';
            let target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)});
                if(!target) target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_LINK && s.energy < s.energyCapacity)});
                if(!target) target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)});
                if(!target){
                    let l = Memory.source[this.assignmentId].spawnPath.path.length - 1;
                    let path = Memory.source[this.assignmentId].spawnPath.path[l];
                    if(this.creep.room.name == path.roomName){
                        this.sendUpgraderRequest(this.creep.room.name);
                    }
                    else{
                        let pos = new RoomPosition(path.x, path.y, path.roomName);
                        this.creep.moveTo(pos);
                        return;
                    }
                }
                    
                if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                }
            }
        else{
            this.creep.memory.task = 'withdraw';
            let source = this.creep.memory.assignment;
            if(source && Memory.source[source].spawnPath){
                let pos = new RoomPosition(Memory.source[source].spawnPath.path[0].x, Memory.source[source].spawnPath.path[0].y, Memory.source[source].spawnPath.path[0].roomName);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                if(container && container.store[RESOURCE_ENERGY] >= this.creep.carryCapacity){
                    if(this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        this.creep.moveTo(container);
                    }
                }
                else{
                    let energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                    if(this.creep.pickup(energy) == ERR_NOT_IN_RANGE) this.creep.moveTo(energy);
                }
            }
       }
       
    }

    controllerTransport(){
        if(this.creep.carry.energy == this.creep.carryCapacity || (this.creep.carry.energy > 0 && this.creep.memory.task == 'deposit')){
            this.creep.memory.task = 'deposit';
            if(this.assignmentId && Memory.controller[this.assignmentId].spawnPath){
                let pos = new RoomPosition(Memory.controller[this.assignmentId].spawnPath.path[0].x, Memory.controller[this.assignmentId].spawnPath.path[0].y, Memory.controller[this.assignmentId].spawnPath.path[0].roomName);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                if(container){
                    if (this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(container);
                    }
                }
                else if(Memory.controller[this.assignmentId].upgrader[0]){
                    let upgrader = Game.getObjectById(Memory.controller[this.assignmentId].upgrader[0]);
                    if(upgrader){
                        if (this.creep.transfer(upgrader, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(upgrader);
                        }
                    }
                }
            }
        }
        else{
            this.creep.memory.task = 'withdraw';
            if(this.assignmentId && Memory.controller[this.assignmentId].spawnPath){
                let pos = new RoomPosition(Memory.controller[this.assignmentId].spawnPath.path[0].x, Memory.controller[this.assignmentId].spawnPath.path[0].y, Memory.controller[this.assignmentId].spawnPath.path[0].roomName);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                let target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s != container) && (s.structureType == STRUCTURE_CONTAINER || s.structureType == s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > this.creep.carry.energy
                });
                if(target){
                    if(this.creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        this.creep.moveTo(target);
                    }
                }
                else{
                    let energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                    if(this.creep.pickup(energy) == ERR_NOT_IN_RANGE) this.creep.moveTo(energy);
                }
            }
            else{
                let energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                if(this.creep.pickup(energy) == ERR_NOT_IN_RANGE) this.creep.moveTo(energy);
            }
        }  
    }
    sendUpgraderRequest(name){
        let id = Game.rooms[name].controller.id;
        if(id){
            console.log(id);
            console.log(Memory.controller['id']);
            Memory.controller['id'].upgraderRequest++;
        }
    }
}