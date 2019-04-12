exports.role = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
    }

    safeMove(pos){
        if(this.creep.memory.path){
            let len = this.creep.memory.path.length - 1;
            let pos = new RoomPosition(this.creep.memory.path[len].x, this.creep.memory.path[len].y, this.creep.memory.path[len].roomName);
            if(pos == this.creep.pos){
                delete this.creep.memory.path;
                this.safePath(pos);
            }
        }
        else this.safePath(pos);
        console.log(this.creep.name, this.creep.moveByPath(this.creep.memory.path));
        if(this.creep.moveByPath(this.creep.memory.path) == ERR_NOT_FOUND){
            this.safePath(pos);
        }
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