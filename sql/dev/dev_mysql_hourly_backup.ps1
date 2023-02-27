$filename = (Get-Date -Format FileDateTime) + ".sql"
$dirname = "backups/"

mysqldump --defaults-extra-file=mysqldump_config.cnf -u root --port=10715 fromeroad > $dirname$filename

# aws s3 cp $dirname+$filename s3://fromeroad-db-backups/dev/$filename

Write-Host "Success!"
Read-Host -Prompt "Press Enter to exit"