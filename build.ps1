# COMMON PATHS

$buildFolder = (Get-Item -Path "./" -Verbose).FullName
 
# Mvc
Set-Location $buildFolder
lessc assets/css/theme.blue.less static/css/theme.blue.css
lessc assets/css/theme.blue-lighter.less static/css/theme.blue-lighter.css
lessc assets/css/theme.green-dark.less static/css/theme.green-dark.css
lessc assets/css/theme.green.less static/css/theme.green.css
lessc assets/css/theme.orange.less static/css/theme.orange.css
lessc assets/css/theme.purple.less static/css/theme.purple.css
lessc assets/css/theme.red.less static/css/theme.red.css

docker build -t docker.ednet.cn/template-a .
 
# 更新docker
Set-Location ~
docker-compose up --build --no-deps -d template-a
docker-compose up --build --no-deps -d tjyzhy

docker rmi $(docker images -f "dangling=true" -q)
## FINALIZE ###################################################################

Set-Location $buildFolder