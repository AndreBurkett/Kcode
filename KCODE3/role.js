exports.role = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
    }

    safeMove(pos){
        if(!this.creep.memory.path){
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
        this.creep.moveByPath(this.creep.memory.path);
    }
}