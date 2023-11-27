# Blog avec FastAPI, React, MongoDB et ChatGPT

Ce projet est un blog moderne qui utilise FastAPI pour le backend, React pour le frontend, et MongoDB pour la base de données. Il intègre également un chatbot alimenté par ChatGPT pour améliorer l'interaction utilisateur.
Installation avec Docker

### Pour installer et exécuter ce projet à l'aide de Docker, suivez ces étapes :

#### Clonez le dépôt :


	git clone https://github.com/Lucky12348/Blog.git

#### Naviguez dans le dossier du projet :


	cd Blog

#### Utilisez :
	
 	npm install 

Pour installer les dépendances nécessaires pour le frontend.

### Docker

#### Lancez le projet à l'aide de Docker Compose :

    docker-compose up

### Configuration du Chatbot

#### Pour configurer le chatbot ChatGPT dans le projet :

#### Localisez la ligne suivante :
https://github.com/Lucky12348/Blog/blob/a70af56eb80334bfd77c9656e435bf8bab6e2205/backend/app/main.py#L20

Remplacez "TOKEN" par votre clé API OpenAI.

### Pour apporter des modifications à la fonctionnalité du chatbot, modifiez la fonction :
https://github.com/Lucky12348/Blog/blob/a70af56eb80334bfd77c9656e435bf8bab6e2205/backend/app/main.py#L274

- Frontend : http://localhost:3000/

- Backend fastAPI : http://localhost:8000/docs

- Backend MongoExpress : http://localhost:8081


