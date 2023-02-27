write-host (aws route53 list-resource-record-sets --hosted-zone-id Z046401415VTMVLASRJFO --query 'ResourceRecordSets[?Name==`api.fromeroad.com.`&&Type == `A`].ResourceRecords[].Value | [0]' --output text)

New-Variable -Scope Script -Name old_ip -Value (aws route53 list-resource-record-sets --hosted-zone-id Z046401415VTMVLASRJFO --query 'ResourceRecordSets[?Name==`api.fromeroad.com.`&&Type == `A`].ResourceRecords[].Value | [0]' --output text)
write-host old_ip = $old_ip

New-Variable -Scope Script -Name new_ip -Value (Invoke-WebRequest -UseBasicParsing -URI ifconfig.me).Content
write-host $new_ip

$filePath = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$filePath += '\FR_fromeroad_update_route53_ip.json'

if ($old_ip -ne $new_ip) {
    write-host "not equal!"
    $fileContent = Get-Content $filePath
    $fileContent[11] = '                        "Value": "'+$new_ip+'"'
    $fileContent | Set-Content $filePath

    (aws route53 change-resource-record-sets --hosted-zone-id Z046401415VTMVLASRJFO --change-batch file://./FR_fromeroad_update_route53_ip.json)
} else {
    write-host "equal!"
}

