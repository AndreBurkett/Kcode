var architect = require('constructionManager');
var hive = require('spawnManager');
var source = require('sourceManager');

exports.Chamber = class{
    constructor(room){
        this.room = room;
        this.name = room.name;
        this.controller = this.room.controller;
        this.exits = Game.map.describeExits(this.room.name);
        this.terrain = Game.map.getRoomTerrain(this.name)
        if(!Memory.chamber) Memory.chamber = {};
        if(!Memory.chamber[this.room.name]) Memory.chamber[this.room.name] = {};
        if(!Memory.chamber[this.room.name].paths) Memory.chamber[this.room.name].paths = {};
        if(!Memory.chamber[this.room.name].buildTicks) Memory.chamber[this.room.name].buildTicks = 0;
        
        this.cSites = this.room.find(FIND_CONSTRUCTION_SITES);
        this.sources = this.room.find(FIND_SOURCES);
        Memory.chamber[this.name].numSources = this.sources.length;
        this.spawns = this.room.find(FIND_MY_SPAWNS);
        this.containers = this.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
        this.numContainers = this.containers.length;
        this.srcm = [];
        for(let i in this.sources){
            this.srcm.push(new source.sourceManager(this.sources[i]))
        }
        let mins = this.room.find(FIND_MINERALS)[0]
        if(mins)
        this.minm = new source.sourceManager(mins)
        
        //Creep Counts
        if (this.room.find(FIND_MY_CREEPS).length > 0) {
            this.creepCountAcolytes = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'acolyte' }).length || 0;
            this.creepCountBuilders = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'builder' }).length || 0;
            this.creepCountClaimer = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'claimer' }).length || 0;
            this.creepCountDefender = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'defender' }).length || 0;
            this.creepCountDrones = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'drone' }).length || 0;
            this.creepCountEBuilder = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'eBuilder' }).length || 0;
            this.creepCountMiners = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'miner' && c.ticksToLive > 20 }).length || 0;
            this.creepCountStorageKeepers = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'storageKeeper' && c.ticksToLive > 20 }).length || 0;
            this.creepCountTransporters = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'transporter' }).length || 0;
            this.creepCountUpgraders = this.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'upgrader' }).length || 0;
        }
        //Enemy Creep Count
        this.enemyCreeps = this.room.find(FIND_HOSTILE_CREEPS).length;

        if(this.controller){
            if(this.controller.level > 0){
                if(this.room.controller.my) this.owner = 'Me';
                else this.owner = 'Hostile';
            }
            else this.owner = 'Neutral';
        }
        else{
            this.owner = 'Neutral';
        }
        Memory.chamber[this.room.name].owner = this.owner
    }
    chamberTasks() {
        Memory.chamber[this.room.name].buildTicks++;
        if (this.owner != 'Hostile') {
            var cm = new architect.constructionManager(this);
            if (this.owner == 'Me') {
                if (Memory.chamber[this.room.name].buildTicks >= 1000) {
                    Memory.chamber[this.room.name].buildTicks = 0;
                    cm.createSourceContainers();
                    if (this.spawns.length > 0) {
                        cm.createBunker();
                        cm.createFreeways();
                        if(this.controller.level >= 6) cm.createExtractor();
                    }
                }
                if (this.spawns.length > 0) {
                    var sm = new hive.spawnManager(this);
                }
                //Link Activities
                this.storageLink = this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK && s.pos.x == this.spawns[0].pos.x && s.pos.y == this.spawns[0].pos.y + 4 });
                this.links = this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK && !(s.pos.x == this.spawns[0].pos.x && s.pos.y == this.spawns[0].pos.y + 4) && s.energy < 500 });
                if (this.storageLink[0]) this.storageLink[0].transferEnergy(this.links[0]);
            }
        }
    }
}