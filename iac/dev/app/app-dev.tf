terraform {
  required_version = "1.3.7"
  backend "s3" {
    bucket         = "terraform-state-storage-863362256468"
    dynamodb_table = "terraform-state-lock-863362256468"
    key            = "training-fav-color-app/dev/app.tfstate"
    region         = "us-west-2"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.53"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

locals {
  env       = "dev"
  repo_name = "training-fav-color-app"
  org_name  = "byu-oit-training"
}

provider "aws" {
  region = "us-west-2"

  default_tags {
    tags = {
      repo                     = "https://github.com/${local.org_name}/${local.repo_name}"
      data-sensitivity         = "public" # TODO update this (see https://github.com/byu-oit/BYU-AWS-Documentation#tagging-standard)
      env                      = local.env
      cmdb-application-service = null # TODO update with the id for the relevant CMDB Application Service (e.g. APPSV0001234)
    }
  }
}

variable "image_tag" {
  type = string
}

module "app" {
  source                           = "../../modules/app"
  env                              = local.env
  image_tag                        = var.image_tag
  codedeploy_termination_wait_time = 0
  deploy_test_postman_collection   = "../../../.postman/training-fav-color-app.postman_collection.json"
  deploy_test_postman_environment  = "../../../.postman/dev-tst.postman_environment.json"
  log_retention_days               = 7
  min_tasks                        = 1
  max_tasks                        = 2
  cpu_size                         = 256
  memory_amount                    = 512
}

output "url" {
  value = module.app.url
}

output "codedeploy_app_name" {
  value = module.app.codedeploy_app_name
}

output "codedeploy_deployment_group_name" {
  value = module.app.codedeploy_deployment_group_name
}

output "codedeploy_appspec_json_file" {
  value = module.app.codedeploy_appspec_json_file
}
