const express = require("express")
const router = express.Router()
const {hostDB, portDB, userDB, passwordDB, database, saltDB} = require("../config/variable")
const mysql = require("mysql2/promise")
const {createLogger, format, transports} = require("winston")
require("winston-daily-rotate-file")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const moment = require("moment")

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
        database: database
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

// Add clinic
router.post("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        name: null,
        province: null,
        amphure: null,
        tambon: null,
        place: null,
        detail: null,
        totalMoney: null,
        createDate: null
    }
    //validation
    var valueCanNull = ["detail", "totalMoney", "createDate"]
    for (const [key, value] of Object.entries(input)) {
        if (req.body[key] === undefined) {
            if (valueCanNull.includes(key)) {
                continue
            }
            return res.status(400).send({ error: true, message: `Please provide data according to format for KEY = ${key}.` })
        }
        input[key] = req.body[key]
    }
    if (input.totalMoney === null) input.totalMoney = 0
    if (input.createDate === null) input.createDate = moment().format("YYYY-MM-DD HH:mm:ss")

    const con = await connection()
    try{
        const result = await con.query("INSERT INTO tb_clinic (name, province, amphure, tambon, place, detail, totalMoney, createDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        [input.name, input.province, input.amphure, input.tambon, input.place, input.detail, input.totalMoney, input.createDate])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Add clinic complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Update clinic info
router.put("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null,
        name: null,
        province: null,
        amphure: null,
        tambon: null,
        place: null,
        detail: null,
        totalMoney: null,
        createDate: null
    }
    //validation
    var valueCanNull = ["detail", "totalMoney", "createDate"]
    for (const [key, value] of Object.entries(input)) {
        if (req.body[key] === undefined) {
            if (valueCanNull.includes(key)) {
                continue
            }
            return res.status(400).send({ error: true, message: `Please provide data according to format for KEY = ${key}.` })
        }
        input[key] = req.body[key]
    }
    if (input.totalMoney === null) input.totalMoney = 0
    if (input.createDate === null) input.createDate = moment().format("YYYY-MM-DD HH:mm:ss")

    const con = await connection()
    try{
        const result = await con.query("UPDATE tb_clinic SET name=?, province=?, amphure=?, tambon=?, place=?, detail=?, totalMoney=?, createDate=? WHERE clinicID=?;",
        [input.name, input.province, input.amphure, input.tambon, input.place, input.detail, input.totalMoney, input.createDate, input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Update clinic info complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// delete clinic if in unused state otherwise change to unused state
router.delete("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null
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

    const con = await connection()
    try{
        const result = await con.query("CALL sp_changeStateOrDeleteClinic(?);", [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Change state to unused or delete clinic complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// get clinic info
router.get("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null
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
        const result = await con.query("SELECT * FROM tb_clinic WHERE clinicID=?;", [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get clinic info complete", data:result[0][0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// get all clinic info that is in inused state
router.get("/inused", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
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
        const result = await con.query("SELECT * FROM tb_clinic WHERE inused=1;")
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get all clinic info that is in inused state complete", data:result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// get all clinic info that is in unused state
router.get("/unused", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
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
        const result = await con.query("SELECT * FROM tb_clinic WHERE inused=0;")
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get all clinic info that is in unused state complete", data:result[0]})
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