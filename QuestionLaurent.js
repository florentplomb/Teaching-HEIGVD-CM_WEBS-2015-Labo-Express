var _ = require('underscore'),
	express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Issue = mongoose.model('Issue');
	User = mongoose.model('User');
	IssueType = mongoose.model('IssueType');
	Comment = mongoose.model('Comment');
 
module.exports = function (app) {
  app.use('/api/issues', router);
};
 
function convertMongoIssue(issue) {
//return user.toObject({ transform: true })
	return {
		id: issue.id,
		author:issue.author,
		issueType: issue.issueType,
		description: issue.description,
		longitude: issue.longitude,
		latitude: issue.latitude,
		status: issue.status,
		comments: issue.comments
	}
	// Ce console.log ne sera jamais appelé car tu fais return { ... } juste avant ;)
	console.log(issue);
}
 
router.route('/')
	.get(function(req, res, next) {
		// Ce code ne sert à rien dans le sens qu'il n'est pas utilisé plus tard. Ou du moins, le résultat n'est jamais utilisé.
		IssueType.findById("id", function(err, issueType) {
			var issue = new Issue({
        issueType: issueType
			});
			console.log(issueType);
		})
 
    // Pourquoi créer un objet Issue dans un get?
    var issue = new Issue({
       issueType: "id"
    }); 
    
    Issue.find() 
      // Par rapport au modèle Issue, la liste des paths si dessous contient des erreurs: Tag n'existe pas, user n'existe pas, 
      // issueType ok et comment est faux (devrait être comments). La doc de Mongoose parle des paths et ces paths correspondent
      // aux noms des attributs de ton modèle. Et si on utilise le terme de path, c'est qu'on pourrait écrire: comments.author par exemple.
      .populate('Tag user issuType comment')
      .exec(function (err, issues){
        if (err) return next(err);
        res.json(_.map(issues, function(issue) {
          return convertMongoIssue(issue);
        }));
      });
  })
 
  .post(function (req, res, next){
    var issue = new Issue({
      author: req.body.userId, 
      // C'est correct parce que Mongoose va magiquement faire le lien et créer l'object id. Mais attention, dans ton code on ne sait pas
      // si l'id de l'issueType pointe vers une issueType existante. On demande pas de validation de données. Je fais ce commentaire
      // pour bien comprendre qu'en pratique, on ferait un findById(issueTypeId) pour valider qu'elle existe.
      issueType: req.body.issueTypeId,
      description: req.body.description,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      status: req.body.status,
      comments: req.body.commentId
    });
    
    // Ce log devrait te sortir juste l'id de l'auteur vu qu'il n'y pas eu de populate.
    console.log(issue.author);
 
    // Comme ne fait pas de populate, tu vas avoir à dispo que les id de tes références (author, issueType)
    issue.save(function(err, issueSaved){
      res.status(201).json(convertMongoIssue(issueSaved));
    });
  });
 
router.route('/:id')
  .get(function(req, res, next){
    // Quelques populate pourrait être utile ici :) Dans le prochain bout de code, je te mettrai un exemple pour écrire quelque chose 
    // de réutilisable.
    Issue.findById(req.params.id, function(err, issue){
      res.json(convertMongoIssue(issue));
    });
  })
 
  .put(function(req, res, next){
    // Pourquoi pas le put mais personnellement, je ne laisserai pas forcément la possiblité de changer l'auteur ni le type. Mais ça reste
    // discutable pour le type. Par contre l'auteur, pour moi ne devrait clairement pas être modifiable. D'ailleurs, les commentaires
    // non plus. Pour les commentaires c'est parce qu'on a dit qu'on laissait la possibilité de les manipuler que via les actions.
    Issue.findById(req.params.id, function(err, issue){
      issue.author = req.body.User;
      issue.issueType = req.body.IssueType;
      issue.description = req.body.description;
      issue.longitude = req.body.longitude;
      issue.latitude = req.body.latitude;
      issue.status = req.body.status;
      issue.comments = req.body.Comment;
 
      issue.save(function(err, issueSaved){
        // Idem pour les populates
        res.json(convertMongoIssue(issueSaved));
      });
    });
  })
 
  .delete(function(req, res, next){
    // A part la gestion d'erreur en cas d'id qui n'existe pas, y a rien à dire ici :)
    Issue.findByIdAndRemove(req.params.id, function(err){
      res.status(204).end();
    });
  });