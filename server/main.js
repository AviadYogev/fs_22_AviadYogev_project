let http = require('http');
let url = require('url');
let st = require('./server_tools');
let api = require("./api_functions");

const apiFunctions = {

    '/login' : api.login,
    '/register' : api.register,
    '/check_register' : api.checkRegister,
    '/render' : api.render,
    '/update_page' : api.updatePage,
    '/get_users_id' : api.getUsersID,
    '/lobby_users' : api.lobbyUsers,
    '/user_game_page' : api.userGamePage,
    '/start_game' : api.startGame,
    '/game_data' : api.gameData,
    '/cell_clicked' : api.cellClicked,
    '/get_game_board' : api.getGameBoard,
    '/get_active_game_id' : api.getActiveGameId,
    '/logout_game' : api.logOutGame,
    '/get_users_data' : api.getUsersData,
    
};


http.createServer(async (req, res)=>{
    let q = url.parse(req.url, true);
    let path = q.pathname;
    if(path.startsWith('/api')){
        path = path.substring(4);
        if(!apiFunctions[path]){
            res.writeHead(400,{'Content-Type':'text/plain'});
            res.end('no such action');
            return;
        }
        apiFunctions[path](req, res, q);

    }else{
        st.serveStaticFile(path, res);
    }
}).listen(8080,()=>{console.log('now listening on port 8080...');});