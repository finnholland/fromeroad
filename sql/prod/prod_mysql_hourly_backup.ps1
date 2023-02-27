$filename = (Get-Date -Format FileDateTime) + ".sql"
$dirname = "backups/"

mysqldump --defaults-extra-file=mysqldump_config.cnf -u root --port=10714 fromeroad > $dirname$filename

# aws s3 cp $dirname+$filename s3://fromeroad-db-backups/prod/$filename