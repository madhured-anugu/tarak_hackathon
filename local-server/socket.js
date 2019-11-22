

const connection = {
 socket: null,
 onlineClients : new Set(),
 sendMessage: (type,msg) =>{
     const sock = connection.socket;
     console.log(' sending '+ msg + ' and '+ type + ' with socket '+ !!sock);
     if(sock){
         sock.emit(type,msg);
     }
 }
};
module.exports = connection