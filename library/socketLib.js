const socketio = require('socket.io');
const tokenLib = require('./tokenLib');

//importing redisLibrary
const redisLib = require("./redisLib");


const mongoose = require('mongoose');
const shortid = require("shortid")
const UserModel = mongoose.model('UserModel')

let setServer = (server) => {

    let io = socketio.listen(server);
    let myio = io.of('')
    let allOnlineUsers = [];

    myio.on('connection', function(socket){

        //verifying user
        socket.emit("verify-user", "Please Provide AuthToken For Verification")

        socket.on("set-user", (authToken)=>{
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, userdata)=>{
                if(err){
                    socket.emit('auth-error', "Please Provide Correct authToken Details")
                }else{
                    console.log("User is verified");
                    let currentUser = userdata.data;
                    socket.id=currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    let key = currentUser.userId;
                    let value = fullName;                  

                    let setUserOnline = redisLib.setANewOnlineUserInHash("onlineUsersMeeting", key, value, (err, allOnlineUsers) => {
                        if (err) {
                            logger.error(` error printed 1 : ${err.message}`, "socketLib:SetANewOnlineUserInHash", 10);
                        }
                        else {

                            redisLib.getAllUsersInAHash('onlineUsersMeeting', (err, result) => {
                                
                                if (err) {
                                    console.log(` error printed : ${err}`);
                                }
                                else {

                                    //placing every user in one global room
                                    //socket.join("globalRoom");
                                    console.log('room joined');
                                    myio.to("globalRoom").emit("onlineUsers",result)
                                    //socket.broadcast.emit('onlineUsers', result);
                                    console.log(result);
                                }
                            });

                        }
                    });//end setNewOnlineUsersInHash

                    socket.fullName = fullName;
                }
            })

        })

        socket.on("disconnect", ()=>{
            console.log("disconnect listened")
            if (socket.id) {
                redisLib.deleteUserFromHash('onlineUsersMeeting', socket.id);
                redisLib.getAllUsersInAHash('onlineUsersMeeting', (err, result) => {
                    if (err) {
                        logger.error(err.message, "socketLib:getAllUsersInAHash", 10);
                    }
                    else {

                        console.log('room leaved');
                        socket.leave("globalRoom");
                        myio.to("globalRoom").emit('onlineUsers', result);
                        //socket.broadcast.emit('onlineUsers', result);
                        console.log(result);

                    }
                });//end getAllUsersInAHash
            }

        })

        socket.on('notifyUpdates', (data) => {
            console.log("socket notify-updates called")
            console.log(data);
            socket.broadcast.emit(data.userId, data);
        });

        
    })

}

module.exports = {
    setServer : setServer
}