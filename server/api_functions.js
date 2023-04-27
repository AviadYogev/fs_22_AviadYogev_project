let fs = require('fs');
let st = require('./server_tools.js');

//TODO: check whats needed
let activeGemeId = 0;
let userId;
let size = 8;

exports.login = async (req, res, q)=>{
    //Login to the website
    let username = q.query.username;
    let password = q.query.password;
    if(!username || !password){
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end();
        return;
    }
    validateUser(username, password, (isValid)=>{
        if(isValid){
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('ok');

        }else{
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('invalid');
            return;
        }
    });
};

function validateUser(username, password, callback){
    st.query("SELECT * FROM users_data WHERE username=? AND binary password=?", [username, password], (result, err)=>{
        if(err){
            callback(false);
            return;
        }
        if(result.length > 0){
            callback(true);
        }else{
            callback(false);
        }
    });
}

exports.register = async (req, res, q)=>{
    let regUsername = q.query.username;
    let regPassword = q.query.password;
    let email = q.query.email;
    let img = q.query.img;
    st.query("INSERT INTO users_data (username, password, email, profil_picture) VALUES(?, ?, ?, ?)", [regUsername, regPassword,email,img ], (result, err)=>{
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error in registrating user');
            return;
        }
        if(result.length == 1){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("user registrated");
        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error 2 in registrating user');
        }
    });
}

exports.checkRegister = async (req, res, q)=>{
    let colCheck = q.query.col_check;
    let valCheck = q.query.val_check;
    if(colCheck == 'username'){
        st.query("SELECT * FROM users_data WHERE username = ?", [valCheck], (result, err)=>{
            if(err){
                res.writeHead(500,{'Content-Type':'text/plain'});
                res.end('error in registrating user');
                return;
            }
            if(result.length == 0){
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end("ok");
            }else{
                res.writeHead(200,{'Content-Type':'text/plain'});
                res.end('user allready registrated');
            }
        });
    }else if(colCheck == 'email'){
        st.query("SELECT * FROM users_data WHERE email = ?", [valCheck], (result, err)=>{
            if(err){
                res.writeHead(500,{'Content-Type':'text/plain'});
                res.end('error in registrating user');
                return;
            }
            if(result.length == 0){
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(JSON.stringify(result));
            }else{
                res.writeHead(200,{'Content-Type':'text/plain'});
                res.end('user allready registrated');
            }
        });
    }
}





exports.updatePage = async (req, res, q)=>{
    //updates the current usersr page
    let username = q.query.username;
    let password = q.query.password;
    let page = q.query.page;
    let id = -1;  

    if(!username || !password){
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('username or password is missing');
        return;
    }   
    getUsersID(username, password, (idNum)=>{
        if(idNum < 0) return;
        id = idNum;
        st.query("UPDATE users_data SET current_page = ? WHERE id=?", [page, id], (result, err)=>{
            if(err){
                res.writeHead(500,{'Content-Type':'text/plain'});
                res.end('error in update');
                return;
            }
            if(result.length != 0){
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('page updated');
            }else{
                res.writeHead(500,{'Content-Type':'text/plain'});
                res.end('error 2 in update');
            }
        });

    });

};

function getUsersID(username, password, callback){
    st.query("SELECT id FROM users_data WHERE username=? AND binary password=?", [username, password], (result, err)=>{
        if(err){
            callback(-1);
            return;
        }
        if(result.length > 0){
            let id = result[0].id;
            callback(id);
        }else{
            callback(-1);
        }
    });
}

exports.render = async (req, res, q)=>{
    // renders user currnet page
    let username = q.query.username;
    let password = q.query.password;
    if(!username || !password){
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('Login');
        return;
    }
    validateUser(username, password, (isValid)=>{
        if(isValid){
            st.query("SELECT current_page FROM users_data WHERE username=? AND BINARY password=?", [username, password], (result, err)=>{
                if(err){
                    res.writeHead(500,{'Content-Type':'text/plain'});
                    res.end('error in render');
                    return;
                }
                if(result.length == 1){
                    let page = result[0].current_page + "";
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(page);
                }else{
                    res.writeHead(500,{'Content-Type':'text/plain'});
                    res.end('error 2 in render');
                }
            });

        }else{
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('Login');
            return;
        }
    });
};



exports.lobbyUsers = async (req, res, q)=>{
    // renders user currnet page
    let username = q.query.username;
    let password = q.query.password;
    if(!username || !password){
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('Login');
        return;
    }
    validateUser(username, password, (isValid)=>{
        if(isValid){
            st.query("SELECT * FROM users_data WHERE current_page='Lobby'", [username, password], (result, err)=>{
                if(err){
                    res.writeHead(500,{'Content-Type':'text/plain'});
                    res.end('error in lobbyUsers');
                    return;
                }
                if(result.length > 0){
                    let users = JSON.stringify(result);
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(users);
                }else{
                    res.writeHead(500,{'Content-Type':'text/plain'});
                    res.end('error 2 in lobbyUsers');
                }
            });

        }else{
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('No Users in lobby');
            return;
        }
    });
};


exports.userGamePage = async (req, res, q)=>{
    // renders user currnet page
    let username = q.query.username;
    let id = q.query.id;

    st.query("UPDATE users_data SET current_page = 'Game' WHERE id=?", [id], (result, err)=>{
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error in update');
            return;
        }
        if(result.length != 0){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('page updated');
        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error 2 in update');
        }
    });
};




exports.startGame = async (req, res, q)=>{
    
    let player1 = q.query.player1;
    let player2 = q.query.player2;
    let initGameBorad = [];
    for(let i=0; i<size; i++){
        for(let j=0; j<size; j++){
            initGameBorad.push(0);
        }
    }
    initGameBorad[((size/2-1)*(size+1))]= 1;
    initGameBorad[((size/2)*(size-1))]= 2;
    initGameBorad[((size/2)*(size+1)-1)]= 2;
    initGameBorad[((size/2)*(size+1))]= 1;

    st.query("INSERT INTO games (player1, player2, active, game_board, current_turn, player1_score, player2_score) VALUES (?, ?, ?, ?, ?, ?, ?)", [player1, player2, 1, JSON.stringify(initGameBorad), 1, 2, 2], (result, err)=>{  
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error in inesrting the game');
            return;
        }
        if(result.length != 0){
            activeGemeId = result.insertId; 
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(result));
        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error 2 in inesrting the game');
        }
    });
};


exports.gameData = async (req, res, q)=>{
    // renders user currnet page
    let gameId = q.query.id;
        
    st.query("SELECT * FROM games WHERE game_id=?", [gameId], (result, err)=>{  
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error in inesrting the game');
            return;
        }
        if(result != 0){
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result[0]));

        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error 2 in inesrting the game');
        }
    });
};

function gameData(gameId, callback){       
    st.query("SELECT * FROM games WHERE game_id=?", [gameId], (result, err)=>{  
        if(err){
            return;
        }
        if(result.length > 0){
            callback(result[0]);
        }else{
        }
    });
}




exports.cellClicked = async (req, res, q)=>{
    let username = q.query.username;
    let i = q.query.i;
    let j = q.query.j;
    i = parseInt(i);
    j = parseInt(j);
    let gameId = q.query.id;
    gameId = parseInt(gameId);
    
    st.query("SELECT * FROM games WHERE game_id=?", [gameId], (result, err)=>{  
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error in inesrting the game');
            return;
        }
        if(result != 0){
            let gameData = result[0];
            let player1 = result[0].player1;
            let player2 = result[0].player2;
            let active = result[0].active;
            let gameBoardArr = JSON.parse(result[0].game_board);
            let turn = result[0].current_turn;
            let player1Score = result[0].player1_score;
            let player2Score = result[0].player2_score;
            let emptyCells = result[0].empty_cells;
            let player;
            let opponent;
            

            if(username == player1){
                player = 1;
                opponent = 2;
            }else{
                player = 2;
                opponent = 1;
            }

            //checks if users turn
            if(turn != player){
                res.writeHead(200,{'Content-Type':'text/plain'});
                res.end('no action1');
                return;
            }

            //checks if cell is empty
            if(gameBoardArr[i*size+j] != 0 ){
                res.writeHead(200,{'Content-Type':'text/plain'});
                res.end('no action2');
                return;
            }
            //checks the diraction if it's a valide move and if is a valide move what cells to update
            let up = checkUp(i,j, player, opponent, gameBoardArr);
            let down = checkDown(i,j, player, opponent, gameBoardArr);
            let right = checkRight(i,j, player, opponent, gameBoardArr);
            let left = checkLeft(i,j, player, opponent, gameBoardArr);
            let upRight = checkUpRight(i,j, player, opponent, gameBoardArr);
            let upLeft = checkUpLeft(i,j, player, opponent, gameBoardArr);
            let downRight = checkDownRight(i,j, player, opponent, gameBoardArr);
            let downLeft = checkDownLeft(i,j, player, opponent, gameBoardArr);
            //checks if there the cell is not a valide move
            if(up == 0 && down == 0 && right == 0 && left == 0 && upRight == 0 && upLeft == 0 && downRight == 0 && downLeft == 0){
                res.writeHead(200,{'Content-Type':'text/plain'});
                res.end('no action3');
                return;
            }
            
            //if one or more of the diractions is a valid move, update gameboard arry before upload to server
            if(up != 0){
                for(let n=i; n<up; n++){
                    gameBoardArr[n*size+j] = player;                  
                }
            }
            
            if(down != 0){
                for(let n=down; n<=i; n++){
                    gameBoardArr[n*size+j] = player;
                }
            }
        
            if(right != 0){
                for(let n=right; n<=j; n++){
                    gameBoardArr[i*size+n] = player;
                }
            }
        
            if(left != 0){
                for(let n=j; n<left; n++){
                    gameBoardArr[i*size+n] = player;
                }
            }
          
            if(upRight != 0){
                let upRightI = upRight[0];
                let upRightJ = upRight[1];
                let p = j;
                for(let n=i; n<upRightI; n++){
                    gameBoardArr[n*size+p] = player;
                    p--;
                }
            }
        
            if(upLeft != 0){
                let upLeftI = upLeft[0];
                let upleftJ = upLeft[1];
                let p = j;
                for(let n=i; n<upLeftI; n++){
                    gameBoardArr[n*size+p] = player;
                    p++;
                }
            }
            
            if(downRight != 0){
                let downRightI = downRight[0];
                let downRightJ = downRight[1];
                let p = downRightJ;
                for(let n=downRightI; n<=i; n++){
                    gameBoardArr[n*size+p] = player;
                    p++;
                }
            }
        
            if(downLeft != 0){
                let downLeftI = downLeft[0];
                let downLeftJ = downLeft[1];
                let p = downLeftJ;
                for(let n=downLeftI; n<=i; n++){
                    gameBoardArr[n*size+p] = player;
                    p--;
                }
            }
            
            //update count
            let tempWhiteCount = 0;
            let tempBlackCount = 0;
            let tempEmptyCount = 0;
            for(let n=0; n<gameBoardArr.length; n++){
                if(gameBoardArr[n] == 1){
                    tempBlackCount ++;
                }
                if(gameBoardArr[n] == 2){
                    tempWhiteCount ++;
                }
                if(gameBoardArr[n] == 0){
                    tempEmptyCount ++;
                }
            }
            player1Score = tempBlackCount;
            player2Score = tempWhiteCount;
            emptyCells = tempEmptyCount;
            
            //change turn here before upload
            let change = changeTurn(player, opponent, gameBoardArr);

            if(change == 3 ||player1Score == 0 || player2Score == 0 || emptyCells == 0){
                let winner;
                if(player1Score > player2Score){
                    winner = player1;
                }else if(player1Score < player2Score){
                    winner = player1;
                }else{
                    winner = 'draw';
                }
                //game ends
                st.query("UPDATE games SET active =0 game_board =? , current_turn =?, player1_score =?, player2_score =?, empty_cells=?, winner=? WHERE game_id=?", [JSON.stringify(gameBoardArr), turn, player1Score, player2Score, emptyCells, winner, gameId], (result, err)=>{                   
                    if(err){
                        res.writeHead(500,{'Content-Type':'text/plain'});
                        res.end('error in update');
                        return;
                    }
                    if(result.length != 0){
                        res.writeHead(200,{'Content-Type':'text/plain'});
                        res.end('game ends');
                        return;
                    }else{
                        res.writeHead(500,{'Content-Type':'text/plain'});
                        res.end('error 2 in update');
                    }
                });
            }else{
                //the game didn't end
                //change turn
                if(change == 1){
                    turn = opponent;
                }else if(change == 2){
                    turn = player;
                }
                st.query("UPDATE games SET game_board =? , current_turn =?, player1_score =?, player2_score =?, empty_cells=? WHERE game_id=?", [JSON.stringify(gameBoardArr), turn, player1Score, player2Score, emptyCells, gameId], (result, err)=>{                   
                    if(err){
                        res.writeHead(500,{'Content-Type':'text/plain'});
                        res.end('error in update');
                        return;
                    }
                    if(result.length != 0){
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('valid move');
                    }else{
                        res.writeHead(500,{'Content-Type':'text/plain'});
                        res.end('error 2 in update');
                    }
                });
            }

        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error 2 in inesrting the game');
        }
    });

;

};








exports.getGameBoard = async (req, res, q)=>{
    let gameId = q.query.id;
    st.query("SELECT game_board FROM games WHERE game_id =?", [gameId], (result, err)=>{
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error in inesrting the game');
            return;
        }
        if(result != 0){
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(result[0].game_board);
        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error 2 in inesrting the game');
        }
    });
}


exports.getActiveGameId = async (req, res, q)=>{
    let username = q.query.username;
    st.query("SELECT game_id FROM games WHERE active = 1 AND (player1 = ? OR player2 = ?)", [username,username], (result, err)=>{
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('');
            return;
        }
        if(result != 0){
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result[0].game_id));
        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('');
        }
    });
}


async function getTurn(gameId){
    let turn;
    st.query("SELECT current_turn FROM games WHERE game_id =?", [gameId], (result, err)=>{        
     if(err){
         return;
     }
     if(result != 0){
        turn = result[0].current_turn;
     }else{
         return;
     }
 });
 if(turn){ return turn};
}



function checkUp(i,j, player, opponent, gameBoardArr){
    //checking that at least one opponent disc was captured
    let pastOpponent = false;
    for(let n=i; n<size; n++){
        if(n!=i){
            if(gameBoardArr[n*size+j]== 0){
                return 0;
            }
        }
        if(gameBoardArr[n*size+j]== opponent){
            pastOpponent = true;
        }
        if(pastOpponent){
            if(gameBoardArr[n*size+j]== player){
                return n;
            }
        }
    }
    return 0;
}

function checkDown(i,j, player, opponent, gameBoardArr){
    //checking that at least one opponent disc was captured
    let pastOpponent = false;
    for(let n=i; n>=0; n--){
        if(n!=i){
            if(gameBoardArr[n*size+j]== 0){
                return 0;
            }
        }
        if(gameBoardArr[n*size+j]== opponent){
            pastOpponent = true;
        }
            if(pastOpponent){
            if(gameBoardArr[n*size+j]== player){
                return n;
            }
        }
    }
    return 0;
}

function checkRight(i,j, player, opponent, gameBoardArr){
    //checking that at least one opponent disc was captured
    let pastOpponent = false;
    for(let n=j; n>=0; n--){
        if(n!=j){
            if(gameBoardArr[i*size+n]== 0){
                return 0;
            }
        }
        if(gameBoardArr[i*size+n]== opponent){
            pastOpponent = true;
        }
        if(pastOpponent){
            if(gameBoardArr[i*size+n]== player){
                return n;
            }
        }
    }
    return 0;
}

function checkLeft(i,j, player, opponent, gameBoardArr){
    //checking that at least one opponent disc was captured
    let pastOpponent = false;
    for(let n=j; n <size; n++){
        if(n!=j){
            if(gameBoardArr[i*size+n]== 0){
                return 0;
            }
        }
        if(gameBoardArr[i*size+n]== opponent){
            pastOpponent = true;
        }
        if(pastOpponent){
            if(gameBoardArr[i*size+n]== player){
                return n;
            }
        }
    }
    return 0;
}

function checkUpRight(i,j, player, opponent, gameBoardArr){
    //checking that at least one opponent disc was captured
    let pastOpponent = false;
    let p = j;
    for(let n=i; n<size; n++){
        if(p<0) return 0;

        if(n!=i && p!= j){
            if(gameBoardArr[n*size+p]== 0){
                return 0;
            }
        }
        if(gameBoardArr[n*size+p]== opponent){
            pastOpponent = true;
        }
        if(pastOpponent){
            if(gameBoardArr[n*size+p]== player){
                return [n,p];
         }
        }
        p--;
        
    }       
    return 0;
}

function checkUpLeft(i,j, player, opponent, gameBoardArr){
    //checking that at least one opponent disc was captured
    let pastOpponent = false;
    let p = j;
    for(let n=i; n<size; n++){
        if(p>size) return 0;

        if(n!=i && p!= j){
            if(gameBoardArr[n*size+p]== 0){
                return 0;
            }
        }
        if(gameBoardArr[n*size+p]== opponent){
            pastOpponent = true;
        }
        if(pastOpponent){
            if(gameBoardArr[n*size+p]== player){
                return [n,p];
         }
        }
        p++;
    }       
    return 0;
}

function checkDownRight(i,j, player, opponent, gameBoardArr){
    //checking that at least one opponent disc was captured
    let pastOpponent = false;
    let p = j;
    for(let n=i; n<size; n--){
        if(p<0) return 0;

        if(n!=i && p!= j){
            if(gameBoardArr[n*size+p]== 0){
                return 0;
            }
        }
        if(gameBoardArr[n*size+p]== opponent){
            pastOpponent = true;
        }
        if(pastOpponent){
            if(gameBoardArr[n*size+p]== player){
                return [n,p];
         }
        }
        p--;
    }       
    return 0;
}

function checkDownLeft(i,j, player, opponent, gameBoardArr){
    //checking that at least one opponent disc was captured
    let pastOpponent = false;
    let p = j;
    for(let n=i; n<size; n--){
        if(p>size) return 0;

        if(n!=i && p!= j){
            if(gameBoardArr[n*size+p]== 0){
                return 0;
            }
        }
        if(gameBoardArr[n*size+p]== opponent){
            pastOpponent = true;
        }
        if(pastOpponent){
            if(gameBoardArr[n*size+p]== player){
                return [n,p];
         }
        }
        p++;
    }       
    return 0;
}



function changeTurn(player, opponent, gameBoardArr){
    //checks if the opponent have any possible moves
    for(let i=0; i<size; i++){
        for(let j=0; j<size; j++){
            if(canMove(i,j,opponent, player, gameBoardArr)){
                return 1;
            }
        }
    }
    //checks if the player have any possible moves
    for(let i=0; i<size; i++){
        for(let j=0; j<size; j++){
            if(canMove(i,j,player, opponent, gameBoardArr)){
              return 2;
            }
        }
    }
    //if both of them have no valid move the game ends
    return 3;
}

function canMove(i,j, player, opponent, gameBoardArr){
    if(checkUp(i,j, player, opponent, gameBoardArr)!=0) return true;
    if(checkDown(i,j, player, opponent, gameBoardArr)!=0) return true;
    if(checkRight(i,j, player, opponent, gameBoardArr)!=0) return true;
    if(checkLeft(i,j, player, opponent, gameBoardArr)!=0) return true;
    if(checkUpRight(i,j, player, opponent, gameBoardArr)!=0) return true;
    if(checkUpLeft(i,j, player, opponent, gameBoardArr)!=0) return true;
    if(checkDownRight(i,j, player, opponent, gameBoardArr)!=0) return true;
    if(checkDownLeft(i,j, player, opponent, gameBoardArr)!=0) return true;
    return false;
}


exports.logOutGame = async (req, res, q)=>{
    let id = q.query.id;
    st.query("UPDATE games SET active=0 WHERE game_id=?", [id], (result, err)=>{             
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error in update');
            return;
        }
        if(result.length != 0){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('logOut');
        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error 2 in update');
        }
    });
}


exports.getUsersData = async (req, res, q)=>{
    // renders user currnet page
    let username = q.query.username;
    if(!username){
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('username is missing');
        return;
    }
    st.query("SELECT * FROM users_data WHERE username=?", [username], (result, err)=>{
        if(err){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error in lobbyUsers');
            return;
        }
        if(result.length > 0){
            let user = JSON.stringify(result[0]);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(user);
        }else{
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('error 2 in lobbyUsers');
        }
    });

};