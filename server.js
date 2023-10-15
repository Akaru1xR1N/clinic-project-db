const express = require("express")
const app = express()
const bp = require("body-parser")
const cors = require("cors")
const {createLogger, format, transports} = require("winston")
require("winston-daily-rotate-file")
const {hostDB, portDB, userDB, passwordDB, database, saltDB} = require("./config/variable")
const mysqldump = require("mysqldump")
const cron = require("node-cron")
const moment = require("moment")
const fs = require("fs")
const path = require("path")
const ip = require("ip")
const PORT = 3010

const customer = require("./api/customer")

if (!fs.existsSync("log")){
    fs.mkdirSync("log")
}
if (!fs.existsSync("backup")){
    fs.mkdirSync("backup")
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: "log/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxFiles: "14d"
})

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.label({
            label: path.basename(process.mainModule.filename)
        }),
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console({
        level: "info",
        format: format.combine(
            format.label({
                label: path.basename(process.mainModule.filename)
            }),
            format.colorize(),
            format.printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)
        )
    }),
        dailyRotateFileTransport
    ]
})

app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({extends: true}))

app.use("/customer", customer)

app.get("/", async (req, res) => {
    return res.send({
        error: false,
        message: "Welcome to RESTful API with NodeJS for clinic (Final project database 2023)",
        written_by: "Thanadej Phrompornchai"
    })
})

cron.schedule("59 23 * * *", () => {
    logger.info(" [schedule   ] IT IS TIME TO BACKUP!")
    let currentTime = moment.now()
    let delFile = []
    try{
        var files = fs.readdirSync("./backup")
    }
    catch{
        logger.error(" [schedule   ] FOLDER BACKUP NOT FOUND!")
    }
    try{
        for (let file of files){
            var time = file.split(".sql")[0].split(";")[1].replaceAll(".", ":")
            if (currentTime-new Date(moment(time)).getTime() >= 604800000){
                delFile.push(file)
            }
        }
    }
    catch{
        logger.error(" [schedule   ] SOMETHING WENT WRONG WHILE HANDLING WITH BACKUP FILE!")
    }
    try{
        for (let file of delFile){
            fs.rmSync(`./backup/${file}`)
            logger.info(` [schedule   ] DELETE FILE ${file} COMPLETE`)
        }
    }
    catch{
        logger.error(" [schedule   ] CAN'T DELETE BACKUP FILE")
    }

    try{
        let filename = `${database};${moment().format("YYYY-MM-DD HH.mm.ss")}`
        mysqldump({
            connection: {
                host: hostDB,
                port: portDB,
                user: userDB,
                password: passwordDB,
                database: database
            },
            dumpToFile: `./backup/${filename}.sql`
        })
    }
    catch{
        logger.error(" [schedule   ] SOMETHING WENT WRONG WHILE BACKUP DATABASE")
    }
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API is running on ${ip.address()}:${PORT}`)
})
module.exports = app