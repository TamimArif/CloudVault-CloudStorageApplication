FROM node:18 as build

WORKDIR /app

# Declare build args
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID

# Make them available as envs during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

COPY package*.json ./
RUN npm install
COPY . .

# ✅ Export vars and build manually so Vite gets them
RUN export VITE_API_BASE_URL=$VITE_API_BASE_URL && \
    export VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID && \
    npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
