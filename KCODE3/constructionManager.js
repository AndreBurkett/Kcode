exports.constructionManager = class{
    constructor(assigner){
        this.assigner = assigner;
        //Allocate Memory
        if(!Memory.construction) Memory.construction = {};
        if(!Memory.construction.container) Memory.construction.container = {};
        if(!Memory.construction.road) Memory.construction.road = {};
        if(!Memory.construction.tower) Memory.construction.tower = {};

        //Iterate over sites
        for(let i in Game.constructionSites){
            switch(Game.constructionSites[i].structureType){
                case STRUCTURE_CONTAINER:
                    if(!Memory.construction.container[i]){
                        Memory.construction.container[i] = {};
                    }
                    if(!Memory.construction.container[i].builder){
                        Memory.construction.container[i].builder = [];
                    }
            }
        }

        //Iterate over containers
        /*if(Memory.construction.container && Object.keys(Memory.construction.container).length > 0){
            for(let i in Memory.construction.container){
                if(Game.constructionSites[i]){
                    if(Memory.construction.container[i].builder && Memory.construction.container[i].builder.length > 0){
                        for(let j in Memory.construction.container[i].builder){
                            let creep = Game.getObjectById(Memory.construction.container[i].builder[j]);
                            if(creep){
                                if(!creep.memory.assignment) creep.memory.assignment = i;
                            }
                            else{
                                Memory.construction.container[i].builder.splice(j,1);
                            }
                        }
                    }
                    else{
                        this.assigner.assignBuilder(i, 'container');
                    }
                }
                else{
                    for(let j in Memory.construction.container[i].builder){
                        let creep = Game.getObjectById(j);
                        if(creep) delete creep.memory.assignment;
                    }
                    delete Memory.construction.container[i];
                }
            }
        }*/

        //Iterate over all construction sites
        for(let i in Memory.construction){
            if(Memory.construction[i] && Object.keys(Memory.construction[i].length > 0)){
                for(let j in Memory.construction[i]){
                    if(Game.constructionSites[j]){
                        if(Memory.construction[i][j].builder && Memory.construction[i][j].builder.length > 0){
                            for(let k in Memory.construction[i][j].builder){
                                let creep = Game.getObjectById(k);
                                if(creep){
                                    if(!creep.memory.assignment) creep.memory.assignment = j;
                                }
                                else{
                                    Memory.construction[i][j].builder.splice(k,1);
                                }
                            }
                        }
                        else{
                            this.assigner.assignBuilder(j, i);
                        }
                    }
                    else{
                        for(let k in Memory.construction[i][j].builder){
                            let creep = Game.getObjectById(k);
                            if(creep) delete creep.memory.assignment;
                        }
                        delete Memory.construction[i][j];
                    }
                }
            }
        }

    }
}