# build stage
FROM node:lts-alpine as build-stage

# Install AWS CLI dependencies
RUN apk --no-cache add \
    groff \
    less \
    python3 \
    py3-pip

# Install AWS CLI using pip
RUN pip3 install awscli --break-system-packages

WORKDIR /app
# Make sure old one is deleted
# RUN rm latest_all_days.json 
# RUN aws s3 cp s3://djmio/latest_all_days.json .
COPY package*.json ./
# RUN export NODE_OPTIONS=--openssl-legacy-provider   
# RUN npm install --force
COPY . .
RUN chmod +x build_and_upload.sh
# RUN npm run build --force
#RUN aws s3 sync /app/dist s3://djmio-cf

ENTRYPOINT ["/app/build_and_upload.sh"]

# # production stage
# FROM nginx:stable-alpine as production-stage
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
# COPY mime.types /etc/nginx/mime.types
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80

