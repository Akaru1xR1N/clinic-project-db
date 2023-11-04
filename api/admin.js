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

// Add admin
router.post("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null,
        name: null,
        surname: null,
        nationalID: null,
        password: null,
        email: null
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
    let hashPassword = crypto.pbkdf2Sync(input.password, saltDB, 1000, 64, "sha512").toString("hex")

    const con = await connection()
    try{
        const result = await con.query("INSERT INTO tb_admin (clinicID, name, surname, nationalID, password, email) VALUES (?, ?, ?, ?, ?, ?);",
        [input.clinicID, input.name, input.surname, input.nationalID, hashPassword, input.email])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Add admin complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Update admin info
router.put("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null,
        adminID: null,
        name: null,
        surname: null,
        nationalID: null,
        email: null
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
        const result = await con.query("UPDATE tb_admin SET clinicID=?, name=?, surname=?, nationalID=?, email=? WHERE adminID=?;",
        [input.clinicID, input.name, input.surname, input.nationalID, input.email, input.adminID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Update admin info complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Delete admin
router.delete("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        adminID: null
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
        const result = await con.query("DELETE FROM tb_admin WHERE adminID=?;", [input.adminID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Update admin info complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get admin info
router.get("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        adminID: null
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
        const result = await con.query("SELECT clinicID,adminID,name,surname,nationalID,email FROM tb_admin WHERE adminID=?;", [input.adminID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get admin info complete", data:result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get admin info
router.get("/list", async (req, res) => {
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
        const result = await con.query("SELECT clinicID,adminID,name,surname,nationalID,email FROM tb_admin WHERE clinicID=?;", [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get all admin in clinic complete", data:result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// admin auth
router.post("/auth", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        email: null,
        password: null
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
    let hashPassword = crypto.pbkdf2Sync(input.password, saltDB, 1000, 64, "sha512").toString("hex")

    const con = await connection()
    try{
        const result = await con.query("SELECT adminID, name, surname, nationalID, email FROM tb_admin WHERE email=? AND password=?", [input.email, hashPassword])
        if (!result.length) throw new Error("Something went wrong")
        if (!result[0][0]) throw new Error("Username or password invalid.")

        return res.send({error: false, message: "Auth complete.", data: result[0][0]})
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