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

// get all provinces
router.get("/", async (req, res) => {
    console.log(req.originalUrl)
    
    let input = {

    }
    //validation
    var valueCanNull = []
    for (const [key, value] of Object.entries(input)) {
        if (req.body[key] === undefined) {
            if (valueCanNull.includes(key)) {
                continue
            }
            return res.status(400).send({ error: true, message: `Please provide data according to format for KEY = ${key}.` })
        }
        input[key] = req.body[key]
    }

    const con = await connection();
    try{
        const result = await con.query("SELECT id AS province_id, name_th FROM thai_provinces;")
        if (!result.length) throw new Error("Something went wrong")

        return res.send({ error: false, message: "get all provinces complete", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// get all amphures from province id
router.get("/amphures", async (req, res) => {
    console.log(req.originalUrl)
    
    let input = {
        province_id: null
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

    const con = await connection();
    try{
        const result = await con.query("SELECT id AS amphure_id, name_th FROM thai_amphures WHERE province_id=?;", [input.province_id])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({ error: false, message: "get all amphures from province complete", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// get all tambons from amphure id
router.get("/tambons", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        amphure_id: null
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

    const con = await connection();
    try{
        const result = await con.query("SELECT id AS tambon_id, name_th, zip_code FROM thai_tambons WHERE amphure_id=?;", [input.amphure_id])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({ error: false, message: "get all tambons from amphure complete", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

module.exports = router;