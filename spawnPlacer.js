exports.spawnPlacer = class{
    constructor(chamber){
        this.chamber = chamber;
        if(!Memory.chamber[this.chamber.name].bunker) this.setPoint();
        //else new RoomVisual(this.chamber.name).circle(Memory.chamber[this.chamber.name].bunker.x, Memory.chamber[this.chamber.name].bunker.y);
    }
    createSpawn(){
        this.chamber.room.createConstructionSite(Memory.chamber[this.chamber.name].bunker.x, Memory.chamber[this.chamber.name].bunker.y, STRUCTURE_SPAWN);
    }
    hasPoint(){
        if(Memory.chamber[this.chamber.name].bunker && Memory.chamber[this.chamber.name].bunker != 'none') return true;
        return false;
    }
    setPoint(){
        var obstruction;
        var points = [];
        for (let i = 2; i < 48; i++) {
            for (let j = 2; j < 48; j++) {
                obstruction = false;
                for (let x = 0; x <= 15; x++) {
                    for (let y = 0; y < 13; y++) {
                        switch(y){
                            case 0:
                                if(!_.includes([0,1,2,3,4,5,7,9,10,11,12,13,14,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 1:
                                if(!_.includes([0,1,2,3,12,13,14,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 2:
                                if(!_.includes([0,1,2,13,14,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 3:
                                if(!_.includes([0,1,14,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 4:
                                if(!_.includes([0,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 5:
                                if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                    obstruction = true;
                                    break;
                                }
                                break;
                            case 6:
                                if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                    obstruction = true;
                                    break;
                                }
                                break;
                            case 7:
                                if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                    obstruction = true;
                                    break;
                                }
                                break;
                            case 8:
                                if(!_.includes([0,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 9:
                                if(!_.includes([0,1,14,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 10:
                                if(!_.includes([0,1,2,13,14,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 11:
                                if(!_.includes([0,1,2,3,12,13,14,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;
                            case 12:
                                if(!_.includes([0,1,2,3,4,5,7,9,10,11,12,13,14,15], x)){
                                    if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                }
                                break;

                        }

                        if (this.chamber.terrain.get(i + x, j+y) == 'wall') {
                            obstruction = true;
                            break;
                        }
                    }
                    if(obstruction) break;
                }
                if(!obstruction) points.push(new RoomPosition(i+7,j+4));
            }
        }
        if(points.length > 0){
            var spawnPoint = new RoomPosition(32,29).findClosestByRange(points);
            Memory.chamber[this.chamber.name].bunker = spawnPoint;
            Memory.chamber[this.chamber.name].bunker.flipped = false;

        }
        else{
            for (let i = 2; i < 48; i++) {
                for (let j = 2; j < 48; j++) {
                    obstruction = false;
                    for (let x = 0; x <= 15; x++) {
                        for (let y = 0; y < 13; y++) {
                            switch(y){
                                case 0:
                                    if(!_.includes([0,1,2,3,4,5,7,9,10,11,12,13,14,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 1:
                                    if(!_.includes([0,1,2,3,12,13,14,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 2:
                                    if(!_.includes([0,1,2,13,14,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 3:
                                    if(!_.includes([0,1,14,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 4:
                                    if(!_.includes([0,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 5:
                                    if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                    break;
                                case 6:
                                    if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                    break;
                                case 7:
                                    if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                        obstruction = true;
                                        break;
                                    }
                                    break;
                                case 8:
                                    if(!_.includes([0,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 9:
                                    if(!_.includes([0,1,14,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 10:
                                    if(!_.includes([0,1,2,13,14,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 11:
                                    if(!_.includes([0,1,2,3,12,13,14,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
                                case 12:
                                    if(!_.includes([0,1,2,3,4,5,7,9,10,11,12,13,14,15], x)){
                                        if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                            obstruction = true;
                                            break;
                                        }
                                    }
                                    break;
    
                            }
    
                            if (this.chamber.terrain.get(i + y, j+x) == 'wall') {
                                obstruction = true;
                                break;
                            }
                        }
                        if(obstruction) break;
                    }
                    if(!obstruction) points.push(new RoomPosition(i+4,j+7,this.chamber.name));
                }
            }
            if(points.length > 0){
                var spawnPoint = new RoomPosition(29,32,this.chamber.name).findClosestByRange(points);
                Memory.chamber[this.chamber.name].bunker = spawnPoint;
                Memory.chamber[this.chamber.name].bunker.flipped = true
            }
            else Memory.chamber[this.chamber.name].bunker = 'none';
        }
    }
}