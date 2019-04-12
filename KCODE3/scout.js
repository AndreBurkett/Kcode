exports.scout = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
        if(this.assignment){
            let pos = new RoomPosition(25,25,this.assignment);
            if(this.creep.room.name == this.assignment){
                this.creep.moveTo(pos);
            }
            else{
                let path = this.findPath(pos);
                this.creep.moveByPath(path.path);
            }
        }
    }
    findPath(pos){
        let path = PathFinder.search(this.creep.pos, {pos:pos, range:10}, {
            roomCallback: function(roomName) {
                if(Memory.sector[roomName].CostMatrix){
                    let costs = PathFinder.CostMatrix.deserialize(Memory.sector[roomName].CostMatrix);
                    return costs;
                }
            }
        });
        return path;
    }
}