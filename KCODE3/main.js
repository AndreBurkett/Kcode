game = require('gameController');
stats = require('stats');

module.exports.loop = function(){
    controller = new game.gameController();
    stats.exportStats();
}