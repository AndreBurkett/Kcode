exports.constructionManager = class{
    constructor(chamber){
        this.chamber = chamber;
        //if(!this.chamber.memory.paths) this.chamber.memory.paths = {};
    }
    createBunker() {
        var x0 = this.chamber.spawns[0].pos.x;
        var y0 = this.chamber.spawns[0].pos.y;
        var chamber = this.chamber;
        function bBuild(x,y,s){
            //console.log(chamber.name);
            if(Memory.chamber[chamber.name].bunker && Memory.chamber[chamber.name].bunker.flipped){
                var i = y;
                var j = x;
            }
            else{
                var i = x;
                var j = y;
            }
            chamber.room.createConstructionSite(x0 + i, y0 + j, s);
        }
        //Towers
        bBuild(-1,1,STRUCTURE_TOWER);
        bBuild(1,1,STRUCTURE_TOWER);
        //Extensions
        bBuild(-4,1,STRUCTURE_EXTENSION);
        bBuild(-3,0,STRUCTURE_EXTENSION);
        bBuild(-3,1,STRUCTURE_EXTENSION);
        bBuild(-2,-1,STRUCTURE_EXTENSION);
        bBuild(-2,0,STRUCTURE_EXTENSION);
        bBuild(-1,-1,STRUCTURE_EXTENSION);
        bBuild(1,-1,STRUCTURE_EXTENSION);
        bBuild(1,-2,STRUCTURE_EXTENSION);
        bBuild(2,-3,STRUCTURE_EXTENSION);
        bBuild(2,-1,STRUCTURE_EXTENSION);
        bBuild(2,0,STRUCTURE_EXTENSION);
        bBuild(3,-3,STRUCTURE_EXTENSION);
        bBuild(3,-2,STRUCTURE_EXTENSION);
        bBuild(3,0,STRUCTURE_EXTENSION);
        bBuild(3,1,STRUCTURE_EXTENSION);
        bBuild(4,1,STRUCTURE_EXTENSION);
        bBuild(4,-2,STRUCTURE_EXTENSION);
        bBuild(4,-1,STRUCTURE_EXTENSION);
        bBuild(5,-1,STRUCTURE_EXTENSION);
        bBuild(5,0,STRUCTURE_EXTENSION);
        bBuild(6,0,STRUCTURE_EXTENSION);
        bBuild(6,1,STRUCTURE_EXTENSION);
        bBuild(7,1,STRUCTURE_EXTENSION);
        //Storage
        bBuild(0,2,STRUCTURE_STORAGE);
        //Terminal
        bBuild(0,7,STRUCTURE_TERMINAL);
        //Link
        bBuild(0,4,STRUCTURE_LINK);
        //Roads
        bBuild(-1,0,STRUCTURE_ROAD);
        bBuild(-1,-3,STRUCTURE_ROAD);
        bBuild(-1,4,STRUCTURE_ROAD);
        bBuild(-2,-2,STRUCTURE_ROAD);
        bBuild(-2,1,STRUCTURE_ROAD);
        bBuild(-2,3,STRUCTURE_ROAD);
        bBuild(-3,-1,STRUCTURE_ROAD);
        bBuild(-3,2,STRUCTURE_ROAD);
        bBuild(-4,0,STRUCTURE_ROAD);
        bBuild(-4,2,STRUCTURE_ROAD);
        bBuild(-5,1,STRUCTURE_ROAD);
        bBuild(0,-2,STRUCTURE_ROAD);
        bBuild(0,-1,STRUCTURE_ROAD);
        bBuild(0,3,STRUCTURE_ROAD);
        bBuild(0,5,STRUCTURE_ROAD);
        bBuild(0,6,STRUCTURE_ROAD);
        bBuild(1,0,STRUCTURE_ROAD);
        bBuild(1,-3,STRUCTURE_ROAD);
        bBuild(1,4,STRUCTURE_ROAD);
        bBuild(2,-2,STRUCTURE_ROAD);
        bBuild(2,1,STRUCTURE_ROAD);
        bBuild(2,3,STRUCTURE_ROAD);
        bBuild(3,-1,STRUCTURE_ROAD);
        bBuild(3,2,STRUCTURE_ROAD);
        bBuild(4,0,STRUCTURE_ROAD);
        bBuild(4,2,STRUCTURE_ROAD);
        bBuild(5,1,STRUCTURE_ROAD);
    }
    createExtractor(){
        let site = this.chamber.room.find(FIND_MINERALS)[0];
        this.chamber.room.createConstructionSite(site.pos.x, site.pos.y, STRUCTURE_EXTRACTOR);
        var target = [];
            if (this.chamber.terrain.get(site.pos.x - 2, site.pos.y) != 'wall' && this.chamber.terrain.get(site.pos.x - 1, site.pos.y) != 'wall') {
                target.push(new RoomPosition(site.pos.x - 2, site.pos.y, this.chamber.room.name));
            }
            if (this.chamber.terrain.get(site.pos.x + 2, site.pos.y) != 'wall' && this.chamber.terrain.get(site.pos.x + 1, site.pos.y) != 'wall') {
                target.push(new RoomPosition(site.pos.x + 2, site.pos.y, this.chamber.room.name));
            }
            if (this.chamber.terrain.get(site.pos.x, site.pos.y - 2) != 'wall' && this.chamber.terrain.get(site.pos.x, site.pos.y - 1) != 'wall') {
                target.push(new RoomPosition(site.pos.x, site.pos.y - 2, this.chamber.room.name));
            }
            if (this.chamber.terrain.get(site.pos.x, site.pos.y + 2) != 'wall' && this.chamber.terrain.get(site.pos.x, site.pos.y + 1) != 'wall') {
                target.push(new RoomPosition(site.pos.x, site.pos.y + 2, this.chamber.room.name));
            }
            if (target.length < 1) target = this.chamber.minm.slots
            if (this.chamber.spawns[0]) {
                let cSite = this.chamber.spawns[0].pos.findClosestByRange(target);
                this.chamber.room.createConstructionSite(cSite, STRUCTURE_CONTAINER);
            }
            else {
                this.chamber.room.createConstructionSite(target[0], STRUCTURE_CONTAINER);
            }
    }
    createFreeways(){
        //Road from Container to Container
        if(!Memory.chamber[this.chamber.room.name].paths.containerToContainer) Memory.chamber[this.chamber.room.name].paths.containerToContainer = {};
        var pathNum = 0;
        for(let i = 0; i < this.chamber.numContainers - 1; i++){
            for(let j = i + 1; j < this.chamber.numContainers; j++){
                let path = PathFinder.search(this.chamber.containers[i].pos, this.chamber.containers[j].pos, {swampCost: 1, ignoreRoads: true, roomCallback: this.roomCostMatrix()});
                Memory.chamber[this.chamber.room.name].paths.containerToContainer[pathNum] = path;
                pathNum++;
            }
        }
        for(let i in Memory.chamber[this.chamber.room.name].paths.containerToContainer){
            for(let j in Memory.chamber[this.chamber.room.name].paths.containerToContainer[i].path){
                this.chamber.room.createConstructionSite(Memory.chamber[this.chamber.room.name].paths.containerToContainer[i].path[j].x, Memory.chamber[this.chamber.room.name].paths.containerToContainer[i].path[j].y, STRUCTURE_ROAD);
            }
        }
        //Road from Spawn to Controller
        if (this.chamber.spawns) {
            if (!Memory.chamber[this.chamber.room.name].paths.spawnToController) Memory.chamber[this.chamber.room.name].paths.spawnToController = {};
            if (this.chamber.controller) {
                let path = PathFinder.search(this.chamber.spawns[0].pos, {pos: this.chamber.controller.pos, range: 1}, {swampCost: 1, ignoreRoads: true, roomCallback: this.roomCostMatrix() });
                Memory.chamber[this.chamber.room.name].paths.spawnToController[0] = path;
            }
            for (let i = 1; i < Memory.chamber[this.chamber.room.name].paths.spawnToController[0].path.length; i++) {
                this.chamber.room.createConstructionSite(Memory.chamber[this.chamber.room.name].paths.spawnToController[0].path[i].x, Memory.chamber[this.chamber.room.name].paths.spawnToController[0].path[i].y, STRUCTURE_ROAD);
            }
            //Link Blueprint
            this.chamber.room.createConstructionSite(Memory.chamber[this.chamber.room.name].paths.spawnToController[0].path[Memory.chamber[this.chamber.room.name].paths.spawnToController[0].path.length - 1].x, Memory.chamber[this.chamber.room.name].paths.spawnToController[0].path[Memory.chamber[this.chamber.room.name].paths.spawnToController[0].path.length - 1].y, STRUCTURE_LINK);
            //Road from Spawn to Container
            if (!Memory.chamber[this.chamber.room.name].paths.spawnToContainer) Memory.chamber[this.chamber.room.name].paths.spawnToContainer = {};
            pathNum = 0;
            for(let i = 0; i < this.chamber.numContainers; i++){
                let path = PathFinder.search(this.chamber.containers[i].pos, {pos:this.chamber.spawns[0].pos, range: 1}, {swampCost: 1, ignoreRoads: true, roomCallback: this.roomCostMatrix()});
                Memory.chamber[this.chamber.room.name].paths.spawnToContainer[pathNum] = path;
                pathNum++;
            }
            for(let i in Memory.chamber[this.chamber.room.name].paths.spawnToContainer){
                for(let j in Memory.chamber[this.chamber.room.name].paths.spawnToContainer[i].path){
                    this.chamber.room.createConstructionSite(Memory.chamber[this.chamber.room.name].paths.spawnToContainer[i].path[j].x, Memory.chamber[this.chamber.room.name].paths.spawnToContainer[i].path[j].y, STRUCTURE_ROAD);
                }
            }

        }
    }
    createSourceContainers() {
        for (let i in this.chamber.sources) {
            var target = [];
            if (this.chamber.terrain.get(this.chamber.sources[i].pos.x - 2, this.chamber.sources[i].pos.y) != 'wall' && this.chamber.terrain.get(this.chamber.sources[i].pos.x - 1, this.chamber.sources[i].pos.y) != 'wall') {
                target.push(new RoomPosition(this.chamber.sources[i].pos.x - 2, this.chamber.sources[i].pos.y, this.chamber.room.name));
            }
            if (this.chamber.terrain.get(this.chamber.sources[i].pos.x + 2, this.chamber.sources[i].pos.y) != 'wall' && this.chamber.terrain.get(this.chamber.sources[i].pos.x + 1, this.chamber.sources[i].pos.y) != 'wall') {
                target.push(new RoomPosition(this.chamber.sources[i].pos.x + 2, this.chamber.sources[i].pos.y, this.chamber.room.name));
            }
            if (this.chamber.terrain.get(this.chamber.sources[i].pos.x, this.chamber.sources[i].pos.y - 2) != 'wall' && this.chamber.terrain.get(this.chamber.sources[i].pos.x, this.chamber.sources[i].pos.y - 1) != 'wall') {
                target.push(new RoomPosition(this.chamber.sources[i].pos.x, this.chamber.sources[i].pos.y - 2, this.chamber.room.name));
            }
            if (this.chamber.terrain.get(this.chamber.sources[i].pos.x, this.chamber.sources[i].pos.y + 2) != 'wall' && this.chamber.terrain.get(this.chamber.sources[i].pos.x, this.chamber.sources[i].pos.y + 1) != 'wall') {
                target.push(new RoomPosition(this.chamber.sources[i].pos.x, this.chamber.sources[i].pos.y + 2, this.chamber.room.name));
            }
            if (target.length < 1) target = this.chamber.srcm[i].slots
            if (this.chamber.spawns[0]) {
                var site = this.chamber.spawns[0].pos.findClosestByRange(target);
                this.chamber.room.createConstructionSite(site, STRUCTURE_CONTAINER);
            }
            else {
                this.chamber.room.createConstructionSite(target[0], STRUCTURE_CONTAINER);
            }
        }
    }
    roomCostMatrix(){
        if(!this.costs){
            var costs = new PathFinder.CostMatrix;
            this.chamber.room.find(FIND_STRUCTURES).forEach(function (s) {
                if (!_.contains([STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_RAMPART], s.structureType)) {
                    costs.set(s.pos.x, s.pos.y, 255);
                }
            });
            this.costs = costs;
        }
        return this.costs;
    }
}