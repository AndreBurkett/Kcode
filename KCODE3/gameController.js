sc =require('sectorController');

exports.gameController = class{
    constructor(){
        this.sectorController = [];
        //Create Memory
        if(!Memory.sector) Memory.sector = {};
        if(!Memory.source) Memory.source = {};
        if(!Memory.spawn) Memory.spawn = {};
        if(!Memory.controller) Memory.controller = {};
        
        //Iterate over creeps
        for(let name in Memory.creeps){
            //Clear Memory
            if(!Game.creeps[name]){        
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
                continue;
            }
            if(!Game.creeps[name].memory.id) Game.creeps[name].memory.id = Game.creeps[name].id;
        }
        
        //Iterate over towers
        var tower = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        for(let i in tower){
            let run = new tm.towerManager(tower[i]);
        }
        
        //Create Sector Controller
        this.sectorController.push(new sc.sectorController('W24S7'));
    }
}