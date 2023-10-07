# The final project database
![finally](https://github.com/Akaru1xR1N/README.img/blob/master/project%20db%20init.png "finally")

This branch is the part of backend that includes

**root**<br>
&nbsp;&nbsp;|<br>
&nbsp;&nbsp;|--**api**<br>
&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|---*undefined.js*<br>
&nbsp;&nbsp;|--**backup** ***(database backup folder)***<br>
&nbsp;&nbsp;|--**config**<br>
&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|---[*variable.js*](https://github.com/Akaru1xR1N/clinic-project-db#variablejs "Jump to file detail")<br>
&nbsp;&nbsp;|--**db**<br>
&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|---*er.dio*<br>
&nbsp;&nbsp;|--**log**<br>
&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|---*"YYYY-MM-DD".log* ***(This file generate per day for 1 week otherwise delete)***<br>
&nbsp;&nbsp;|--*documentation.md*<br>
&nbsp;&nbsp;|--*server.js*<br>


## Setup
![setup](https://github.com/Akaru1xR1N/README.img/blob/master/setup.png "setup")
```sh
pnpm init
pnpm install crypto express mysql2 mysqldump
```

## Setup detail
![setup detail](https://github.com/Akaru1xR1N/README.img/blob/master/setupdetail.png "setup detail")
* `crypto` - encrypt data (for encrypt password)
* `express` - web app framework
* `mysql2` - connect to mysql server
* `mysqldump` - dump database to a file

## API detail
![api detail](https://github.com/Akaru1xR1N/README.img/blob/master/apidetail.png "api detail")
```diff
+ IP
ip: localhost or https://www.pn-nurse.nu.ac.th/api/projectdb2023/

+ PORT
port: 3010 or https://www.pn-nurse.nu.ac.th/api/projectdb2023/

! For more information about API go to root path
```

## File detail
![file detail](https://github.com/Akaru1xR1N/README.img/blob/master/filedetail.png "file detail")
##### `variable.js`
```js
 module.exports={
    hostDB: "localhost",
    portDB: 3306,
    userDB: "user",
    passwordDB: "password your db",
    database: "your database name",
    saltDB: "keep all of this info secret"
 }
 ```