const Card = require('../models/card')


const createCard = (req, res) => {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id}).then((cardData)=>{
        res.send(cardData)
    }).catch((error) => {
        switch(error.name){
            case "ValidationError":
                return res.status(400).send({message: "Переданы некорректные данные при создании карточки."});
                break;
            default:
                return res.status(500).send({message: "На сервере произошла ошибка."})
        }
    })
}

const getAllCards = (req, res) => {
    Card.find({}).populate('owner').then((cards) => {
        res.send(cards)
    }).catch((error) => {
        switch(error.name){
            case "ValidationError":
                return res.status(400).send({message: "Переданы некорректные данные."});
                break;
            default:
                return res.status(500).send({message: "На сервере произошла ошибка."})
        }
    })
}

const deleteCardById = (req, res) => {
    Card.findByIdAndRemove(req.params.id).populate('owner').then((card) => {
        if(!card){
            return res.status(404).send({message: "Карточка с указанным _id не найдена."}); 
        }
        res.send(card)
    }).catch((error) => {
        switch(error.name){
            case "CastError":
                return res.status(400).send({message: "Передан несуществующий _id карточки."});
                break;
            default:
                return res.status(500).send({message: "На сервере произошла ошибка."})
        }
    })
}

const likeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, {$addToSet: {likes: req.user._id}}, {
        new: true, // обработчик then получит на вход обновлённую запись
    }).populate('likes')
    .then((card) => {
        if(!card){
            return res.status(404).send({message: "Передан несуществующий _id карточки."}); 
        }
        res.send(card)
    }).catch((error) => {
        switch(error.name){
            case "CastError":
                return res.status(400).send({message: "Передан несуществующий _id карточки."});
                break;
            default:
                return res.status(500).send({message: "На сервере произошла ошибка."})
        }
    })
}

const dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, {$pull: {likes: req.user._id}}, {
        new: true, // обработчик then получит на вход обновлённую запись
    }).populate('likes')
    .then((card) => {
        if(!card){
            return res.status(404).send({message: "Передан несуществующий _id карточки."}); 
        }
        res.send(card)
    }).catch((error) => {
        switch(error.name){
            case "CastError":
                return res.status(400).send({message: "Переданы некорректные данные для снятии лайка."});
                break;
            default:
                return res.status(500).send({message: "На сервере произошла ошибка."})
        }
    })
}

module.exports = {
    createCard,
    getAllCards,
    deleteCardById,
    likeCard,
    dislikeCard
};