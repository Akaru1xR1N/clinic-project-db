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

// Add doctor
router.post("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        clinicID: null,
        adminID: null,
        prefix: null,
        name: null,
        surname: null,
        gender: null,
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
        const result = await con.query("INSERT INTO tb_doctor (clinicID, adminID, prefix, name, surname, gender, nationalID, password, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [input.clinicID, input.adminID, input.prefix, input.name, input.surname, input.gender, input.nationalID, hashPassword, input.email])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Add doctor complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Update doctor
router.put("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        doctorID: null,
        adminID: null,
        clinicID: null,
        adminID: null,
        prefix: null,
        name: null,
        surname: null,
        gender: null,
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
        const result = await con.query("UPDATE tb_doctor SET clinicID=?, adminID=?, prefix=?, name=?, surname=?, gender=?, nationalID=?, email=? WHERE doctorID=?;",
        [input.clinicID, input.adminID, input.prefix, input.name, input.surname, input.gender, input.nationalID, input.email, input.doctorID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Update doctor complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get doctor info
router.get("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        doctorID: null
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
        const result = await con.query("SELECT doctorID,clinicID,adminID,prefix,name,surname,gender,nationalID,email,licensePath,facePath FROM tb_doctor WHERE doctorID=?;",[input.doctorID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get doctor info complete", data: result[0][0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get all doctor in clinic
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
        const result = await con.query("SELECT doctorID,clinicID,adminID,prefix,name,surname,gender,nationalID,email,licensePath,facePath FROM tb_doctor WHERE clinicID=?;",[input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get all doctor in clinic complete", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Delete doctor
router.delete("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        doctorID: null
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
        const result = await con.query("DELETE FROM tb_doctor WHERE doctorID=?;",[input.doctorID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Delete doctor complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// View request time
router.get("/viewRequestTime", async (req, res) => {
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
        const result = await con.query("SELECT * FROM tb_reqTime WHERE clinicID=? AND doctorID IS NULL;", [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get request time complete", data:result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Accept service request time
router.post("/acceptRequestTime", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        doctorID: null,
        clinicID: null,
        customerID: null,
        typeID: null,
        startTime: null
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
        const result = await con.query("UPDATE tb_reqTime SET doctorID=? WHERE clinicID=? AND customerID=? AND typeID=? AND startTime=?;",
        [input.doctorID, input.clinicID, input.customerID, input.typeID, input.startTime])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Accept service request time complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// doctor auth
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
        const result = await con.query("SELECT doctorID, clinicID, name, surname, nationalID, email, prefix, gender, licensePath, facePath FROM tb_doctor WHERE email=? AND password=?;", [input.email, hashPassword])
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

// view history and evaluate
router.get("/viewHistoryAndEvaluate", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        doctorID: null
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
        const result = await con.query("SELECT clinicID,tb_historyEvaluate.doctorID,customerID,typeID,score,comment,time FROM tb_historyEvaluate INNER JOIN tb_doctor ON tb_historyEvaluate.doctorID=tb_doctor.doctorID WHERE tb_historyEvaluate.doctorID=?;",
        [input.doctorID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get history and evaluate complete", data:result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// use item
router.post("/useItem", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        doctorID: null,
        productID: null,
        amount: null
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
        const result = await con.query("INSERT INTO tb_useItem (doctorID, productID, amount) VALUES (?, ?, ?);",
        [input.doctorID, input.productID, input.amount])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Use item complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// treat finish
router.post("/treatFinish", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        doctorID: null
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
        const result = await con.query("CALL sp_treatFinish(?);", [input.doctorID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Treat finish complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// view own approve request
router.get("/viewRequestTimeApprove", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        doctorID: null
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
        const result = await con.query("SELECT * FROM tb_reqTime WHERE doctorID=?;", [input.doctorID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get request time approve complete", data:result[0]})
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