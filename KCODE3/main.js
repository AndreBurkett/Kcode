game = require('gameController');

module.exports.loop = function(){
    //Clear Memory
    for(var name in Memory.creeps){
        if(!Game.creeps[name]){
            let assignment = Memory.creeps[name].assignment;
            switch(Memory.creeps[name].role){
                case 'miner':
                    delete Memory.source[assignment].miner[Game.creeps[name]];
                case 'upgrader':
                    delete Memory.controller[assignment].upgrader[Game.creeps[name]];
            }
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    controller = new game.gameController();
}