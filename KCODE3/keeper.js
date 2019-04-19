var role = require('role');

exports.keeper = class keeper extends role.role{
    constructor(creep) {
        super(creep);
        
        if(this.assignment){
            let storage = Game.getObjectById(this.assignment);
            if(storage){
                
            }
        }
    }
}
