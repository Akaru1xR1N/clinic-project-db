# The final project database

This branch is the part of backend that includes
> api
>> [ ] undefined
> backup **(database backup folder)**
> config
 >> variable.js <br>
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
> [x] db
 >> + [x] er.dio
> log
 >> "YYYY-MM-DD".log ***(This file generate per day for 1 week otherwise delete)***
> documentation.md
> server.js