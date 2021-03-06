nameBuilder = require('nameBuilder');
sm = require('spawnManager');

exports.assignmentManager = class{
    constructor(sector){
        this.spawnManager = new sm.spawnManager(sector)
        this.role = {};
        for(let i of sector.roleNames){
            this.role[i] = [];
        }
    }

    assignRole(assignment, memory, role){
        if(this.role[role].length > 0){
            memory[assignment][role].push(this.role[role][0].id);
            this.role[role][0].memory.assignment = assignment;
            this.role[role].splice(0,1);
        }
        else this.spawnManager.role[role]++;
    }
}