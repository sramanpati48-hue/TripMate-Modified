param(
    [switch]$Kill
)

Set-StrictMode -Version Latest

Write-Host "Checking for process listening on port 3000..."

$matches = netstat -ano | Select-String ":3000"
if ($matches) {
    Write-Host "Port 3000 is in use. Details:"
    $matches | ForEach-Object {
        $line = $_.ToString().Trim()
        Write-Host $line
        # extract PID (last column)
        $cols = -split $line
        $pid = $cols[-1]
        try {
            $proc = Get-Process -Id $pid -ErrorAction Stop
            Write-Host "PID $pid => $($proc.ProcessName) (Path: $($proc.Path))"
        } catch {
            Write-Host "PID $pid => process not found or access denied"
        }
        if ($Kill) {
            Write-Host "Killing PID $pid"
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    if (-not $Kill) {
        Write-Host "If you want to free the port, re-run with -Kill to terminate the process."
        exit 0
    }
}
else {
    Write-Host "No process is listening on port 3000."
}

Write-Host "Running preview helper (install/generate/dev)..."
& pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\preview-dev.ps1
