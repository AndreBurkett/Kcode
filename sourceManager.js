exports.sourceManager = class{
    constructor(source){
        this.source = source
        //console.log(source);
        this.x = source.pos.x;
        this.y = source.pos.y;
        this.terrain = Game.map.getRoomTerrain(this.source.room.name)
        this.getSlots();
    }
    getSlots(){
        this.slots = [];
        this.cornerSlots = [];
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                if(this.terrain.get(this.x + i, this.y + j) != 'wall'){
                    if(i == j || i == -j) this.cornerSlots.push(new RoomPosition(this.x + i,this.y + j,this.source.room.name));
                    this.slots.push(new RoomPosition(this.x + i,this.y + j,this.source.room.name));
                }
            }
        }
        this.numSlots = this.slots.length;
    }
    getFilledSlots(){
        return this.source.pos.findInRange(FIND_MY_CREEPS, 2, {filter: (c) => c.memory.role == 'miner' && c.memory.target == this.source.id}).length;
    }
    getAvailability(){
        if(this.getFilledSlots() < Math.min(this.numSlots, 2)) return true;
        return false;
    }
}