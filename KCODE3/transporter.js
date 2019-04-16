var role = require('role');

exports.transporter = class transporter extends role.role{
    constructor(creep){
        super(creep);

        this.assignmentObj = Game.getObjectById(creep.memory.assignment);
        if(this.assignmentObj){
            if(Memory.source[this.assignment]) this.sourceTransport();
            else if(Memory.controller[this.assignment]) this.controllerTransport();    
        }
        else{
            if(Memory.source[this.assignment]){
                let pos = this.getPos(Memory.source[this.assignment].pos)
                this.safeMove(pos);
            }
            else if(Memory.controller[this.assignment]){
                let pos = this.getPos(Memory.controller[this.assignment].pos);
                this.safeMove(pos);
            }
        }
    }

    sourceTransport(){
        if(this.creep.carry.energy == this.creep.carryCapacity || (this.creep.carry.energy > 0 && this.creep.memory.task == 'deposit')){
            console.log(this.creep.name);
            this.creep.memory.task = 'deposit';
            let target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)
            });
            if(!target) target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_LINK && s.energy < s.energyCapacity)});
            if(!target) target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)});
            if(!target){
                let l = Memory.source[this.assignment].spawnPath.path.length - 1;
                let path = Memory.source[this.assignment].spawnPath.path[l];
                if(this.creep.room.name == path.roomName){
                    this.sendUpgraderRequest(this.creep.room.name);
                }
                else{
                    let pos = new RoomPosition(path.x, path.y, path.roomName);
                    this.safeMove(pos);
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
                        this.safeMove(container.pos);
                    }
                }
                else{
                    let energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                    if(this.creep.pickup(energy) == ERR_NOT_IN_RANGE) this.safeMove(energy.pos);
                }
            }
       }
       
    }

    controllerTransport(){
        if(this.creep.carry.energy == this.creep.carryCapacity || (this.creep.carry.energy > 0 && this.creep.memory.task == 'deposit')){
            this.creep.memory.task = 'deposit';
            if(this.assignment && Memory.controller[this.assignment].spawnPath){
                let pos = new RoomPosition(Memory.controller[this.assignment].spawnPath.path[0].x, Memory.controller[this.assignment].spawnPath.path[0].y, Memory.controller[this.assignment].spawnPath.path[0].roomName);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                if(container){
                    if (this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.safeMove(container.pos);
                    }
                }
                else if(Memory.controller[this.assignment].upgrader[0]){
                    let upgrader = Game.getObjectById(Memory.controller[this.assignment].upgrader[0]);
                    if(upgrader){
                        if (this.creep.transfer(upgrader, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            this.safeMove(upgrader.pos);
                        }
                    }
                }
            }
        }
        else{
            this.creep.memory.task = 'withdraw';
            if(this.assignment && Memory.controller[this.assignment].spawnPath){
                let pos = new RoomPosition(Memory.controller[this.assignment].spawnPath.path[0].x, Memory.controller[this.assignment].spawnPath.path[0].y, Memory.controller[this.assignment].spawnPath.path[0].roomName);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                let target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s != container) && (s.structureType == STRUCTURE_CONTAINER || s.structureType == s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > this.creep.carry.energy
                });
                if(target){
                    if(this.creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        this.safeMove(target.pos);
                    }
                }
                else{
                    let energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                    if(this.creep.pickup(energy) == ERR_NOT_IN_RANGE) this.safeMove(energy.pos);
                }
            }
            else{
                let energy = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
                if(this.creep.pickup(energy) == ERR_NOT_IN_RANGE) this.safeMove(energy.pos);
            }
        }  
    }
    sendUpgraderRequest(name){
        let id = Game.rooms[name].controller.id;
        if(id){
            Memory.controller[id].upgraderRequest = 1;
        }
    }
}