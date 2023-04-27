export class Othello{
    #board = [];// arr for the status of the game board - 0=empty 1=white 2=black
    #turn = true;//true = white false= black
    #size = 8;//the size of the game board
    #onwin;


    constructor(onwin){
        this.#board = [];
        for(let i=0;i<this.#size;i++){
            for(let j=0; j<this.#size; j++){
                this.#board.push(0);
            }
        }
        this.#turn = true;    
        this.onwin = onwin;
    }

    getPlayer(){
        return this.#turn ?  1 :  2 ;
    }
    
    getOpponent(){
        return this.#turn ?  2 :  1 ;
    }

    resetBoard(){
        for(let i=0;i<this.#size;i++){
            for(let j=0; j<this.#size; j++){
                this.#board.push(0);
            }
        }
        this.#turn = true;
    }

    cellClicked(i, j){
        if(this.#board[i*this.#size+j] != 0) return;
        let player = this.getPlayer();
        let up = this.checkUp(i,j, player);
        let down = this.checkDown(i,j, player);
        let right = this.checkRight(i,j, player);
        let left = this.checkLeft(i,j, player);
        let upRight = this.checkUpRight(i,j, player);
        let upLeft = this.checkUpLeft(i,j, player);
        let downRight = this.checkDownRight(i,j, player);
        let downLeft = this.checkDownLeft(i,j, player);
        //if there are no legal move for this click
        if(up == 0 && down == 0 && right == 0 && left == 0 && upRight == 0 && upLeft == 0 && downRight == 0 && downLeft == 0){return}

        if(up != 0){ //click up legal
            for(let n=i; n<up; n++){
                this.#board[n*this.#size+j] = player;
                
            }
        }
        
        if(down != 0){ //click down legal
            for(let n=down; n<=i; n++){
                this.#board[n*this.#size+j] = player;
                
            }
        }
    
        if(right != 0){ //click right legal
            for(let n=right; n<=j; n++){
                this.#board[i*this.#size+n] = player;
                
            }
        }
    
        if(left != 0){ //click left legal
            for(let n=j; n<left; n++){
                this.#board[i*this.#size+n] = player;
                
            }
        }
      
        if(upRight != 0){ //click up right legal
            let upRightI = upRight[0];
            let upRightJ = upRight[1];
            let p = j;
            for(let n=i; n<upRightI; n++){
                this.#board[n*this.#size+p] = player;
                p--;
                
            }
        }
    
        if(upLeft != 0){ //click up left legal
            let upLeftI = upLeft[0];
            let upleftJ = upLeft[1];
            let p = j;
            for(let n=i; n<upLeftI; n++){
                this.#board[n*this.#size+p] = player;
                p++;
                
            }
        }
        
        if(downRight != 0){ //click down right legal
            let downRightI = downRight[0];
            let downRightJ = downRight[1];
            let p = downRightJ;
            for(let n=downRightI; n<=i; n++){
                this.#board[n*this.#size+p] = player;
                p++;
                
            }
        }
    
        if(downLeft != 0){ //click down left legal
            let downLeftI = downLeft[0];
            let downLeftJ = downLeft[1];
            let p = downLeftJ;
            for(let n=downLeftI; n<=i; n++){
                this.#board[n*this.#size+p] = player;
                p--;
                
            }
        }
        
        let nextTurn = this.changeTurn();
        if(nextTurn != 2){
            this.#turn = nextTurn;
        }else{
            this.checkEndGame();
        }



    }

    checkUp(i,j, player){
        //checking that at least one opponent disc was captured
        let pastOpponent = false;
        let player = player;
        let opponent;
        if(player == this.getPlayer()){
            opponent = this.getOpponent();
        }else{
            opponent = this.getPlayer();
        }
        for(let n=i; n<this.#size; n++){
            if(n!=i){
                if(this.#board[n*this.#size+j]== 0){
                    return 0;
                }
            }
            if(this.#board[n*this.#size+j]== opponent){
                pastOpponent = true;
            }
            if(pastOpponent){
                if(this.#board[n*this.#size+j]== player){
                    return n;
                }
            }
        }
        return 0;
    }

    checkDown(i,j, player){
        //checking that at least one opponent disc was captured
        let pastOpponent = false;
        let player = player;
        let opponent;
        if(player == this.getPlayer()){
            opponent = this.getOpponent();
        }else{
            opponent = this.getPlayer();
        }
    
        for(let n=i; n>=0; n--){
            if(n!=i){
                if(this.#board[n*this.#size+j]== 0){
                    return 0;
                }
            }
            if(this.#board[n*this.#size+j]== opponent){
                pastOpponent = true;
            }
                if(pastOpponent){
                if(this.#board[n*this.#size+j]== player){
                    return n;
                }
            }
        }
        return 0;
    }
    
    checkRight(i,j, player){
        //checking that at least one opponent disc was captured
        let pastOpponent = false;
        let player = player;
        let opponent;
        if(player == this.getPlayer()){
            opponent = this.getOpponent();
        }else{
            opponent = this.getPlayer();
        }
        
        for(let n=j; n>=0; n--){
            if(n!=j){
                if(this.#board[i*this.#size+n]== 0){
                    return 0;
                }
            }
            if(this.#board[i*this.#size+n]== opponent){
                pastOpponent = true;
            }
            if(pastOpponent){
                if(this.#board[i*this.#size+n]== player){
                    return n;
                }
            }
        }
        return 0;
    }
    
    checkLeft(i,j, player){
        //checking that at least one opponent disc was captured
        let pastOpponent = false;
        let player = player;
        let opponent;
        if(player == this.getPlayer()){
            opponent = this.getOpponent();
        }else{
            opponent = this.getPlayer();
        }

        for(let n=j; n <this.#size; n++){
            if(n!=j){
                if(this.#board[i*his.#size+n]== 0){
                    return 0;
                }
            }
            if(this.#board[i*his.#size+n]== opponent){
                pastOpponent = true;
            }
            if(pastOpponent){
                if(this.#board[i*this.#size+n]== player){
                    return n;
                }
            }
        }
        return 0;
    }
    
    checkUpRight(i,j, player){
        //checking that at least one opponent disc was captured
        let pastOpponent = false;
        let player = player;
        let opponent;
        if(player == this.getPlayer()){
            opponent = this.getOpponent();
        }else{
            opponent = this.getPlayer();
        }
        let p = j;
        for(let n=i; n<this.#size; n++){
            if(p<0) return 0;
    
            if(n!=i && p!= j){
                if(this.#board[n*this.#size+p]== 0){
                    return 0;
                }
            }
            if(this.#board[n*this.#size+p]== opponent){
                pastOpponent = true;
            }
            if(pastOpponent){
                if(this.#board[n*this.#size+p]== player){
                    return [n,p];
             }
            }
            p--;
            
        }       
        return 0;
    }
    
    checkUpLeft(i,j, player){
        //checking that at least one opponent disc was captured
        let pastOpponent = false;
        let player = player;
        let opponent;
        if(player == this.getPlayer()){
            opponent = this.getOpponent();
        }else{
            opponent = this.getPlayer();
        }
        
        let p = j;
        for(let n=i; n<this.#size; n++){
            if(p>size) return 0;
    
            if(n!=i && p!= j){
                if(this.#board[n*this.#size+p]== 0){
                    return 0;
                }
            }
            if(this.#board[n*this.#size+p]== opponent){
                pastOpponent = true;
            }
            if(pastOpponent){
                if(this.#board[n*this.#size+p]== player){
                    return [n,p];
             }
            }
            p++;
        }       
        return 0;
    }
    
    checkDownRight(i,j, player){
        //checking that at least one opponent disc was captured
        let pastOpponent = false;
        let player = player;
        let opponent;
        if(player == this.getPlayer()){
            opponent = this.getOpponent();
        }else{
            opponent = this.getPlayer();
        }
        
        let p = j;
        for(let n=i; n<this.#size; n--){
            if(p<0) return 0;
    
            if(n!=i && p!= j){
                if(this.#board[n*this.#size+p]== 0){
                    return 0;
                }
            }
            if(this.#board[n*this.#size+p]== opponent){
                pastOpponent = true;
            }
            if(pastOpponent){
                if(this.#board[n*this.#size+p]== player){
                    return [n,p];
             }
            }
            p--;
        }       
        return 0;
    }
    
    checkDownLeft(i,j, player){
        //checking that at least one opponent disc was captured
        let pastOpponent = false;
        let player = player;
        let opponent;
        if(player == this.getPlayer()){
            opponent = this.getOpponent();
        }else{
            opponent = this.getPlayer();
        }
        
        let p = j;
        for(let n=i; n<this.#size; n--){
            if(p>size) return 0;
    
            if(n!=i && p!= j){
                if(this.#board[n*this.#size+p]== 0){
                    return 0;
                }
            }
            if(this.#board[n*this.#size+p]== opponent){
                pastOpponent = true;
            }
            if(pastOpponent){
                if(this.#board[n*this.#size+p]== player){
                    return [n,p];
             }
            }
            p++;
        }       
        return 0;
    }

    
    getBoard(handleCell){
        for(let i=0;i<this.board.length;i++)
            handleCell(i, this.board[i]);
        
    }
  
    canMove(i,j, player){
        if(this.checkUp(i,j, player)==0) return false;
        if(this.checkDown(i,j, player)==0) return false;
        if(this.checkRight(i,j, player)==0) return false;
        if(this.checkLeft(i,j, player)==0) return false;
        if(this.checkUpRight(i,j, player)==0) return false;
        if(this.checkUpLeft(i,j, player)==0) return false;
        if(this.checkDownRight(i,j, player)==0) return false;
        if(this.checkDownLeft(i,j, player)==0) return false;
        return true;
    }

    changeTurn(){
        let opponent = this.getOpponent();
        let player = this.getPlayer();
        
        for(let i=0; i<this.#size; i++){
            for(let j=0; j<this.#size; j++){
                if(canMove(i,j, opponent)){
                    this.#turn = !this.#turn;
                    return this.#turn;
                }
            }
        }
        for(let i=0; i<this.#size; i++){
            for(let j=0; j<this.#size; j++){
                if(canMove(i,j, player)){
                  return this.#turn;
                }
            }
        }
        return 2;
    }


    //TODO:
    checkEndGame(){
        let tempTurn = this.changeTurn();
        if(tempTurn == 2) alert("hhh");
        if(whiteCount == 0 || blackCount == 0 ||emptyCount == 0 ) endGame();
         //All white disks have been fliped
    }
     //TODO:
    endGame(){
        alert("game ended");
        let winner;
        if(whiteCount > blackCount){
            winner = "white";
        }else if(whiteCount < blackCount){
            winner = "black";
        }else{
            winner = "draw";
        }
        
    }
    



}