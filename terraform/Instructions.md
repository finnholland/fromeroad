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

### Route 53
This part is likely optional, I assume you don't need a domain if you can find a way around it create a PR and update this section.
For me, I wanted to experiment with domains so I bought one, you could also use a subdomain if you own a domain already.
This part is pretty simple you buy a domain (register on Route53) and then create a hosted zone for it. You will also need to generate a certificate using **Certificate Manager**. This Cert will be used to allow HTTPS traffic on your load balancer for your domain.


### Amplify
Create an amplify project and connect it 
edit the build settings

### ECR
Navigate to ECR and hit Create Repository, here simply enter the name of the repo that you want to use.
Make sure to change the code to this name, you can find and replace `fr_ecr_` (and `env`) with your name of choice. The files are `ecs/main.tf` `buildspec.yml` & `terraform_policy`
Leave everything else default and you're done.


### S3



### RDS
*Services used here will incur a small cost of about 50c a month for key storage*
Here is where it gets a bit finicky.
In order to fully automate RDS you will need a snapshot saved in your RDS console, however these can only be made from a database that is running. This means you will have to manually login to RDS and import the starting data of your choice, then export a snapshot of the database.
To do this:
- Comment out the `snapshot_identifier` value in /rds/main.tf
- Run `terraform apply` to start the project
- Navigate to VPC -> Security Groups
- Edit the rds-sg group inbound rules
- Add a Custom rule with your [Public IP](https://whatismyipaddress.com/) address and Port Range 3306.

Now you will be able to access the RDS database using MySQL Workbench or CLI.
I use Workbench so thats what I will reference.

Create a connection on the opening screen in Workbench.
| Param | Value |
|  --    | -- |
| Connection Name | <your_name> |
| Hostname | `<rds-endpoint>` |
| Port | 3306 |
| Username | `<RDS_USER>` |
| Password | `<RDS_PWD>` |

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
 - Select your RDS database
 - Name the snapshot
 - Change the name of the snapshot in the `snapshot_identifier` to whatever you named it in RDS

Now when you run `tf apply` in the future it will import data from this snapshot upon creation and you wont have to manually import. 
*This may incur a small cost of about 50c a month for key storage*