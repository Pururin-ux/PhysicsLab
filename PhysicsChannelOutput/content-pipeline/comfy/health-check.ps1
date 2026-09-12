param(
  [string]$BaseUrl = "http://127.0.0.1:8001",
  [int]$TimeoutSec = 5,
  [switch]$Json
)

$ErrorActionPreference = "Stop"

function Invoke-ComfyGet {
  param([string]$Path)
  $uri = "$BaseUrl$Path"
  Invoke-RestMethod -Uri $uri -TimeoutSec $TimeoutSec
}

$result = [ordered]@{
  base_url = $BaseUrl
  checked_at = (Get-Date).ToString("o")
  reachable = $false
  system_stats = $null
  queue = $null
  object_info_available = $false
  errors = @()
}

try {
  $result.system_stats = Invoke-ComfyGet -Path "/system_stats"
  $result.reachable = $true
} catch {
  $result.errors += "system_stats: $($_.Exception.Message)"
}

if ($result.reachable) {
  try {
    $result.queue = Invoke-ComfyGet -Path "/queue"
  } catch {
    $result.errors += "queue: $($_.Exception.Message)"
  }

  try {
    $objectInfo = Invoke-ComfyGet -Path "/object_info"
    $result.object_info_available = ($null -ne $objectInfo)
  } catch {
    $result.errors += "object_info: $($_.Exception.Message)"
  }
}

if ($Json) {
  $result | ConvertTo-Json -Depth 8
} else {
  [pscustomobject]$result
}

if (-not $result.reachable) {
  exit 2
}
