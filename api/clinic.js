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

// Add clinic
router.post("/", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        name: null,
        province: null,
        amphure: null,
        tambon: null,
        zip_code: null,
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
        const result = await con.query("INSERT INTO tb_clinic (name, province, amphure, tambon, zip_code, place, detail, totalMoney, createDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [input.name, input.province, input.amphure, input.tambon, input.zip_code, input.place, input.detail, input.totalMoney, input.createDate])
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
        zip_code: null,
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
        const result = await con.query("UPDATE tb_clinic SET name=?, province=?, amphure=?, tambon=?, zip_code=?, place=?, detail=?, totalMoney=?, createDate=? WHERE clinicID=?;",
        [input.name, input.province, input.amphure, input.tambon, input.zip_code, input.place, input.detail, input.totalMoney, input.createDate, input.clinicID])
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

// bring back from unused to inused
router.post("/bringback", async (req, res) => {
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
        const result = await con.query("CALL sp_changeStateBringBackClinic(?);", [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Bring clinic back complete"})
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

// Add service category
router.post("/service/category", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        categoryName: null
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
        const result = await con.query("INSERT INTO tb_category (categoryName) VALUES (?);", [input.categoryName])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Add service category complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Update service category
router.put("/service/category", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        categoryID: null,
        categoryName: null,
        inUsed: null
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
        const result = await con.query("UPDATE tb_category SET categoryName=?, inUsed=? WHERE categoryID=?;", [input.categoryName, input.inUsed, input.categoryID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Update service category complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Delete service category
router.delete("/service/category", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        categoryID: null
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
        const result = await con.query("CALL sp_changeStateOrDeleteServiceCategory(?);", [input.categoryID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Change state or delete service category complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Bringback service category
router.post("/service/category/bringback", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        categoryID: null
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
        const result = await con.query("CALL sp_changeStateBringBackServiceCategory(?);", [input.categoryID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Bring service category back complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get service category info
router.get("/service/category", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        categoryID: null
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
        const result = await con.query("SELECT * FROM tb_category WHERE categoryID=?;", [input.categoryID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get service category info complete", data: result[0][0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get service category inused
router.get("/service/category/inused", async (req, res) => {
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
        const result = await con.query("SELECT * FROM tb_category WHERE inUsed=1;")
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get service category that is inUsed complete", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get service category unused
router.get("/service/category/unused", async (req, res) => {
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
        const result = await con.query("SELECT * FROM tb_category WHERE inUsed=0;")
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get service category that is unUsed complete", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Add service type
router.post("/service/type", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        categoryID: null,
        clinicID: null,
        typeName: null,
        duration: null,
        price: null
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
        const result = await con.query("INSERT INTO tb_serviceType (categoryID, clinicID, typeName, duration, price) VALUES (?, ?, ?, ?, ?);",
        [input.categoryID, input.clinicID, input.typeName, input.duration, input.price])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Add service type complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Update service type
router.put("/service/type", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        typeID: null,
        categoryID: null,
        clinicID: null,
        typeName: null,
        duration: null,
        price: null
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
        const result = await con.query("UPDATE tb_serviceType SET categoryID=?, clinicID=?, typeName=?, duration=?, price=? WHERE typeID=?;",
        [input.categoryID, input.clinicID, input.typeName, input.duration, input.price, input.typeID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Add service type complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Delete service type
router.delete("/service/type", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        typeID: null
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
        const result = await con.query("CALL sp_changeStateOrDeleteServiceType(?);", [input.typeID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Change state or delete service type complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Bringback service type
router.post("/service/type/bringback", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        typeID: null
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
        const result = await con.query("CALL sp_changeStateBringBackServiceType(?);", [input.typeID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Bring service type back complete"})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get service type info
router.get("/service/type", async (req, res) => {
    console.log(req.originalUrl)
    let input = {
        typeID: null
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
        const result = await con.query("SELECT * FROM tb_serviceType WHERE typeID=?;", [input.typeID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get service type info complete", data: result[0][0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get list service type inused
router.get("/service/type/inused", async (req, res) => {
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
        const result = await con.query("SELECT * FROM tb_serviceType WHERE inUsed=1 AND clinicID=?;", [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get list service type inused complete", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Get list service type unused
router.get("/service/type/unused", async (req, res) => {
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
        const result = await con.query("SELECT * FROM tb_serviceType WHERE inUsed=0 AND clinicID=?;", [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get list service type unused complete", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// view item in storage
router.get("/storage", async (req, res) => {
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
        const result = await con.query("SELECT * FROM tb_storage WHERE clinicID=?;", [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get all item in storage complete.", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// view use item history
router.get("/useItemHistory", async (req, res) => {
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
        const result = await con.query("SELECT doctorID, tb_storage.productID, clinicID, typeID, tb_useItem.amount, time, productName FROM tb_useItem INNER JOIN tb_storage ON tb_useItem.productID=tb_storage.productID WHERE clinicID=?",
        [input.clinicID])
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get use item history complete.", data: result[0]})
    }
    catch (err){
        logger.error(req.originalUrl + " => " + err.message)
        return res.status(400).send({error: true, message: err.message})
    }
    finally{
        con.end()
    }
})

// Show all available items
router.get("/items", async (req, res) => {
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
        const result = await con.query("SELECT * FROM tb_item ;")
        if (!result.length) throw new Error("Something went wrong")

        return res.send({error: false, message: "Get all available items complete.", data: result[0]})
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