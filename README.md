# Blog avec FastAPI, React, MongoDB et ChatGPT

Ce projet est un blog moderne qui utilise FastAPI pour le backend, React pour le frontend, et MongoDB pour la base de données. Il intègre également un chatbot alimenté par ChatGPT pour améliorer l'interaction utilisateur.
Installation avec Docker

Pour installer et exécuter ce projet à l'aide de Docker, suivez ces étapes :

    Clonez le dépôt :

    bash

git clone https://github.com/Lucky12348/Blog.git

Naviguez dans le dossier du projet :


	cd Blog

Utilisez 
	
 	npm install 

Pour installer les dépendances nécessaires pour le frontend.

Lancez le projet à l'aide de Docker Compose :

    docker-compose up

Configuration du Chatbot

Pour configurer le chatbot ChatGPT dans le projet :

    Ouvrez le fichier backend/app/main.py.

    Localisez la ligne suivante :

    python

openai_client = OpenAI(api_key="TOKEN")

Remplacez "TOKEN" par votre clé API OpenAI.

Pour apporter des modifications à la fonctionnalité du chatbot, modifiez la fonction ask_openai dans le même fichier.

Frontend : http://localhost:3000/

Backend fastAPI : http://localhost:8000/docs

Backend MongoExpress : http://localhost:8081
