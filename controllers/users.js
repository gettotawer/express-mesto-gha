const User = require('../models/user')


const createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar }).then((userData)=>{
        res.send(userData)
    }).catch((error) => {
        switch(error.name){
            case "ValidationError":
                return res.status(400).send({message: "Переданы некорректные данные при создании пользователя."});
                break;
            default:
                return res.status(500).send({message: error.message})
        }
        // if(error.name == "ValidationError"){
        //    return res.status(400).send({message: "Переданы некорректные данные при создании пользователя."})
        // } else {
        //     res.status(500).send({message: error.message})
        // }
    })

}

const getAllUsers = (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        switch(error.name){
            case "ValidationError":
                return res.status(400).send({message: "Переданы некорректные данные при создании пользователя."});
                break;
            default:
                return res.status(500).send({message: error.message})
        }
    })
}

const getUserById = (req, res) => {
    User.findById(req.params.id).then((user) => {
        if(!user){
            return res.status(404).send({message: "Пользователь по указанному _id не найден."});
        }
        res.send(user)
    }).catch((error) => {
        switch(error.name){
            case "CastError":
                return res.status(400).send({message: "Переданы некорректные данные при поиске пользователя."});
                break;
            default:
                return res.status(500).send({message: error.message})
        }

    })
}

const updateUserInformation = (req, res) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, {name, about}, {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true
    }).then((user) => {
        res.send(user)
    }).catch((error) => {
        switch(error.name){
            case "ValidationError":
                return res.status(400).send({message: "Переданы некорректные данные при обновлении профиля."});
                break;
            case "CastError":
                return res.status(404).send({message: "Пользователь с указанным _id не найден"});
                break;
            default:
                return res.status(500).send({message: error.message})
        }
    })
}

const updateUserAvatar = (req, res) => {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar }, {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true
    }).then((user) => {
        res.send(user)
    }).catch((error) => {
        switch(error.name){
            case "ValidationError":
                return res.status(400).send({message: "Переданы некорректные данные при обновлении аватара."});
                break;
            case "CastError":
                return res.status(404).send({message: "Пользователь с указанным _id не найден"});
                break;
            default:
                return res.status(500).send({message: error.message})
        }
    })
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserInformation,
    updateUserAvatar
};