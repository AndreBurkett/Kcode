var claimer = {
    run: function (creep) {
        var target = creep.memory.target;
        if(creep.room.name == target){
            target = creep.room.controller;
            if(creep.room.find(FIND_SOURCES).length < 2){
                if(creep.reserveController(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);
            }
            else {
                switch (creep.claimController(target)) {
                    case ERR_NOT_IN_RANGE:
                        //console.log((target));
                        creep.moveTo(target);
                        break
                    case ERR_GCL_NOT_ENOUGH:
                        creep.reserveController(target);
                        break;
                }
            }
        }
        else creep.moveTo(new RoomPosition(25, 25, target));
    }
};
module.exports = claimer;