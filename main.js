map = require('world');

module.exports.loop = function() {
    //Clear Memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    myWorld = new map.World();
}