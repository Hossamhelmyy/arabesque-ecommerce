$features = @(
    "categories",
    "favorites",
    "profile",
    "checkout",
    "product-detail"
)

foreach ($feature in $features) {
    New-Item -Path "src\features\$feature\components" -ItemType Directory -Force
    New-Item -Path "src\features\$feature\hooks" -ItemType Directory -Force
    New-Item -Path "src\features\$feature\types" -ItemType Directory -Force
}

Write-Host "All directories created successfully!" -ForegroundColor Green