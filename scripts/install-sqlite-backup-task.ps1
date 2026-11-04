param(
  [string]$Time = '02:00',
  [string]$DatabasePath = $env:DATABASE_PATH,
  [string]$BackupDirectory
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$taskName = 'Nexora SQLite Backup'

if ($DatabasePath -eq ':memory:') {
  throw 'DATABASE_PATH cannot be :memory: for scheduled backups.'
}
if ([string]::IsNullOrWhiteSpace($DatabasePath)) {
  $DatabasePath = Join-Path $projectRoot 'nexora.sqlite'
} elseif (-not [System.IO.Path]::IsPathRooted($DatabasePath)) {
  $DatabasePath = Join-Path $projectRoot $DatabasePath
}
$DatabasePath = [System.IO.Path]::GetFullPath($DatabasePath)

if ([string]::IsNullOrWhiteSpace($BackupDirectory)) {
  $BackupDirectory = Join-Path $env:LOCALAPPDATA 'Nexora\database-backups'
}
$BackupDirectory = [System.IO.Path]::GetFullPath($BackupDirectory)

$scheduledTime = [TimeSpan]::Zero
if (-not [TimeSpan]::TryParseExact($Time, 'hh\:mm', [Globalization.CultureInfo]::InvariantCulture, [ref]$scheduledTime)) {
  throw "Invalid schedule time '$Time'. Use 24-hour HH:mm format, for example 02:00."
}

$nodeCommand = Get-Command node.exe -ErrorAction Stop
$nodePath = $nodeCommand.Source
$backupScript = Join-Path $PSScriptRoot 'backup-sqlite.js'
$arguments = '"{0}" --database "{1}" --backup-dir "{2}"' -f $backupScript, $DatabasePath, $BackupDirectory
$action = New-ScheduledTaskAction -Execute $nodePath -Argument $arguments -WorkingDirectory $projectRoot
$trigger = New-ScheduledTaskTrigger -Daily -At ((Get-Date).Date.Add($scheduledTime))
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 1) -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force -Description 'Creates and verifies a daily local SQLite backup for Nexora.' | Out-Null
Write-Output "Scheduled '$taskName' daily at $Time for the current Windows user."
Write-Output "Database: $DatabasePath"
Write-Output "Backups: $BackupDirectory (keeps the 30 newest verified backups)"
