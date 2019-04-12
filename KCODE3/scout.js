exports.scout = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
        if(this.assignment){
            let pos = new RoomPosition(25,25,this.assignment);
            let path = this.findPath(pos);
            //this.creep.move(this.creep.pos.getDirectionTo(path.path[0]));
            console.log(this.creep.name, this.creep.moveByPath(path.path));
        }
    }
    findPath(pos){
        let path = PathFinder.search(this.creep.pos, {pos:pos, range:10}, {
            roomCallback: function(roomName) {
                if(Memory.sector[roomName] && Memory.sector[roomName].owner == 'hostile'){
                    let costs;
                    if(!Memory.sector[roomName].CostMatrix){
                        costs = new PathFinder.CostMatrix;
                        for(let x = 0; x<50; x++){
                            for(let y = 0; y<50; y++){
                                costs.set(x, y, 255);
                            }
                        }
                        Memory.sector[roomName].CostMatrix = costs.serialize();
                    }
                    else{
                        costs = PathFinder.CostMatrix.deserialize(Memory.sector[roomName].CostMatrix);
                    }
                    return costs;
                }
                return;
            }
        });
        return path;
    }
}