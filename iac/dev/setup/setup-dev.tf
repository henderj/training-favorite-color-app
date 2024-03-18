terraform {
  required_version = "1.3.7"
  backend "s3" {
    bucket         = "terraform-state-storage-863362256468"
    dynamodb_table = "terraform-state-lock-863362256468"
    key            = "training-fav-color-app/dev/setup.tfstate"
    region         = "us-west-2"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.53"
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

module "setup" {
  source = "../../modules/setup"
  env    = local.env
}
