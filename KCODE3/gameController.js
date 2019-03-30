import sectorController from 'sectorController';

export class gameController{
    constructor(){
        //Create Memory
        if(!Memory.sector) Memory.sector = {};
        //Create Sector Controllers
        sector = [];
        for(let i in Game.rooms){
            sector[i] = new sectorController(Game.rooms[i]);
        }
    }
}