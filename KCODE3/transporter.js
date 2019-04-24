var role = require('role');

exports.transporter = class transporter extends role.role{
    constructor(creep){
        super(creep);

        this.assignmentObj = Game.getObjectById(creep.memory.assignment);
        if(this.assignmentObj){
            if(Memory.sector[this.creep.memory.sector].source[this.assignment]) this.sourceTransport();
            else if(Memory.sector[this.creep.memory.sector].controller[this.assignment]) this.controllerTransport();    
        }
        else if(this.creep.memory.task != 'deposit'){
            if(Memory.sector[this.creep.memory.sector].source[this.assignment]){
                let pos = this.getPos(Memory.sector[this.creep.memory.sector].source[this.assignment].pos)
                this.safeMove(pos);
            }
            else if(Memory.sector[this.creep.memory.sector].controller[this.assignment]){
                let pos = this.getPos(Memory.sector[this.creep.memory.sector].controller[this.assignment].pos);
                this.safeMove(pos);
            }
        }
    }

    sourceTransport(){
        if(this.creep.carry.energy == this.creep.carryCapacity || (this.creep.carry.energy > 0 && this.creep.memory.task == 'deposit')){
            this.creep.memory.task = 'deposit';
            let target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity) || ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity)
            });
            if(!target) target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)});
            if(!target){
                let l = Memory.sector[this.creep.memory.sector].source[this.assignment].spawnPath.path.length - 1;
                let pos = this.getPos(Memory.sector[this.creep.memory.sector].source[this.assignment].spawnPath.path[l]);
                this.safeMove(pos);
                return 'NO TARGET';
            }
            if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.safeMove(target.pos);
            }
        }
        else{
            this.creep.memory.task = 'withdraw';
            let source = this.creep.memory.assignment;
            if(source && Memory.sector[this.creep.memory.sector].source[source].spawnPath){
                let pos = this.getPos(Memory.sector[this.creep.memory.sector].source[source].spawnPath.path[0]);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                if(container && container.store[RESOURCE_ENERGY] && container.store[RESOURCE_ENERGY] >= this.creep.carryCapacity){
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
            if(this.assignment && Memory.sector[this.creep.memory.sector].controller[this.assignment].spawnPath){v
                let pos = this.getPos(Memory.sector[this.creep.memory.sector].controller[this.assignment].spawnPath.path[0]);
                let container = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                if(container){
                    if (this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.safeMove(container.pos);
                    }
                }
                else if(Memory.sector[this.creep.memory.sector].controller[this.assignment].upgrader[0]){
                    let upgrader = Game.getObjectById(Memory.sector[this.creep.memory.sector].controller[this.assignment].upgrader[0]);
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
            if(this.assignment && Memory.sector[this.creep.memory.sector].controller[this.assignment].spawnPath){
                let pos = this.getPos(Memory.sector[this.creep.memory.sector].controller[this.assignment].spawnPath.path[0]);
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
            Memory.sector[this.creep.memory.sector].controller[id].upgraderRequest = 1;
        }
    }
}