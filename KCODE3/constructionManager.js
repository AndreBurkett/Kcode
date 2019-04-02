exports.constructionManager = class{
    constructor(){
        //Allocate Memory
        if(!Memory.construction) Memory.construction = {};
        if(!Memory.construction.container) Memory.construction.container = {};
        if(!Memory.construction.road) Memory.construction.road = {};
        if(!Memory.construction.tower) Memory.construction.tower = {};

        //Iterate over sites
        for(let i in Game.constructionSites){
            console.log(Game.constructionSites[i][1]);
            switch(Game.constructionSites[i].structureType){
                case STRUCTURE_CONTAINER:
                    if(!Memory.construction.container[i.id]){
                        Memory.construction.container[i.id] = {};
                    }
            }
        }

    }
}