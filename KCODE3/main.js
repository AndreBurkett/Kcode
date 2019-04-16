game = require('gameController');
stats = require('stats');

module.exports.loop = function(){
    Memory.moveCpu = 0;
    controller = new game.gameController();
    
    exportStats();


    function exportStats() {
        // Reset stats object
        Memory.stats = {
          gcl: {},
          rooms: {},
          cpu: {},
          creeps: {},
        };
      
        Memory.stats.time = Game.time;
      
        // Collect room stats
        for (let roomName in Game.rooms) {
          let room = Game.rooms[roomName];
          let isMyRoom = (room.controller ? room.controller.my : false);
          if (isMyRoom) {
            let roomStats = Memory.stats.rooms[roomName] = {};
            roomStats.storageEnergy           = (room.storage ? room.storage.store.energy : 0);
            roomStats.terminalEnergy          = (room.terminal ? room.terminal.store.energy : 0);
            roomStats.energyAvailable         = room.energyAvailable;
            roomStats.energyCapacityAvailable = room.energyCapacityAvailable;
            roomStats.controllerProgress      = room.controller.progress;
            roomStats.controllerProgressTotal = room.controller.progressTotal;
            roomStats.controllerLevel         = room.controller.level;
          }
        }
      
        // Collect GCL stats
        Memory.stats.gcl.progress      = Game.gcl.progress;
        Memory.stats.gcl.progressTotal = Game.gcl.progressTotal;
        Memory.stats.gcl.level         = Game.gcl.level;
      
        // Collect CPU stats
        Memory.stats.cpu.bucket        = Game.cpu.bucket;
        Memory.stats.cpu.limit         = Game.cpu.limit;
        Memory.stats.cpu.used          = Game.cpu.getUsed();
        Memory.stats.cpu.move          = Memory.moveCpu;

        //Screeps stats
        console.log(Object.keys(Game.creeps));
        Memory.stats.creeps.count      = Game.creeps;
      }
}