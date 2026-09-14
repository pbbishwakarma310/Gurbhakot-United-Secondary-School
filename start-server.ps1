# Simple Local Web Server for Gurbhakot United Secondary School Website
# Runs on pure Windows PowerShell without requiring Python or Node.js

$port = 8080
$url = "http://localhost:$port/"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Gurbhakot United Secondary School - Local Web Server   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Starting server at $url ..." -ForegroundColor Green
Write-Host "Press Ctrl+C in this window to stop the server.`n" -ForegroundColor Gray

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
} catch {
    Write-Host "Error starting listener: $_" -ForegroundColor Red
    Write-Host "Port $port might be in use. You can change the port in this script."
    exit
}

# Open default browser automatically
Start-Process $url

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".pdf"  = "application/pdf"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = [System.Web.HttpUtility]::UrlDecode($request.Url.LocalPath)
        if ($rawPath -eq "/" -or $rawPath -eq "") {
            $rawPath = "/index.html"
        }

        $localPath = Join-Path (Get-Location) ($rawPath.TrimStart('/').Replace('/', '\'))

        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()

            if ($mimeMap.ContainsKey($ext)) {
                $response.ContentType = $mimeMap[$ext]
            } else {
                $response.ContentType = "application/octet-stream"
            }

            # Enable CORS for local testing
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $rawPath")
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Catch and continue on client abort
    }
}
