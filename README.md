# run on local env
1. `docker-compose up -d`
2. `yarn start`

# run on development env
1. `yarn`
2. `yarn build`
3. `yarn prod:dev`

# run on production env
1. `yarn`
2. `yarn build`
3. `yarn prod:prod`

# swagger docs url
- GET `/api-docs`

# change ec2 KST timezone
- `sudo timedatectl set-timezone Asia/Seoul`
