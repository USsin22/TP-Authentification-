# Utiliser une image Node.js stable
FROM node:18

# Créer le dossier de l'application
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'app tourne
EXPOSE 5000

# Commande pour démarrer l'application
CMD [ "node", "server.js" ]
