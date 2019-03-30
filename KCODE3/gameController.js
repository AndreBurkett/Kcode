exports.gameController = class{
    constructor(){
        //Create Memory
        if(!Memory.sector) Memory.sector = {};
        //Create Sector Controllers
        sector = [];
        for(let i in Game.rooms){
            sector.push(new sectorController(Game.rooms[i]));
        }
    }
}