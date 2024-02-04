const user = require('./routes/users');
const messageModel = require('./routes/msg')
const groupModel = require('./routes/group')

const io = require("socket.io")();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("A user connected");


    socket.on('join-server', async userDetails => {
        // console.log(userDetails)

        const currentUser = await user.findOne({
            username: userDetails.username
        })

        const allGroups = await groupModel.find({
            users: {
                $in: [
                    currentUser._id
                ]
            }
        })

        allGroups.forEach(group => {
            socket.emit('group-joined', group)
        })








        await user.findOneAndUpdate({
            username: userDetails.username
        }, {
            socketId: socket.id
        })


        const onlineUsers = await user.find({
            socketId: {
                $nin: [ "", socket.id ]
            }
        })

        onlineUsers.forEach(onlineUser => {
            socket.emit('new-user-join', {
                profileImage: onlineUser.profileImage,
                username: onlineUser.username,
            })
        })

        console.log(onlineUsers)


        socket.broadcast.emit('new-user-join', userDetails)
    })

    socket.on('disconnect', async () => {

        await user.findOneAndUpdate({
            socketId: socket.id
        }, {
            socketId: ""
        })

    })

    socket.on('private-message', async messageObject => {

        console.log(messageObject)


        await messageModel.create({
            msg: messageObject.message,
            sender: messageObject.sender,
            receiver: messageObject.receiver,
        })

        const receiver = await user.findOne({
            username: messageObject.receiver /* insta */
        })

        /* receiver = null */

        if (!receiver) {
            /* 
            jab receiver nhi milege
             */

            const group = await groupModel.findOne({
                name: messageObject.receiver /* insta */
            }).populate('users')


            if (!group) {

                /* 
                agar group nhi mila
                 */

                return
            }

            group.users.forEach(user => {
                socket.to(user.socketId).emit("receive-private-message", messageObject)
            })



            /* send message to users in group */




        }



        if (receiver)
            socket.to(receiver.socketId).emit('receive-private-message', messageObject)
    })

    socket.on("fetch-conversation", async conversationDetails => {
        const isUser = await user.findOne({
            username: conversationDetails.receiver
        });
   
        if (isUser) {
            const allMessages = await messageModel.find({
                $or: [
                    {
                        sender: conversationDetails.sender,
                        receiver: conversationDetails.receiver,
                    },
                    {
                        sender: conversationDetails.receiver,
                        receiver: conversationDetails.sender,
                    }
                ]
            });
            io.to(socket.id).emit('send-conversation', allMessages)
        } else {
            const allMessages = await messageModel.find({
                receiver: conversationDetails.receiver
            });
            io.to(socket.id).emit('send-conversation', allMessages)
            
        }
    });

    socket.on('create-new-group', async groupDetails => {
        const newGroup = await groupModel.create({
            name: groupDetails.groupName
        });
    
        const currentUser = await user.findOne({
            username: groupDetails.sender
        });
    
        newGroup.users.push(currentUser._id);
        await newGroup.save();
        

        socket.emit("group-created", newGroup)
    })

    socket.on("join-group", async joiningDetails => {
        const group = await groupModel.findOne({
            name: joiningDetails.groupName
        })

        const currentUser = await user.findOne({
            username: joiningDetails.sender
        })

        group.users.push(currentUser._id)

        await group.save()

        socket.emit('group-joined', {
            profileImage: group.profileImage,
            name: group.name
        })

    }) 
});
// end of socket.io logic

module.exports = socketapi;
