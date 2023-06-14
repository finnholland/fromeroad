$fileContent = Get-Content route53_update_ip.json
New-Variable -Scope Script -Name old_ip -Value $fileContent[11].Trim()
$old_ip = $old_ip.Split(':').Trim()

$old_ip = $old_ip[1] -replace "`"|'"
$old_ip = $old_ip.Trim()
write-host $old_ip

New-Variable -Scope Script -Name new_ip -Value (Invoke-WebRequest -UseBasicParsing -URI ifconfig.me).Content
write-host $new_ip

if ($old_ip -ne $new_ip) {
    write-host "not equal!"
    $fileContent[11] = '                        "Value": "'+$new_ip+'"'
    $fileContent | Set-Content aws_fromeroad_ip_update.json

    aws route53 change-resource-record-sets --hosted-zone-id Z046401415VTMVLASRJFO --change-batch file://./aws_fromeroad_ip_update.json --profile chamonix
} else {
    write-host "equal!"
}

