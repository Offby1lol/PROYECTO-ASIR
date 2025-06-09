FROM node:16

WORKDIR /app

# 👇 Copia todo antes de instalar
COPY . .

# 👇 Instala deps después de tener todo
RUN npm install

# Instala cliente MySQL opcional
RUN apt-get update && apt-get install -y default-mysql-client

EXPOSE 3000

CMD ["node", "index.js"]
