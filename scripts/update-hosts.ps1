# Requires -RunAsAdministrator
Add-Content $env:SYSTEMROOT\System32\drives\etc\hosts "# Added for employee-management-app-backend`n127.0.0.1 mongodb-primary`n127.0.0.1 mongodb-replica`n# End of section"
