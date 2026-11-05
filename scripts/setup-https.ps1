$ErrorActionPreference = "Stop"

$certificateDirectory = Join-Path $env:LOCALAPPDATA "ASP.NET\https"
$certificatePath = Join-Path $certificateDirectory "react-vite-tailwindcss.pem"

New-Item -ItemType Directory -Force -Path $certificateDirectory | Out-Null

dotnet dev-certs https --trust
if ($LASTEXITCODE -ne 0) {
    throw "No se pudo crear o confiar el certificado de desarrollo de .NET."
}

dotnet dev-certs https --export-path $certificatePath --format PEM --no-password
if ($LASTEXITCODE -ne 0) {
    throw "No se pudo exportar el certificado HTTPS para Vite."
}

$keyPath = Join-Path $certificateDirectory "react-vite-tailwindcss.key"
if (-not (Test-Path $certificatePath) -or -not (Test-Path $keyPath)) {
    throw "La exportación no generó los archivos PEM y KEY esperados."
}

Write-Host "Certificado HTTPS preparado para https://localhost:5173"
Write-Host "Certificado: $certificatePath"
Write-Host "Clave privada local creada fuera del repositorio."
