s = require('sectorController');

exports.gameController = class{
    constructor(){
        //Create Memory
        if(!Memory.sector) Memory.sector = {};
        //Create Sector Controllers
        let sector = [];
        for(let i in Game.rooms){
            console.log(i);
            sector.push(new s.sectorController(Game.rooms[i]));
        }
    }
}