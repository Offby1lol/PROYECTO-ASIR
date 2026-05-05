FROM node:20

WORKDIR /app

# Copia todo antes de instalar
COPY . .

# Instala deps después de tener todo
RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
