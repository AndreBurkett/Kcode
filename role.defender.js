var defender = {
    run: function (creep) {
        var target = creep.memory.target;
        if(creep.room.name == target){
            let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            switch(creep.attack(enemy)){
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(enemy);
                    break;
                case ERR_INVALID_TARGET:
                    creep.moveTo(new RoomPosition(25,25, creep.room.name));
                    break;
            }
        }
        else creep.moveTo(new RoomPosition(25, 25, target));
    }
};
module.exports = defender;