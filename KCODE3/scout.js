exports.scout = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
        console.log(this.assignment);
        if(this.assignment){
            let pos = new RoomPosition(25,25,this.assignment);
            this.creep.moveTo(pos);
        }
    }
}