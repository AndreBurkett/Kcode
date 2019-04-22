exports.bunkerController = class{
    constructor(sector){
        this.sector = sector;
        this.level = sector.primaryController.level;
        this.x = sector.spawn[0].pos.x;
        this.y = sector.spawn[0].pos.y + 2;
        this.room = sector.spawn[0].room;
        this.createSites();
        this.link();
        this.createRoads(3);
    }

    build(site){
        let pos = new RoomPosition(this.x + site.x, this.y + site.y, this.room.name);
        let constructionExists = pos.lookFor(LOOK_CONSTRUCTION_SITES, {filter: (s) => s.structureType == site.s});
        if(constructionExists == false){
            let siteExists = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == site.s});
            if(siteExists) return false;
            this.room.createConstructionSite(pos, site.s);
            return true;
        }
        return true;
    }

    createRoads(max){
        let numSites = 0
        let siteList = [
            {x:-3,y:0,s:STRUCTURE_ROAD},
            {x:-2,y:-1,s:STRUCTURE_ROAD},
            {x:-1,y:-2,s:STRUCTURE_ROAD},
            {x:0,y:-3,s:STRUCTURE_ROAD},
            {x:1,y:-2,s:STRUCTURE_ROAD},
            {x:2,y:-1,s:STRUCTURE_ROAD},
            {x:3,y:0,s:STRUCTURE_ROAD},
            {x:2,y:1,s:STRUCTURE_ROAD},
            {x:1,y:2,s:STRUCTURE_ROAD},
            {x:0,y:3,s:STRUCTURE_ROAD},
            {x:-1,y:2,s:STRUCTURE_ROAD},
            {x:-2,y:1,s:STRUCTURE_ROAD},
            {x:0,y:1,s:STRUCTURE_ROAD},
            {x:-4,y:0,s:STRUCTURE_ROAD},
            {x:-5,y:-1,s:STRUCTURE_ROAD},
            {x:-4,y:-2,s:STRUCTURE_ROAD},
            {x:-3,y:-3,s:STRUCTURE_ROAD},
            {x:-2,y:-4,s:STRUCTURE_ROAD},
            {x:-1,y:-5,s:STRUCTURE_ROAD},
            {x:0,y:-4,s:STRUCTURE_ROAD},
        ];
        for(let i in siteList){
            if(this.build(siteList[i])) numSites++;
            if(numSites >= max) return;
        }
    }

    createSites(){
        let siteList = this.setSites();
        let smax = 34;
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
            case 5:
                smax = 34;
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
            {x:1,y:-1, s:STRUCTURE_TOWER},
            {x:0,y:0, s:STRUCTURE_STORAGE},
            {x:0,y:2, s:STRUCTURE_LINK},
            {x:1,y:4, s:STRUCTURE_EXTENSION},
            {x:1,y:-6, s:STRUCTURE_EXTENSION},
            {x:2,y:-5, s:STRUCTURE_EXTENSION},
            {x:3,y:-5, s:STRUCTURE_EXTENSION},
            {x:3,y:-4, s:STRUCTURE_EXTENSION},
            {x:4,y:-4, s:STRUCTURE_EXTENSION},
            {x:4,y:-3, s:STRUCTURE_EXTENSION},
            {x:5,y:-3, s:STRUCTURE_EXTENSION},
            {x:5,y:-2, s:STRUCTURE_EXTENSION},
            {x:6,y:-2, s:STRUCTURE_EXTENSION},

            
            ]
        return sites;
    }
    link(){
        let id = this.room.controller.id
        let pos = new RoomPosition(this.x, this.y + 2, this.room.name);
        let link1 = pos.lookFor(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK})[0];
        let link2 = Game.getObjectById(Memory.sector[this.sector.name].controller[id].link);
        if(link1 && link2){
            link1.transferEnergy(link2);
        }

    }
}
