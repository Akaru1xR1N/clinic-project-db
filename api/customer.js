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

// Add customer
router.post("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        name: null,
        surname: null,
        gender: null,
        nationalID: null,
        password: null,
        phone: null,
        blood: null,
        email: null,
        drugAllergy: null,
        disease: null
    }
    //validation
    var valueCanNull = ["email", "drugAllergy", "disease"]
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
        const result = await con.query("INSERT INTO tb_customer (name, surname, gender, nationalID, password, phone, blood, email, drugAllergy, disease) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [input.name, input.surname, input.gender, input.nationalID, hashPassword, input.phone, input.blood, input.email, input.drugAllergy, input.disease])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Add customer complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// update customer info
router.put("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        customerID: null,
        name: null,
        surname: null,
        gender: null,
        nationalID: null,
        phone: null,
        blood: null,
        email: null,
        drugAllergy: null,
        disease: null
    }
    //validation
    var valueCanNull = ["email", "drugAllergy", "disease"]
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
        const result = await con.query("UPDATE tb_customer SET name=?, surname=?, gender=?, nationalID=?, phone=?, blood=?, email=?, drugAllergy=?, disease=? WHERE customerID=?;",
        [input.name, input.surname, input.gender, input.nationalID, input.phone, input.blood, input.email, input.drugAllergy, input.disease, input.customerID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Update customer info complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// get customer info
router.get("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        customerID: null
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
        const result = await con.query("SELECT customerID,name,surname,gender,nationalID,phone,blood,email,drugAllergy,disease FROM tb_customer WHERE customerID=?;",
        [input.customerID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get customer info complete", data:result[0][0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// get all customer info
router.get("/list", async (req, res) => {
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
        const result = await con.query("SELECT customerID,name,surname,gender,nationalID,phone,blood,email,drugAllergy,disease FROM tb_customer;")
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get all customer info complete", data:result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Add customer request time
router.post("/serviceRequest", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
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
        const result = await con.query("INSERT INTO tb_reqTime(clinicID, customerID, typeID, startTime) VALUES(?, ?, ?, ?);",
        [input.clinicID, input.customerID, input.typeID, input.startTime])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Add customer request time complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Delete customer request time
router.delete("/serviceRequest", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
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
        const result = await con.query("DELETE FROM tb_reqTime WHERE clinicID=? AND customerID=? AND typeID=? AND startTime=?;",
        [input.clinicID, input.customerID, input.typeID, input.startTime])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Delete customer request time complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// customer auth
router.post("/auth", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        nationalID: null,
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
        const result = await con.query("SELECT customerID, name, surname, nationalID, email, gender, phone, drugAllergy, disease, blood FROM tb_customer WHERE nationalID=? AND password=?;", [input.nationalID, hashPassword])
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

// view own customer request
router.get("/viewRequestTime", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        customerID: null
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
        const result = await con.query("SELECT * FROM tb_reqTime WHERE doctorID IS NULL AND customerID=?;", [input.customerID])
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

// view own customer request approve
router.get("/viewRequestTimeApprove", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        customerID: null
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
        const result = await con.query("SELECT * FROM tb_reqTime WHERE doctorID IS NOT NULL AND customerID=?;", [input.customerID])
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

// view history and evaluate
router.get("/viewHistoryAndEvaluate", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        customerID: null
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
        const result = await con.query("SELECT * FROM tb_historyEvaluate WHERE customerID=?;", [input.customerID])
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

module.exports = router