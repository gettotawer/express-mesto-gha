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
                return res.status(500).send({message: error.message})
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
                return res.status(500).send({message: error.message})
        }
    })
}

const deleteCardById = (req, res) => {
    Card.findByIdAndRemove(req.params.id).populate('owner').then((card) => {
        res.send(card)
    }).catch((error) => {
        switch(error.name){
            case "CastError":
                return res.status(404).send({message: "Карточка с указанным _id не найдена"});
                break;
            default:
                return res.status(500).send({message: error.message})
        }
    })
}

const likeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, {$addToSet: {likes: req.user._id}}, {
        new: true, // обработчик then получит на вход обновлённую запись
    }).populate('likes')
    .then((card) => {
        res.send(card)
    }).catch((error) => {
        switch(error.name){
            case "ValidationError":
                return res.status(400).send({message: "Переданы некорректные данные для постановки лайка."});
                break;
            case "CastError":
                return res.status(404).send({message: "Передан несуществующий _id карточки."});
                break;
            default:
                return res.status(500).send({message: error.message})
        }
    })
}

const dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, {$pull: {likes: req.user._id}}, {
        new: true, // обработчик then получит на вход обновлённую запись
    }).populate('likes')
    .then((card) => {
        res.send(card)
    }).catch((error) => {
        switch(error.name){
            case "ValidationError":
                return res.status(400).send({message: "Переданы некорректные данные для снятии лайка."});
                break;
            case "CastError":
                return res.status(404).send({message: "Передан несуществующий _id карточки."});
                break;
            default:
                return res.status(500).send({message: error.message})
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