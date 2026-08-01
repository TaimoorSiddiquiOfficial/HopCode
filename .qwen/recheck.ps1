$groups=@{}
$log = 'D:\HopCode\packages\cli\cli-tsc-errors.log'
Get-Content $log | Select-String "error TS2304: Cannot find name '([^']+)'" | ForEach-Object {
  $name = $_.Matches.Groups[1].Value
  if (-not $groups.ContainsKey($name)) { $groups[$name] = 0 }
  $groups[$name]++
}
$groups.GetEnumerator() | Sort-Object Value -Desc | Select-Object -First 20 | ForEach-Object {
  Write-Output ("{0,5} x {1}" -f $_.Value, $_.Name)
}
