exports.bunkerController = class{
    constructor(spawn){
        this.level = spawn.room.controller.level;
        this.x = spawn.pos.x;
        this.y = spawn.pos.y + 2;
        this.room = spawn.room;
        this.createSites();
    }

    build(site){
        let pos = new RoomPosition(this.x + site.x, this.y + site.y, this.room.name);
        let siteExists = pos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == site.s});
        if(siteExists == false){
            this.room.createConstructionSite(pos, site.s);
        }
    }

    createSites(){
        let siteList = this.setSites();
        let smax = 21;
        switch(this.level){
            case 1:
                smax = 0;
                break;
            case 2:
                smax = 5
                break;
            case 3:
                smax = 11;
                break;
            case 4:
                smax = 21;
                break;
        }
        for(let i=0; i<smax; i++){
            this.build(siteList[i]);
        }
    }

    setSites(){
        let sites = 
            [{x:1,y:-4, s:STRUCTURE_EXTENSION},
            {x:1,y:-3, s:STRUCTURE_EXTENSION},
            {x:2,y:-3, s:STRUCTURE_EXTENSION},
            {x:2,y:-2, s:STRUCTURE_EXTENSION},
            {x:3,y:-2, s:STRUCTURE_EXTENSION},
            //3
            {x:-1,y:-1, s:STRUCTURE_TOWER},
            {x:3,y:-1, s:STRUCTURE_EXTENSION},
            {x:4,y:-1, s:STRUCTURE_EXTENSION},
            {x:-1,y:-4, s:STRUCTURE_EXTENSION},
            {x:-1,y:-3, s:STRUCTURE_EXTENSION},
            {x:-2,y:-3, s:STRUCTURE_EXTENSION},
            //4
            {x:-2,y:-2, s:STRUCTURE_EXTENSION},
            {x:-3,y:-2, s:STRUCTURE_EXTENSION},
            {x:-3,y:-1, s:STRUCTURE_EXTENSION},
            {x:-4,y:-1, s:STRUCTURE_EXTENSION},
            {x:4,y:1, s:STRUCTURE_EXTENSION},
            {x:3,y:1, s:STRUCTURE_EXTENSION},
            {x:3,y:2, s:STRUCTURE_EXTENSION},
            {x:2,y:2, s:STRUCTURE_EXTENSION},
            {x:2,y:3, s:STRUCTURE_EXTENSION},
            {x:1,y:3, s:STRUCTURE_EXTENSION},
            //5
            {x:1,y:4, s:STRUCTURE_EXTENSION},
            
            ]
        return sites;
    }
}
