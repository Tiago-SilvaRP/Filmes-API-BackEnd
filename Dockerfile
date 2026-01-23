#Define a versão do node.js a ser utilizada, em produção a imagem oficial do node.js é recomendada é a versão 20 ou superior
FROM node:24
#define o diretório de trabalho dentro do container
WORKDIR /app
#Copia o package.json para o ponto que é a raiz do diretório de trabalho, ou seja copia para dentro do container que é o /app
COPY package.json .
#Instala as dependencias do projeto
RUN npm install
#Copia todo o conteúdo do diretório atual para dentro do container na raiz do diretório de trabalho
COPY . .
RUN npm run build
#Expõe a porta 3000 para acesso externo
EXPOSE 3000
#Define o comando para iniciar a aplicação, CMD É DE COMANDO
CMD ["npm", "start"]
