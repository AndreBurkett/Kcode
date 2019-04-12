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
                this.creep.move(this.creep.pos.getDirectionTo(path.path[0]));
                console.log(path.path[0]);
                //console.log(this.creep.name, this.creep.moveByPath(path.path));
            }
        }
    }
    findPath(pos){
        let path = PathFinder.search(this.creep.pos, {pos:pos, range:10}, {
            roomCallback: function(roomName) {
                if(Memory.sector[roomName].CostMatrix){
                    costs = PathFinder.CostMatrix.deserialize(Memory.sector[roomName].CostMatrix);
                    return costs;
                }
            }
        });
        return path;
    }
}