exports.role = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
    }

    safeMove(pos){
        let cpu = Game.cpu.getUsed();
        console.log(this.creep.memory.role, pos);
        if(this.creep.memory.path && this.creep.memory.path.length > 0){
            let len = this.creep.memory.path.length - 1;
            let pos1 = this.getPos(this.creep.memory.path[len]);
            if(!pos.isEqualTo(pos1)) this.safePath(pos);
        }
        else if(this.creep.pos.roomName == pos.roomName){
            this.creep.moveTo(pos);
        }
        else this.safePath(pos);
        if(this.creep.memory && this.creep.memory.path && this.creep.memory.path[0]){
            let mpos = this.getPos(this.creep.memory.path[0]);
            switch(this.creep.move(this.creep.pos.getDirectionTo(mpos))){
                case OK:
                    this.creep.memory.path.splice(0,1);
                    break;
                case ERR_NOT_IN_RANGE:
                    this.safePath(pos);
                    break;
            }
        }
        else this.creep.moveTo(pos);
        Memory.moveCpu += Game.cpu.getUsed() - cpu;
    }

    safePath(pos){
        let p = PathFinder.search(this.creep.pos, {pos:pos, range:1}, {
            maxOps: 2000,
            roomCallback: function(roomName) {
                console.log(this.creep);
                if(Memory.sector[this.creep.memory.sector].subSector[roomName]){
                    if(Memory.sector[this.creep.memory.sector].subSector[roomName].CostMatrix){
                        let costs = PathFinder.CostMatrix.deserialize(Memory.sector[this.creep.memory.sector].subSector[roomName].CostMatrix);
                        return costs;
                    }
                }
                else Memory.sector[this.creep.memory.sector].subSector[roomName] = {};
                let costs = new PathFinder.CostMatrix();
                Memory.sector[this.creep.memory.sector].subSector[roomName].CostMatrix = costs;
                return costs;
            }
        });
        this.creep.memory.path = p.path;
    }
    getPos(mem){
        return new RoomPosition(mem.x, mem.y, mem.roomName);
    }
}