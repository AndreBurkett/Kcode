var scout = {
    run: function (creep) {
        var target = creep.memory.target;
        if(creep.room.name == target && !creep.memory.TargetList){
            //creep.memory.TargetList = Object.values(Game.map.describeExits(creep.room.name));
            creep.memory.TargetList = _.difference(Object.values(Game.map.describeExits(creep.room.name)), Object.keys(Memory.expansionList1));
        }
        else if(_.includes(creep.memory.TargetList, creep.room.name)){
            _.pull(creep.memory.TargetList, creep.room.name);
            if(creep.memory.TargetList.length > 0) creep.moveTo(new RoomPosition(25, 25, creep.memory.TargetList[0]));
        }
        else if(creep.memory.TargetList && creep.memory.TargetList.length > 0) creep.moveTo(new RoomPosition(25,25, creep.memory.TargetList[0]));
        else if(creep.memory.TargetList && creep.memory.TargetList.length == 0){} //update code here for further expansion (refresh TargetList)
        else creep.moveTo(new RoomPosition(25, 25, target));
    }
};
module.exports = scout;