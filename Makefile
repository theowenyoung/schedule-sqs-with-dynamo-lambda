.Phony: init reset start

reset:
	yarn reset
	
db:	
	docker run -p 8000:8000 amazon/dynamodb-local

admin: 
	yarn admin
	
dev:
	yarn dev

build:
	docker-compose run build sh -c "sam build"
init-deploy:
	docker-compose run build sh -c "npm run build && sam build && sam deploy --guided" 
deploy:
	docker-compose run build sh -c "npm run build && sam build && sam deploy"
init-deploy-layer:
	node tools/build-layer && docker-compose run build-layer sh -c "cd nodejs && npm i --production && cd ../ && sam build && sam deploy --guided"
deploy-layer:
	node tools/build-layer && docker-compose run build-layer sh -c "cd nodejs && npm i --production && cd ../ && sam build && sam deploy"
api-sh:
	docker-compose exec api-gateway /bin/sh
run-build:
	docker-compose run build /bin/sh