

let username, password;
let activeGameId = 0;
let divLogin, divRegistration, divLobby, divUser, divGame, divConnectedUsers;
let loginScreen, registrationScreen, lobbyScreen, userScreen, gameScreen;
let lblLoginMessage;
let lblRegUsername, lblRegEmail;
let usernameInput, passwordInput;
let usernameRegInput, passwordRegInput, emailRegInput, imgInput;
let divUserData, divUsersLogedIn, divImages;
let inptMessages;
let btnSend;
let size = 8;
let gameBoardArr = [];
let inGame = false;
let btnRegister;
let userTitle;
let userImg;
let userWins,userLoses, userWLRatio;
let FirstWin,SmallTimeWinner, BigTimeWinner, Flipper, FlipFloper, FlapjackFlapper;
let divHowToPlay, divGameBoard;
let divPlayer1, divPlayer2;
let h2Player1Name,h2Player2Name;
let imgPlayer1, imgPlayer2;
let h3Player1DisksCount, h3Player2DisksCount;
let lblTurn;

let trophiesObj = {};



function init(){
    divLogin = document.getElementById("divLogin");
    divRegistration = document.getElementById("divRegistration");
    divLobby = document.getElementById("divLobby");
    divUser = document.getElementById("divUser");
    divGame = document.getElementById("gameScreen");
    
    loginScreen = document.getElementById("loginScreen");
    registrationScreen = document.getElementById("registrationScreen");
    lobbyScreen = document.getElementById("lobbyScreen");
    userScreen = document.getElementById("userScreen");
    gameScreen = document.getElementById("gameScreen");
    usernameInput = document.getElementById("usernameInput");
    passwordInput = document.getElementById("passwordInput");
    lblLoginMessage = document.getElementById("lblLoginMessage");
    divHowToPlay = document.getElementById('divHowToPlay'); 
    usernameRegInput = document.getElementById("usernameRegInput");
    passwordRegInput = document.getElementById("passwordRegInput");
    emailRegInput = document.getElementById("emailRegInput");  
    lblRegUsername = document.getElementById("lblRegUsername");  
    lblRegEmail = document.getElementById("lblRegEmail");  
    btnRegister = document.getElementById("btnRegister");  

    divUserData = document.getElementById('divUserData');

    divGameBoard  = document.getElementById('divGameBoard');

    divUsersLogedIn = document.getElementById('divUsersLogedIn');
    inptMessages = document.getElementById('inptMessages');
    btnSend = document.getElementById('btnSend');

    userTitle = document.getElementById('userTitle');
    userImg = document.getElementById('userImg');
    userWins = document.getElementById('userWins');
    userLoses = document.getElementById('userLoses');
    userWLRatio = document.getElementById('userWLRatio');
    FirstWin = document.getElementById('FirstWin');
    SmallTimeWinner = document.getElementById('SmallTimeWinner');
    BigTimeWinner = document.getElementById('BigTimeWinner');
    Flipper = document.getElementById('Flipper');
    FlipFloper = document.getElementById('FlipFloper');
    FlapjackFlapper = document.getElementById('FlapjackFlapper');
    lblTurn = document.getElementById('lblTurn');

    h2Player1Name = document.getElementById('h2Player1Name');
    h2Player2Name = document.getElementById('h2Player2Name');
    imgPlayer1 = document.getElementById('imgPlayer1');
    imgPlayer2 = document.getElementById('imgPlayer2');
    h3Player1DisksCount = document.getElementById('h3Player1DisksCount');
    h3Player2DisksCount = document.getElementById('h3Player2DisksCount');

    trophiesObj = {
      FirstWin : false,
      SmallTimeWinner : false,
      BigTimeWinner : false,
      Flipper : false,
      FlipFloper : false,
      FlapjackFlapper : false,
    };

    createGameBoard();
    renderBoard();
}


function imgCliked(e){
  let selected = document.getElementsByClassName('selected');
  if(selected.length == 1){
      selected[0].classList.remove('selected');
  }
  e.classList.add('selected');
}


function show(element){
    let shown = document.getElementsByClassName('shown');
    if(shown.length == 1){
        shown[0].classList.add('hidden');
        shown[0].classList.remove('shown');
    }
    element.classList.add('shown');
    element.classList.remove('hidden');
}




function removeAllChildNodes(node){
  while(node.firstChild)
      node.removeChild(node.firstChild);

}

//login button was cliked - check if userbname and password are valid and log in
function btnLoginCliked(){
  //login user
  username = usernameInput.value;
  password = passwordInput.value;
  if(!username || !password) return;
  
  lblLoginMessage.innerHTML = "";
  
  sendHttpGetRequest('api/login?username=' + username + '&password='+password, (response)=>{
    if(response == 'ok'){
    updateUserPage('Lobby');
    connectedUsers();
         
    }else if(response == "invalid"){
      lblLoginMessage.innerHTML = "invalid username or password.";
    }else if(response == "taken"){
      lblLoginMessage.innerHTML = "username already taken.";
    }else{//wtf ???

    }
  });
 
}


function btnRegisterCliked(){
  let usernameReg = usernameRegInput.value;
  let passwordReg = passwordRegInput.value;
  let emailReg = emailRegInput.value;

  let selected = document.getElementsByClassName('selected');
  if(selected.length == 1){
      let path = selected[0].src;
      path = path.substring(path.lastIndexOf("/"),path.length);
      path = "/images/tokens" + path;
      imgInput = path;
  }     

  if(!usernameReg || !passwordReg || !emailReg || !imgInput) return;
//need to check if username or email allready in
  sendHttpGetRequest('api/register?username=' + usernameReg + '&password='+passwordReg + '&email=' +emailReg + '&img=' +imgInput , (response)=>{
    if(response == 'user registrated'){
    updateUserPage('Login');
        
    }else{
      //eror registrating user
    }

  });
 

}

function checkRegistrationValue (col, val){
  sendHttpGetRequest('api/check_register?col_check=' + col + '&val_check='+val, (response)=>{
    if(response == 'ok'){
      btnRegister.disabled = false;
      lblRegUsername.innerHTML = "";
      lblRegEmail.innerHTML = "";
      
    }
    if(response == 'user allready registrated'){
    //erorpromt
      if(col == 'username'){
        lblRegUsername.innerHTML = "Username allready Taken";
        btnRegister.disabled = true;
      }else if(col == 'email'){
        lblRegEmail.innerHTML = "Email allready Taken";
        btnRegister.disabled = true;
      }
        
    }else{
      //eror registrating user
    }

  });
}



function btnLobbyCliked(){
  updateUserPage('User');
  
}

function updateUserPage(page){
  sendHttpGetRequest('api/update_page?username=' + username + '&password='+ password + '&page='+ page, (response)=>{
    if(response == 'page updated'){
      render();    
    }else{
      //write an eror massage
    }
  });
}


//renders users current page by the data base
function render(){
  sendHttpGetRequest('api/render?username=' + username + '&password='+ password, (response)=>{
    if(response == 'Game'){
      if(!inGame){
        inGame = true;
        sendHttpGetRequest('api/get_active_game_id?username=' + username, (response)=>{
          if(response != null){
            activeGameId = parseInt(response);
            updateBoard(activeGameId);
            renderBoard();
            stillInGame(activeGameId);
          }
        });
      }
    }else if(response == 'Lobby'){
      sendHttpGetRequest('api/lobby_users?username=' + username + '&password='+ password, (response)=>{
        removeAllChildNodes(divUsersLogedIn);
        let users = JSON.parse(response);
        let table = document.createElement('table');
        for(let i=0; i<users.length; i++){
          if(users[i].username == username){continue}
          let tr = document.createElement('tr');
          let td = document.createElement('td');
          //let tdimg = document.createElement('td');
          let img = document.createElement('img');
          img.src = users[i].profil_picture + "";
          //tdimg.appendChild(img);
          let userId = users[i].id;
          let userName = users[i].username;
          td.appendChild(img);
          td.innerHTML += userName;
          td.onclick = function(){
            userClicked(userId, userName);
          }
          //tr.appendChild(tdimg);
          tr.appendChild(td);
          
          table.appendChild(tr);
        }

        divUsersLogedIn.appendChild(table);
      });
    }
    let id = "div" + response;
    let elementToRender = document.getElementById(id);
    show(elementToRender);
    
  });
  setTimeout(render, 500);
}


function connectedUsers(){
  sendHttpGetRequest('api/lobby_users?username=' + username + '&password='+ password, (response)=>{
    removeAllChildNodes(divUsersLogedIn);
    let users = JSON.parse(response);
    let table = document.createElement('table');
    let th = document.createElement('th');
    th.innerHTML = "Users";
    table.appendChild(th);
    for(let i=0; i<users.length; i++){
      if(users[i].username == username){
        userData(users[i]);
        continue;
      }
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      let img = document.createElement('img');
      img.src = users[i].profil_picture + "";
      let userId = users[i].id;
      let userName = users[i].username;
      td.appendChild(img);
      td.innerHTML += userName;
      td.onclick = function(){
        userClicked(userId, userName);
      }

      tr.appendChild(td);
      table.appendChild(tr);
    }

    divUsersLogedIn.appendChild(table);
  });
}


function userData(userObg){
//a function to update users data profile in lobby
  userTitle.innerHTML = userObg.username;
  userImg.src = userObg.profil_picture+"";
  userWins.innerHTML = userObg.wins;
  userLoses.innerHTML = userObg.loses;
  userWLRatio.innerHTML = userObg.wins/userObg.loses;

  checkTropies(userObg);
  // rendering the trophies the users accived  
  if(trophiesObj.FirstWin){haveTrophie(FirstWin)};
  if(trophiesObj.SmallTimeWinner){haveTrophie(SmallTimeWinner)};
  if(trophiesObj.BigTimeWinner){haveTrophie(BigTimeWinner)};
  if(trophiesObj.Flipper){haveTrophie(Flipper)};
  if(trophiesObj.FlipFloper){haveTrophie(FlipFloper)};
  if(trophiesObj.FlapjackFlapper){haveTrophie(FlapjackFlapper)};
}
 
//checkes if user achived tropihes
function checkTropies(obj){
    let data = {};
    data = obj;
    let wins = data.wins;
    let flips = data.disk_fliped;
    
    if(wins > 0){trophiesObj.FirstWin = true;}
    if(wins > 10){trophiesObj.SmallTimeWinner = true;}
    if(wins > 50){trophiesObj.BigTimeWinner = true;}
    if(flips > 250){trophiesObj.Flipper = true;}
    if(flips > 1500){trophiesObj.FlipFloper = true;}
    if(flips > 5500){trophiesObj.FlapjackFlapper = true;}
}

//render tropies
function haveTrophie(element){
    element.classList.add('trophie');
    element.classList.remove('grayscale');
}






function userClicked(id, user){
  sendHttpGetRequest('api/start_game?player1=' + username + '&player2=' + user, (response)=>{
    if(response != null){
      let responseObj = JSON.parse(response);
      activeGameId = responseObj.insertId;
      updateUserPage('Game');
      render();
      sendHttpGetRequest('api/user_game_page?username=' + user + '&id='+ id, (response)=>{
        if(response == 'page updated'){
          updateBoard(activeGameId);
          renderBoard();
          stillInGame(activeGameId);
        }
      });
    }
  });
}

function stillInGame(gameId){
  checkGameStatus(gameId,(isActive)=>{
    if(!isActive){
      updateUserPage('Lobby');
      render();
    }else{
      updateBoard(gameId);
      setTimeout(stillInGame(gameId), 500);
    }
  });
}

function checkGameStatus(id, callback){
  sendHttpGetRequest('api/game_data?id='+id, (response)=>{     
    if(JSON.parse(response).active == 1){
      callback(true);
    }else{
    callback(false);      
    }
  });
}




function createGameBoard(){
  removeAllChildNodes(divGameBoard);
  
  let gameBoard = document.createElement("div");
  gameBoard.id = "gameBoard";
  let table = document.createElement("table");
  for(let i=0; i<size; i++){
      let tr = document.createElement("tr");
      for(let j=0; j<size; j++){
          let td = document.createElement("td");
          td.classList.add("cell");
          td.id = i+"."+j;
          td.onclick = function(){
              cellClicked(i, j, activeGameId);
          }
          tr.appendChild(td);
          gameBoardArr.push(0);  
      }
      table.appendChild(tr);
  }
  gameBoardArr[((size/2-1)*(size+1))]= 1;
  gameBoardArr[((size/2)*(size-1))]= 2;
  gameBoardArr[((size/2)*(size+1)-1)]= 2;
  gameBoardArr[((size/2)*(size+1))]= 1;
  gameBoard.appendChild(table);
  divGameBoard.appendChild(gameBoard);

  let btnLogOut = document.createElement('button');
  btnLogOut.innerHTML = "LogOut";
  btnLogOut.onclick = ()=>{
      logOut();
  }
  divGameBoard.appendChild(btnLogOut);
  
}

function cellClicked(i, j, id){
  renderBoard();
  sendHttpGetRequest('api/cell_clicked?username=' +username + '&i='+i +"&j="+j+"&id="+id, (response)=>{     
    if(response == 'valid move'){
      //the click was valid and the database was updated
      updateBoard(id);
    }else if(response == 'game ends'){
      //the game ended and the database was updated
      sendHttpGetRequest('api/game_data?id='+id, (response)=>{     
        let gameData = JSON.parse(response);
        let winner = gameData.winner;
        lblTurn.innerHTML = "The winner is " + winner;
        lblTurn.classList.remove("player1Turn");
        lblTurn.classList.remove("player2Turn");
        lblTurn.classList.add("winner");

      });
      updateBoard(id);
      
    }else{
      return;
    }
  });
}

//updated gameBoardArr by server
function updateBoard(id){
  sendHttpGetRequest('api/get_game_board?id='+id, (response)=>{     
    if(response != null){
      let data = JSON.parse(response);
      for(let i=0; i<data.length; i++){
        gameBoardArr[i] = data[i];
      } 
      
      sendHttpGetRequest('api/game_data?id='+id, (response)=>{     
        let gameData = JSON.parse(response);
        let player1Name = gameData.player1 + "";
        let player2Name = gameData.player2 + "";
        let currentTurn = gameData.current_turn;

        if(currentTurn == 1){
          lblTurn.innerHTML = "&nbsp;&nbsp;&nbsp;" + player1Name + " turn&nbsp;&nbsp;&nbsp;";
          lblTurn.classList.remove("player2Turn");
          lblTurn.classList.add("player1Turn");
        }else if(currentTurn == 2){
          lblTurn.innerHTML = "&nbsp;&nbsp;&nbsp;" + player2Name + " turn&nbsp;&nbsp;&nbsp;";
          lblTurn.classList.remove("player1Turn");
          lblTurn.classList.add("player2Turn");
        }

        h2Player1Name.innerHTML = player1Name;
        h2Player2Name.innerHTML = player2Name;
        h3Player1DisksCount.innerHTML = gameData.player1_score;
        h3Player2DisksCount.innerHTML = gameData.player2_score;
        sendHttpGetRequest('api/get_users_data?username='+player1Name, (response)=>{
          let userData = JSON.parse(response);
          imgPlayer1.src = userData.profil_picture ;
          
        });
        sendHttpGetRequest('api/get_users_data?username='+player2Name, (response)=>{
          let userData = JSON.parse(response);
          imgPlayer2.src = userData.profil_picture ;
          
        });
      });


    }else{
      console.log("eror updating game board");
      return;
    }
  });
  renderBoard();
}

function renderBoard(){
  for(let i=0; i<size; i++){     
      for(let j=0; j<size; j++){
          let id = i+"."+j;   
          if(gameBoardArr[(i*size+j)]== 1){
              let cell = document.getElementById(id);
              removeAllChildNodes(cell);
              let img = document.createElement('img');
              img.src = "/images/black.png";
              cell.appendChild(img);
          }
          if(gameBoardArr[(i*size+j)]== 2){
              let cell = document.getElementById(id);
              removeAllChildNodes(cell);
              let img = document.createElement('img');
              img.src = "/images/white.png";
              cell.appendChild(img);
          }
      }
  }

}


function logOut(){
  sendHttpGetRequest('api/logout_game?id='+activeGameId, (response)=>{     
    if(response == 'logOut'){
      updateUserPage('Lobby');
      render();
    }else{
      console.log("eror updating game board");
      return;
    }
  });

}