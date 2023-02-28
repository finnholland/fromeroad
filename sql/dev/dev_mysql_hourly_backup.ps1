$filename = (Get-Date -Format FileDateTime) + ".sql"
$dirname = "backups/"

mysqldump --defaults-extra-file=mysqldump_config.cnf --user=root --host=127.0.0.1 --port=10715 --default-character-set=utf8 --protocol=tcp --routines --events fromeroad -r $dirname$filename

# aws s3 cp $dirname+$filename s3://fromeroad-db-backups/dev/$filename

Write-Host "Success!"
Read-Host -Prompt "Press Enter to exit"