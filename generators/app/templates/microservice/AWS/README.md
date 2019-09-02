# AWS 

This folder contains:
 * Dockerrun.aws.json
 * ForUpload
 * devops_script.sh
 * repo_access.json

 ### Dockerrun.aws.json

 This file needs to be uploaded to Elastic Beanstalk application version imediatly after the yo generator is used to create this microservice

 ### ForUpload
 * is used by the devops_script.sh to locate the variables you want to upload to Elastic Beanstalk targeted environment.

 ### devops_script.sh

 This script is designed to aid in common tasks:
  * ElasticBeanstalk Environment -> new environment with ECR Repositiory for it, list/update environment variables 

  * RDS Database creation --> PostgreSQL

  * CloudWatch log deletion

 ### repo_acess.json
 * is used by devops_script.sh when creating a new ECR repository access policy