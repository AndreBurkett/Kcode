exports.transporter = class{
    constructor(creep){
        this.creep = creep;
        this.assignment = creep.memory.assignment;
        this.creep.moveTo(25,25,this.assignment);
    }
}