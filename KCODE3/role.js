exports.role = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
    }

    safeMove(pos){
        if(this.creep.memory.path){
            let len = this.creep.memory.path.length - 1;
            let pos = new RoomPosition(this.creep.memory.path[len].x, this.creep.memory.path[len].y, this.creep.memory.path[len].roomName);
            if(pos == creep.pos){
                delete creep.memory.path;
                this.safePath(pos);
            }
        }
        else this.safePath(pos);
        this.creep.moveByPath(this.creep.memory.path);
    }

    safePath(pos){
        let p = PathFinder.search(this.creep.pos, {pos:pos, range:1}, {
            roomCallback: function(roomName) {
                if(Memory.sector[roomName].CostMatrix){
                    let costs = PathFinder.CostMatrix.deserialize(Memory.sector[roomName].CostMatrix);
                    return costs;
                }
            }
        });
        this.creep.memory.path = p.path;
    }
}