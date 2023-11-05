const express = require("express")
const router = express.Router()
const {hostDB, portDB, userDB, passwordDB, database, saltDB} = require("../config/variable")
const mysql = require("mysql2/promise")
const {createLogger, format, transports} = require("winston")
require("winston-daily-rotate-file")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

if (!fs.existsSync("log")){
    fs.mkdirSync("log")
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

async function connection(){
    const con = await mysql.createConnection({
        host: hostDB,
        port: portDB,
        user: userDB,
        password: passwordDB,
        database: database,
        timezone: "+00:00"
    })
    con.connect((err)=>{
        if (err){
            logger.error(err.message)
            return err
        } 
        logger.info("Connected to Mysql server.")
    })
    return con
}

// view statement
router.get("/statement", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null,
        year: null,
        month: null
    }
    //validation
    var valueCanNull = []
    for (const [key, value] of Object.entries(input)) {
        if (req.query[key] === undefined) {
            if (valueCanNull.includes(key)) {
                continue
            }
            return res.status(400).send({ error: true, message: `Please provide data according to format for KEY = ${key}.` })
        }
        input[key] = req.query[key]
    }

    const con = await connection()
    try{
        const result = await con.query("SELECT * FROM tb_bank WHERE clinicID=? AND YEAR(time)=? AND MONTH(time)=? ORDER BY time ASC;", [input.clinicID, input.year, input.month])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get clinic statement per month complete", data:result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get total statement
router.get("/totalStatement", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null,
        year: null,
        month: null
    }
    //validation
    var valueCanNull = []
    for (const [key, value] of Object.entries(input)) {
        if (req.query[key] === undefined) {
            if (valueCanNull.includes(key)) {
                continue
            }
            return res.status(400).send({ error: true, message: `Please provide data according to format for KEY = ${key}.` })
        }
        input[key] = req.query[key]
    }

    const con = await connection()
    try{
        const result = await con.query("SELECT (SELECT SUM(value) FROM tb_bank WHERE type=0 AND clinicID=? AND YEAR(time)=? AND MONTH(time)=? GROUP BY MONTH(time)) AS expense, (SELECT SUM(value) FROM tb_bank WHERE type=1 AND clinicID=? AND YEAR(time)=? AND MONTH(time)=? GROUP BY MONTH(time)) AS income;",
        [input.clinicID, input.year, input.month, input.clinicID, input.year, input.month])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get total clinic statement per month complete", data:result[0][0].income - result[0][0].expense})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get total case per month per clinic
router.get("/totalCase", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null,
        year: null
    }
    //validation
    var valueCanNull = []
    for (const [key, value] of Object.entries(input)) {
        if (req.query[key] === undefined) {
            if (valueCanNull.includes(key)) {
                continue
            }
            return res.status(400).send({ error: true, message: `Please provide data according to format for KEY = ${key}.` })
        }
        input[key] = req.query[key]
    }

    const con = await connection()
    try{
        const result = await con.query("SELECT COUNT(*) AS Ccase, MONTH(time) AS month FROM tb_historyEvaluate INNER JOIN tb_doctor ON tb_historyEvaluate.doctorID=tb_doctor.doctorID WHERE clinicID=? AND YEAR(time)=? GROUP BY MONTH(time) ORDER BY MONTH(time);",
        [input.clinicID, input.year])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get total clinic statement per month complete", data:result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

module.exports = router