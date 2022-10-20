# 选手说明

还没写

# 环境安装说明

## 安装并配置mongoDB

1. 下载并安装

2. service mongod start 起服务，然后mongosh进shell，依次执行
   `use admin`

   ```
   db.createUser(
   {
   user: "bridge",
   pwd: "IHateDriving",
   roles: [ { role: "userAdminAnyDatabase", db: "admin" },
   { role: "readWriteAnyDatabase", db: "admin" } ]
   }
   )
   ```

   创建admin账号

3. 打开/etc/mongod.conf 添加这一句

   ```
    security:
        authorization: "enabled"
   ```

    并修改net让所有ipv4允许访问

   ```
    net:
      port: 27017
      bindIp: 0.0.0.0 # Enter 0.0.0.0,:: to bind to all IPv4 and IPv6 addresses or, alternatively, use the net.bindIpAll setting.
   ```

4. service mongod restart

5. 连shell mongosh mongodb://bridge:IHateDriving@127.0.0.1:27017
   添加flag用户
   db.users.insertOne({username:'TSCTF-J{xxxx}',password:'xxxx',userId:'xxxx'})

## 启动node container

cd进入附件文件夹

build image

docker build --tag qbox_img .

run container

docker run --interactive -detach -P qbox_img

docker ps看端口

然后我发现我的chrome忘记装了:>

连docker shell

docker exec -it 2d51af8e7212 /bin/bash

先换个apt源

https://learnku.com/articles/26066

然后按照

https://geekflare.com/install-chromium-ubuntu-centos/

的方法安装chrome