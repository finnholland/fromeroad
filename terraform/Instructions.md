Setting up your own environment for Terraform
*All of this will be done in the AWS console*

### IAM
Create a user called `terraform_user` or similar and generate two access keys, use only one as if you accidentally expose it you can rotate it and be sure that it is safe again.

If you plan on using a pipeline to CI/CD your changes you must also create two roles, codepipeline-execution-role and codebuild-role. 
For the codepipeline role , attach the following policy `codepipeline-execution-policy` from the `/terraform/policies` folder
For codebuild ideally let the codepipeline auto generate it, it will attach AWS policies for codebuild, then attach `codebuild-execution-policy` from the folder and AmazonEC2ContainerRegistryReadOnly from AWS

Note
If you get an error such as: 

> "The parameter name can be up to 2048 characters and include the following letters and symbols: a-zA-Z0-9_.-"

when running your terraform apply, it may be caused by a special character in your `terraform_user` access key just rotate it until you get one that is a string with those characters, "/" is also allowed apparently 🤷‍♂️

### Secrets Manager - SM
Here comes the fun part, this is fairly straightforward, anything that is too sensitive to pass in the CLI when running `terraform apply` should go here. 
You can find a good example of the secrets in `/modules/ecs/main.tf` the `aws_ecs_task_definition` includes a secrets section in the definition where the container retrieves secrets from SSM to use as run-time environment variables.

Create a secret, and select "Other type of secret", insert the below secrets in separate rows. Leave the standard encryption, click next and name your secret group.
Then save.

| Secret Name | Value                                 |
|--           | --                                    |
| ACCESS_KEY  | terraform_user key                    |
| SECRET_KEY  | terraform_user secret                 |
| RDS_USER    | admin username                        |
| RDS_PWD     | password                              |
| DOCKER_USER | docker username                       |
| DOCKER_PWD  | password                              |
| JWT_SECRET  | `npm run crypto` in root `fromeroad/` |
| CRYPTO_KEY  | `npm run crypto` in root `fromeroad/` |
| ENV         | dev/prod/test                         |

### Route 53
This part is likely optional, I assume you don't need a domain if you can find a way around it create a PR and update this section.
For me, I wanted to experiment with domains so I bought one, you could also use a subdomain if you own a domain already.
This part is pretty simple you buy a domain (register on Route53) and then create a hosted zone for it. You will also need to generate a certificate using **Certificate Manager**. This Cert will be used to allow HTTPS traffic on your load balancer for your domain.


### Amplify
Create an amplify project and select "Host web app" and connect it to your GitHub repo by choosing GitHub on the next screen. Follow the steps to add your repo remembering to give AWS privileges you can assign to only specific repos if you would like. Also pick the branch you want. Next set the name and adjust the build settings, this is most usually left as default.
After you have created it, it will run an initial deploy. You can edit all the previous settings on the project homepage. 
In order to link the frontend with a domain, you can go to domain management and hit "Add domain", here if you have a domain and zone in Route53 it will automatically detect and can set up the linking for you. If you went with a different registrar you will have to read the [Amplify](https://docs.amplify.aws/) docs sorry I only use AWS as my zone creation.

One step you will have to do is add in environment variables:
| Variable             | Value                                        |
|--                    | --                                           |
| REACT_APP_API_KEY    | https://<apiurl\>.com                        |
| REACT_APP_CRYPTO_KEY | abc123z0y9x8                                 |
| REACT_APP_S3_URL     | https://<bucket\>.s3.<region\>.amazonaws.com |
Make sure the crypto key matches what is in your Secrets Manager.

You can set up a redirect so urls like https://github.com redirect to https://www.github.com (ironically GitHub has the redirects go the other way around :P)

### ECR
Navigate to ECR and hit Create Repository, here simply enter the name of the repo that you want to use.
Make sure to change the code to this name, you can find and replace `fr_ecr_` (and `env`) with your name of choice. The files are `ecs/main.tf` `buildspec.yml` & `terraform_policy`
Leave everything else default and you're done.


### S3
Create a new bucket in the S3 console, leave this one as private as it will be used to store your Terraform state file. Simply run the following command in the Terraform directory.
`terraform init -var="ACCESS_KEY=<terraform_user_key>" -var="SECRET_KEY=<terraform_user_secret>" -backend-config="bucket=<bucketname>" -backend-config="region=ap-southeast-2" -backend-config="key=prod.tfstate"`

Next up is the public buckets for images. 
Create a bucket as above, however this time, make sure to untick "Block all public access".
Inside the permissions tab of the new bucket, add the policy from `terraform/policies/bucket-policy.json` **dont forget to change your bucket name and account ID** 
Finally in order to access the files in the bucket from the front-end you will have to add a CORS rule. I hate CORS so I've put a rule in the policies folder as well you can edit to your use case. 
If you don't have a domain, change it to the amplify default URL.

### RDS
*Services used here will incur a small cost of about 50c a month for key storage*
Here is where it gets a bit finicky.
In order to fully automate RDS you will need a snapshot saved in your RDS console, however these can only be made from a database that is running. This means you will have to manually login to RDS and import the starting data of your choice, then export a snapshot of the database.
To do this:
- Navigate to VPC -> Security Groups
- Edit the rds-sg group inbound rules
- Add a Custom rule with your [Public IP](https://whatismyipaddress.com/) address and Port Range 3306.

Now you will be able to access the RDS database using MySQL Workbench or CLI.
I use Workbench so thats what I will reference.

Create a connection on the opening screen in Workbench.
| Param           | Value            |
|  --             | --               |
| Connection Name | <your_name>      |
| Hostname        | `<rds-endpoint>` |
| Port            | 3306             |
| Username        | `<RDS_USER>`     |
| Password        | `<RDS_PWD>`      |

Test the connection and connect if it works.

 - Open the "Server" dropdown in the menu bar 
 - Select "Data Import"
 - Choose "Import from Self-Contained file"
 - Select the file in `/sql/prod/empty_with_users.sql`

This will create the schema and tables and populate it with some users.
Moving from this you can now create a snapshot in RDS
To do this,

 - Open the RDS console on AWS if not already opened.
 - Head to snapshots
 - Take Snapshot
 - Select your RDS
 - <settings>
 - Name the snapshot
 - Change the name of the snapshot in the `snapshot_identifier` to whatever you named it in RDS

Now when you run `tf apply` in the future it will import data from this snapshot upon creation and you wont have to manually import. 
*This may incur a small cost of about 50c a month for key storage*

