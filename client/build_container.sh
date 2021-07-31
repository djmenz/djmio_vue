aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 741637717557.dkr.ecr.ap-southeast-2.amazonaws.com;
docker build -t djmiovue .;
docker tag djmiovue:latest 741637717557.dkr.ecr.ap-southeast-2.amazonaws.com/djmio_vue:latest;
docker push 741637717557.dkr.ecr.ap-southeast-2.amazonaws.com/djmio_vue:latest;
aws ecs update-service --cluster arn:aws:ecs:ap-southeast-2:741637717557:cluster/ecs-course-ec2 --service djmio --force-new-deployment --region ap-southeast-2;