$log = 'D:\HopCode\packages\cli\cli-tsc-errors.log'
$groups = @{}
Get-Content $log | ForEach-Object {
  if ($_ -match "error TS2304: Cannot find name '([^']+)'") {
    $name = $matches[1]
    if (-not $groups[$name]) { $groups[$name] = 0 }
    $groups[$name]++
  }
}
$groups.GetEnumerator() | Sort-Object Value -Desc | Select-Object -First 30 | ForEach-Object {
  Write-Output ("{0,5} x {1}" -f $_.Value, $_.Name)
}
