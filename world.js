chamber = require('chamber');
sp = require('spawnPlacer');
tm = require('taskManager');
exports.World = class{
    constructor(){
        this.chamber = [];
        this.myRooms = [];
        this.claimRequest = [];
        if(!Memory.expansionList1) Memory.expansionList1 = [];
        if(!Memory.expansionList2) Memory.expansionList2 = [];
        if(!Memory.claimRequest) Memory.claimRequest = [];
        for(let i in Game.rooms){
            this.chamber[i] = new chamber.Chamber(Game.rooms[i]);
        }

        for(let i in Game.flags){
            console.log(Game.flags[i])
        }

        for(let i in this.chamber){
            //Send Scouts
            if(this.chamber[i].exits){
                for(let j = 1; j <= 7; j = j + 2){
                    if(this.chamber[i].exits[j] && !_.contains(Object.keys(Game.rooms), this.chamber[i].exits[j])){
                        this.chamber[i].scoutNeeded = new RoomPosition(25,25, this.chamber[i].exits[j]);
                    }
                }
            }
            //Send Build Team
            if(!this.chamber[i].spawns[0] && this.chamber[i].owner == "Me" && (this.chamber[i].creepCountEBuilder <= 7 || !this.chamber[i].creepCountEBuilder)){
                this.requestHelp(this.chamber[i].name, 'eBuilder')
            }
            //Gather Expansion Intel
            let s = new sp.spawnPlacer(this.chamber[i]);
            if(this.chamber[i].owner == 'Me'){
                //console.log(this.chamber[i].cre)
                if(this.chamber[i].enemyCreeps && (!this.chamber[i].creepCountDefender || this.chamber[i].creepCountDefender <= 5)) this.requestHelp(this.chamber[i].name, 'defender');
                if(this.chamber[i].spawns.length == 0){
                    s.createSpawn();
                }
                this.myRooms.push(this.chamber[i].room.name);
                let rooms1 = Object.values(Game.map.describeExits(this.chamber[i].room.name));
                for(let x in rooms1){
                    if(!_.contains(Object.keys(Memory.expansionList1), rooms1[x])){
                        Memory.expansionList1.push(rooms1[x]);
                        if(!this.hasScout(rooms1[x])) this.chamber[i].sendScout = rooms1[x];
                    }
                }
            }
            else if(this.chamber[i].owner == 'Neutral' && this.chamber[i].controller && s.hasPoint() && this.chamber[i].creepCountClaimer < 2){
                Memory.claimRequest.push(this.chamber[i].name);
            }
            this.chamber[i].chamberTasks();
        }
        Memory.expansionList1 = _.uniq(Memory.expansionList1);
        for(let x in Memory.expansionList1){
            let rooms2 = Object.values(Game.map.describeExits(Memory.expansionList1[x]));
            for(let y in rooms2){
                if(!_.contains(Object.values(Memory.expansionList1), rooms2[y])) Memory.expansionList2.push(rooms2[y]);
            }
        }
        Memory.expansionList2 = _.uniq(Memory.expansionList2);
        Memory.claimRequest = _.uniq(Memory.claimRequest);
        Memory.claimRequest = _.difference(Memory.claimRequest, this.myRooms);
        let roomsToClaim = _.intersection(Memory.expansionList2, Memory.claimRequest)
        for(let x in roomsToClaim) this.requestHelp(roomsToClaim[x], 'claimer');
        this.setTasks();
    }

    hasScout(target){
        for(let name in Game.creeps){
            if(Game.creeps[name].memory.role == 'scout' && Game.creeps[name].memory.target == target) return true;
        }
        return false;
    }

    setTasks(){
        for(let name in Game.creeps){
            let run = new tm.creepManager(Game.creeps[name]);
        }
        var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        for(let id in towers){
            let run = new tm.towerManager(towers[id]);
        }
    }
    requestHelp(requester, creepRole){
        for(let i in this.chamber){
            if (this.chamber[i].owner == 'Me') {
                if (Game.map.getRoomLinearDistance(requester, this.chamber[i].name) <= 2) {
                    switch (creepRole) {
                        case 'claimer':
                            this.chamber[i].claimerNeeded = requester;
                            this.chamber[i].chamberTasks();           
                            break;
                        case 'defender':
                            this.chamber[i].defenderNeeded = requester;
                            this.chamber[i].chamberTasks();
                        case 'eBuilder':
                            this.chamber[i].eBuilderNeeded = requester;
                            this.chamber[i].chamberTasks();
                            break;
                    }
                }
            }
        }
    }
}