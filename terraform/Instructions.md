Setting up your own environment for Terraform

*All of this will be done in the AWS console*

### IAM
Create a user called `terraform_user` or similar
### Route 53
This part is likely optional, I assume you don't need a domain if you can find a way around it create a PR and update this section.
For me, I wanted to experiment with domains so I bought one, you could also use a subdomain if you own a domain already.
### Amplify
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
- Navigate to VPC -> Security Groups
- Edit the rds-sg group inbound rules
- Add a Custom rule with your [Public IP](https://whatismyipaddress.com/) address and Port Range 3306.

Now you will be able to access the RDS database using MySQL Workbench or CLI.
I use Workbench so thats what I will reference.

Create a connection on the opening screen in Workbench.
|  Param          |  Value            |
|  --             |  --               |
| Connection Name | <your_name>       |
|  Hostname       | `<rds-endpoint>`  |
| Port            | 3306              |
| Username        | `<RDS_USER>`      |
| Password        | `<RDS_PWD>`       |

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