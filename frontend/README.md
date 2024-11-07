# Mon vieux Grimoire


## Comment lancer le projet ? 

### Avec npm

Faites la commande `npm install` pour installer les dépendances puis `npm start` pour lancer le projet. 

Le projet a été testé sur node 19. 


installation dans le Backend de plusieurs Package :
- Express
- mongoose
- body-parser ( pour traiter les requetes POST)
- nodemon pour faire la corelation peut importe le port
 concernant l'authentification :
 - bcryptjs ( permet de hasher les mots de passe)
 - jsonwebtoken ( pour les vérification des tokens)
 - 
 !!!! changement du port du server en 3001 pour eviter le conflit avec le npm start du front end !!!

 !! Changement dans le fichier utils/constants.js l'adresse du localhost en 3001 !!

 Integrer SHARP a multer-config.js pour redimensionner les images en 500x600 et les convertir en .webp