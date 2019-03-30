export default class sourceController{
    constructor(source, terrain){
        this.source = source;
        this.terrain = terrain;
        this.spaces = this.spaces;
    }
    
    get spaces(){
        let spaces = 0;
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                if(this.terrain.get(this.x + i, this.y + j) != 'wall'){
                    spaces++;
                }
            }
        }
        return spaces;
    }
}