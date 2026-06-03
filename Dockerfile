# Estágio 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Copiar os arquivos de dependência
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Argumentos de build para o Vite (o Dockploy pode passá-los durante o build)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Disponibilizar como variáveis de ambiente para o processo de build do Vite
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Gerar a versão de produção
RUN npm run build

# Estágio 2: Produção com Nginx
FROM nginx:alpine

# Copiar a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos estáticos gerados no estágio de build
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
