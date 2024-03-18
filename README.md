# training-fav-color-app

## Overview 
Deploys the training-fav-color-app API with Docker and Terraform on AWS

>### IMPORTANT: Fine-tune Your Generated App
>Much of the configuration has already been done for you by the Generator, but there are still some things left
>that you need to do. Complete the following items before proceeding:
>1. Decide which environments you need.
>    - By default, the template comes with `dev`, `stg`, `cpy`, and `prd`. Many apps will only need some of these, but the
>      template comes with all of them because it is easier to delete the ones you don't need than to create the ones you do
>      need.
>    - If you decide that you don't need `stg` or `cpy` (or even `prd` if you're using this for training), delete their respective folders in the `iac/` directory. You should
>      also delete their corresponding env matrix blocks in the `.github/workflows/*` files.
>2. Decide _how many_ Fargate tasks you want running in each environment (dev, prd, etc).
>    - By default, the template sets the minimum to 1 and the maximum to 2 for `dev` and `stg` and sets the
>      minimum to 2 and maximum to 8 for `cpy` and `prd`.
>    - The defaults may work for you, but you should discuss the expected usage of your application
>      with your team or with an architect to decide what these values should be.
>    - If you decide to change these values, you can find the values to change in the `module "app" {` block of the
>      `/iac/<env>/app/app-<env>.tf` file for any given environment.
>3. Decide what _size_ of Fargate tasks you want to use for each environment.
>    - By default, the template uses 512MiB of memory and 0.25 vCPUs for `dev` and `stg` and 1024MiB of memory and
>      0.5 vCPUs for `cpy` and `prd`.
>    - The defaults may work for you, but you should again discuss the expected usage of your application with your team
>      and/or with an architect to decide if you should change these.
>    - You can change these values in the same place as is described in step 2 above.

## How to run locally

### Prerequisites

* Install [Terraform](https://www.terraform.io/downloads.html), preferrably with [@byu-oit/tfvm](https://github.com/byu-oit/tfvm) for Windows, or [tfswitch](https://tfswitch.warrensbox.com/) for Mac/Linux.
* Install the [AWS CLI](https://aws.amazon.com/cli/)
* Log into your `dev` account (with [`aws sso login`](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/sso/login.html))
* Ensure your account has a [Terraform State S3 Backend](https://github.com/byu-oit/terraform-aws-backend-s3) deployed
* If you're outside the [`byu-oit` GitHub organization](https://github.com/byu-oit), obtain a DivvyCloud username and password from the Cloud Office at cloudoffice@byu.edu

### Local configuration
Add local configuration information here.

### Installation Instructions

* Install packages with `npm install`
    > **Note:**
    >
    > This will also set up git-hooks to use husky with a pre-commit hook that will automatically generate the openapi spec file, and format your terraform files when needed
* Add yourself (or your team) as a [Dependabot reviewer](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/configuration-options-for-dependency-updates#reviewers) in [`dependabot.yml`](.github/dependabot.yml)
* Commit/push your changes
```
git commit -am "update template with repo specific details" 
git push
```

### Final Steps
Now that your code in this repository is working, here are the finishing steps:

1. #### Create a Better Readme
   - This readme was created just to teach you how to use the template. You should replace this readme with one that
   is far more detailed. 

   > This step is placed first in this list since it is the most important, but it involves deleting the rest of the instructions. 
   > You should go over the information after this step now and then come back to this step.

   - Delete all of this README except for the first two lines and replace it with the contents of one of our README templates in [this repository](https://github.com/byu-oit/documentation-templates).

### Run and Validate Instructions
There are few ways to run locally:
#### docker-compose
 - This is a good way to run the app server along with any database or other system the app requires.
```shell
# ./
docker-compose up --build
```

 - This is the most comprehensive way to run locally, but it takes the longest because it needs to build the docker image and compile the typescript code etc.

#### npm run dev
- This is a good way to quickly make sure the app runs well without docker and without compiling
- This does not allow you to attach a debugger.
```shell
# ./app/
npm ci # or npm install
npm run dev
```


#### app-local-debug Run Configuration 
- In order to debug locally you will need to run the node application with specific arguments.
- You can use the provided run configuration `app-local-debug` in debug mode.

> Note:
> 
> This run configuration is tracked by git, so don't include any sensitive environment variables in the configuration.



## How to Deploy

### Deploy the "one time setup" resources

```
cd iac/dev/setup/
terraform init
terraform apply
```

In the AWS Console, see if you can find the resources from `setup.tf` (ECR, SSM Param).

### Test GitHub Actions in your repo

If you look at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), you'll see that it is set up to run on pushes to the `dev` branch. Because you have already pushed to the `dev` branch, this workflow should be running now.

* In GitHub, click on the workflow run (it has the same name as the last commit message you pushed)
* Click on the `Build and Deploy` job
* Expand any of the steps to see what they are doing

### View the deployed application

Anytime after the `Terraform Apply` step succeeds:
```
cd ../app/
terraform init
terraform output
```

This will output a DNS Name. Enter this in a browser. It will probably return `503 Service Unavailable`. It takes some time for the ECS Tasks to spin up and for the ALB to recognize that they are healthy.

In the AWS Console, see if you can find the ECS Service and see the state of its ECS Tasks. Also see if you can find the ALB Target Group, and notice when Tasks are added to it.

> Note:
> 
> While Terraform creates the ECS Service, it doesn't actually spin up any ECS Tasks. This isn't Terraform's job. The ECS Service is responsible for ensuring that ECS Tasks are running.
> 
> Because of this, if the ECS Tasks fail to launch (due to bugs in the code causing the docker container to crash, for example), Terraform won't know anything about that. From Terraform's perspective, the deployment was successful.
> 
> These type of issues can often be tracked down by finding the Stopped ECS Tasks in the ECS Console, and looking at their logs or their container status.

Once the Tasks are running, you should be able to hit the app's URL and get a JSON response. Between `index.js` and `main.tf`, can you find what pieces are necessary to make this data available to the app?

In the AWS Console, see if you can find the other resources from `main.tf`.

### Push a change to your application

Make a small change to `index.ts` (try adding a `console.log`, a simple key/value pair to the JSON response, or a new path). Commit and push this change to the `dev` branch.

```
git commit -am "try deploying a change"
git push
```

In GitHub Actions, watch the deployment steps run (you have a new push, so you'll have to go back and select the new workflow run instance and the job again). Once it gets to the CodeDeploy step, you can watch the deploy happen in the CodeDeploy console in AWS. Once CodeDeploy says that production traffic has been switched over, hit your application in the browser and see if your change worked. If the service is broken, look at the stopped ECS Tasks in the ECS Console to see if you can figure out why.

> Note: 
>
> It's always best to test your changes locally before pushing to GitHub and AWS.
> Testing locally will significantly increase your productivity as you won't be constantly waiting for GitHub Actions and CodeDeploy to deploy, just to discover bugs.
> See the [Run Locally](#how-to-run-locally) section.

## How to Use This

### View the OpenAPI Specification
Now that you can run the app locally you should know how to utilize its OpenAPI Specification generation features.

This template follows a code-first model and so there is no manually-written OpenAPI Specification document.
Instead, it is generated by fastify based on the schemas defined in the route handlers.
You can get a copy of the OpenAPI Spec in two different ways:
- Option 1: Navigate to the `/app` directory of the repo in your terminal and run `npm run generateSpec`.
  This will create a file called `spec.yml` and put it in the `/app/` directory.
- Option 2: Run the app locally and visit <http://localhost:8080/spec> in a browser to access the spec via a GUI.
  - You can also use the `/spec/json` and `/spec/yaml` routes to download a copy of the specification
    in `.json` and `.yml` formats, respectively.


## Arhcitectural Overview

### Learn what was built

By digging through the `.tf` files, you'll see what resources are being created. You should spend some time searching through the AWS Console for each of these resources. The goal is to start making connections between the Terraform syntax and the actual AWS resources that are created.

Several OIT created Terraform modules are used. You can look these modules up in our GitHub Organization. There you can see what resources each of these modules creates. You can look those up in the AWS Console too.

### Deployment details

There are a lot of moving parts in the CI/CD pipeline for this project. This diagram shows the interaction between various services during a deployment.

![CI/CD Sequence Diagram](doc/Fargate%20API%20CI%20CD.png)

## Implement Database
<!-- TODO would this info make more sense to live in the fullstack-developer-handbook? -->
This template does _not_ include code nor terraform configuration for any database.
You will need to include some terraform infrastructure as well as some code dependencies in order to take advantage of a database.

### Setup Relational Database - RDS
See the [RDS Setup instructions in the full stack handbook](https://navue.byu.edu/#/reference/database-rds?id=setup)

### Setup No-SQL Database - DynamoDB
See the [DynamoDB Setup instructions in the full stack handbook](https://navue.byu.edu/#/reference/database-dynamo?id=setup)
