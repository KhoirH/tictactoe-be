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


http.listen(3001, function() {
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
    })
    
    
    client.on('joinGame', (data) => {
      const host = Object.keys(room[data.roomId].user)[0];
      const checkRoom = Object.values(room[data.roomId].user).length < 2;
      if (checkRoom) {
        room[data.roomId].user[data.user.id] = data.user.symbol;
        room[data.roomId].activeUser = host;
        room[data.roomId].status = 'start';
      }
    })

    client.on('hitBox', (data) => {
      room[data.roomId].dataTictactoe[data.boxId] = data.user;
      const sym = {
        x: '',
        o: '',
      };
      const dataArrayTictactoe = Object.entries(room[data.roomId].dataTictactoe);
      
      for (let i = 0; i < dataArrayTictactoe.length; i++) {
        const dataSingleTictactoe = dataArrayTictactoe[i];
        sym[dataSingleTictactoe[1].symbol] += dataSingleTictactoe[0];

        if(winPath.includes(sym.x) || winPath.includes(sym.o)) {
          room[data.roomId].win = dataSingleTictactoe[1].id;
          break;
        }
      }
      
    });
  })
})
