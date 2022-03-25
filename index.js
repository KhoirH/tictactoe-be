const express = require('express');
const res = require('express/lib/response');
const { room, winPath } = require('./stateGame');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    credentials: true
  },
  allowEIO3: true
});


http.listen(process.env.PORT || 3001, function() {
  io.on('connection', client => {
    
    client.on('initGame', (data) => {
      room[data.roomId] = {
        user : {
          [data.user.id] : data.user.symbol,
        },
        activeUser : data.user.id,
        dataTictactoe : {},
        status: 'pending', 
        win: false
      };
    
      client.join(data.roomId);
      
      io.sockets.in(data.roomId)
        .emit('playerAction', room[data.roomId]);
    })
    
    
    client.on('joinGame', (data) => {
      const host = Object.keys(room[data.roomId].user)[0];
      const checkRoom = Object.values(room[data.roomId].user).length < 2;
      if (checkRoom) {
        room[data.roomId].user[data.user.id] = data.user.symbol;
        room[data.roomId].activeUser = host;
        room[data.roomId].status = 'start';
      }
      
          
      client.join(data.roomId);
      
      io.sockets.in(data.roomId)
        .emit('playerAction', room[data.roomId]);
    })

    client.on('hitBox', (data) => {
      room[data.roomId].dataTictactoe[data.boxId] = data.user;
      const sym = {
        x: '',
        o: '',
      };
      const dataArrayTictactoe = Object.entries(room[data.roomId].dataTictactoe);
      const activeUserNow = room[data.roomId]?.activeUser;
      room[data.roomId].activeUser = Object.keys(room[data.roomId]?.user).filter((da) => (da != activeUserNow))[0];
      for (let i = 0; i < dataArrayTictactoe.length; i++) {
        const dataSingleTictactoe = dataArrayTictactoe[i];
        sym[dataSingleTictactoe[1].symbol] += `${dataSingleTictactoe[0]}`;
      }

      for(let j = 0; j < winPath.length; j++) {
        let statusX = [];
        let statusO = [];
        for(let k = 0; Math.max(sym.x.length, sym.o.length) > k; k++) {
          if(sym.x[k]) statusX.push(winPath[j].includes(sym.x[k]));
          if(sym.o[k]) statusO.push(winPath[j].includes(sym.o[k]));
        }
        statusX = statusX.filter((da) => da);
        statusO = statusO.filter((da) => da);
        if(statusX.length === 3 || statusO.length === 3) {
          room[data.roomId].winner = activeUserNow;
          room[data.roomId].status = 'end';
          break;
        } 
      }
      io.sockets.in(data.roomId)
        .emit('playerAction', room[data.roomId]);
    });
  })
  
})


