# The final project database

This branch is the part of backend that includes
```diff
- api
-  |  undefined.js
- backup ***(database backup folder)***
- config
-  |  [variable.js](https://github.com/Akaru1xR1N/clinic-project-db#variablejs "Jump to file detail")
+ db
+  |  er.dio
- log
-  |  "YYYY-MM-DD".log ***(This file generate per day for 1 week otherwise delete)***
- documentation.md
- server.js
```

## File detail
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