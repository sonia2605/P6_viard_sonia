const Sauce = require("../models/sauce");
const fs = require("fs");

//renvoi toutes les sauces présentent dans la base de donnée
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};

//renvoi une  seule sauce de la base de donnée selon l'ID de la sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

//creation d'une sauce par un utilisateur
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};


//modification d'une sauce
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(res.status(200).json({ message: "Sauce modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const fileName = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${fileName}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: "sauce supprimée !" })
          )
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//gestion des likes
exports.likeSauce = (req, res, next) => {
  let userId = req.body.userId;
  let sauceId = req.params.id;
  let likeState = req.body.like;

  switch (likeState) {
    //si like=1 on incrémente l'attribut likes de la sauce et on ajoute l'id de l'utilisateur dans le tableau usersLiked
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        { $inc: { likes: +1 }, $push: { usersLiked: userId } }
      )
        .then(() => res.status(200).json({ message: "J'aime" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    //si like=0 alors on étudie les deux tableaux usersLiked et usersDisliked et on mets à jour les attributs likes et dislikes ainsi que les tableaux eux meme selon la présence de l'userId dans l'un des deux
    case 0:
      //retourne le tableau correspondant a sauceId
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            //décrémente l'attribut likes de la sauce et supprime l'userId du tableau usersLiked
            Sauce.updateOne(
              { _id: sauceId },
              { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
            )
              .then(() =>
                res
                  .status(200)
                  .json({ message: "Neutre" })
              )
              .catch((error) => res.status(400).json({ error }));
          
          
            } else if (sauce.usersDisliked.includes(userId)) {
            //décrémente l'attribut dislikes de la sauce et supprime l'userId du tableau usersDisliked
            Sauce.updateOne(
              { _id: sauceId },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
            )
              .then(() =>
                res
                  .status(200)
                  .json({ message: "Vous avez enlever votre dislike !" })
              )
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;
    //si like=-1 on incrémente l'attribut dislikes de la sauce et on ajoute l'id de l'utilisateur dans le tableau usersDisliked
    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } }
      )
        .then(() =>
          res.status(200).json({ message: "Je n'aime pas !" })
        )
        .catch((error) => res.status(400).json({ error }));
      break;

      default : 
      console.log('error');
  }
};
