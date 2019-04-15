exports.role = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
    }

    safeMove(pos){
        if(this.creep.memory.path && this.creep.memory.path.length > 0){
            let len = this.creep.memory.path.length - 1;
            let pos1 = this.getPos(this.creep.memory.path[len]);
            if(!pos.isEqualTo(pos1)) this.safePath(pos);
        }
        else this.safePath(pos);
        if(this.creep.memory && this.creep.memory.path && this.creep.memory.path[0]){

        }
        else console.log(this.creep.name, this.creep.memory.path.length);
        let mpos = new RoomPosition(this.creep.memory.path[0].x, this.creep.memory.path[0].y, this.creep.memory.path[0].roomName);
        switch(this.creep.move(this.creep.pos.getDirectionTo(mpos))){
            case OK:
                this.creep.memory.path.splice(0,1);
                break;
            case ERR_NOT_IN_RANGE:
                this.safePath(pos);
                break;
        }
    }

    safePath(pos){
        let p = PathFinder.search(this.creep.pos, {pos:pos, range:1}, {
            maxOps: 3000,
            roomCallback: function(roomName) {
                if(Memory.sector[roomName]){
                    if(Memory.sector[roomName].CostMatrix){
                        let costs = PathFinder.CostMatrix.deserialize(Memory.sector[roomName].CostMatrix);
                        return costs;
                    }
                }
                else Memory.sector[roomName] = {};
                let costs = new PathFinder.CostMatrix();
                Memory.sector.CostMatrix = costs;
                return costs;
            }
        });
        this.creep.memory.path = p.path;
    }
    getPos(mem){
        return new RoomPosition(mem.x, mem.y, mem.roomName);
    }
}