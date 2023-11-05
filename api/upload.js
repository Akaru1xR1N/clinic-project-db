const express = require("express")
const router = express.Router()
const {hostDB, portDB, userDB, passwordDB, database, saltDB} = require("../config/variable")
const mysql = require("mysql2/promise")
const {createLogger, format, transports} = require("winston")
require("winston-daily-rotate-file")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const multer = require("multer")
const moment = require("moment")

if (!fs.existsSync("log")){
    fs.mkdirSync("log")
}
if (!fs.existsSync("img")){
    fs.mkdirSync("img")
    fs.mkdirSync("./img/face")
    fs.mkdirSync("./img/license")
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

const storageForFace = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./img/face")
    },
    filename: (req, file, cb)=>{
        const filename = `${moment.now()}`+"."+file.originalname.split(".").pop()
        if (!["image/jpeg", "image/png"].includes(file.mimetype)) cb("Error file type", filename)
        else cb(null, filename)
    }
})

const storageForLicense = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./img/license")
    },
    filename: (req, file, cb)=>{
        const filename = `${moment.now()}`+file.originalname.split(".").pop()
        if (!["image/jpeg", "image/png"].includes(file.mimetype)) cb("Error file type", filename)
        else cb(null, filename)
    }
})

const uploadForFace = multer({storage: storageForFace}).single("face")
const uploadForLicense = multer({storage: storageForLicense}).single("license")

router.post("/face/:filename", async (req, res) => {
    console.log(req.originalUrl)
    const filename = req.params.filename
    const doctorID = req.query.doctorID
    if (filename == "null"){
        uploadForFace(req, res, async (err)=>{
            if (err) return res.status(500).send({error: true, message: err})
            else {
                try{
                    const con = await connection()
                    const result = await con.query("UPDATE tb_doctor SET facePath=? WHERE doctorID=?", 
                    [path.join(__dirname, req.file.path), doctorID])
                    con.end()
                    if (!result.length) throw new Error("Something went wrong")
                    return res.send({error: false, message: "Add face path complete."})
                }
                catch(err){
                    logger.error(req.originalUrl + " => " + err)
                    return res.send({error: true, message: err})
                }
            }
        })
    }
    else {
        try{
            const filePath = path.join(__dirname, "..", "img/face", filename)
            fs.rmSync(filePath)
            uploadForFace(req, res, async (err)=>{
                if (err) return res.status(500).send({error: true, message: err})
                else {
                    try{
                        const con = await connection()
                        const result = await con.query("UPDATE tb_doctor SET facePath=? WHERE doctorID=?", 
                        [path.join(__dirname, req.file.path), doctorID])
                        con.end()
                        if (!result.length) throw new Error("Something went wrong")
                        return res.send({error: false, message: "Update face path complete."})
                    }
                    catch(err){
                        logger.error(req.originalUrl + " => " + err)
                        return res.send({error: true, message: err})
                    }
                }
            })
        }
        catch(err){
            logger.error(req.originalUrl + " => " + err)
        }
    }
})

router.post("/license/:filename", async (req, res) => {
    console.log(req.originalUrl)
    const filename = req.params.filename
    const doctorID = req.query.doctorID
    if (filename == "null"){
        uploadForLicense(req, res, async (err)=>{
            if (err) return res.status(500).send({error: true, message: err})
            else {
                try{
                    const con = await connection()
                    const result = await con.query("UPDATE tb_doctor SET licensePath=? WHERE doctorID=?", 
                    [path.join(__dirname, req.file.path), doctorID])
                    con.end()
                    if (!result.length) throw new Error("Something went wrong")
                    return res.send({error: false, message: "Add license path complete."})
                }
                catch(err){
                    logger.error(req.originalUrl + " => " + err)
                    return res.send({error: true, message: err})
                }
            }
        })
    }
    else {
        try{
            const filePath = path.join(__dirname, "..", "img/license", filename)
            fs.rmSync(filePath)
            uploadForLicense(req, res, async (err)=>{
                if (err) return res.status(500).send({error: true, message: err})
                else {
                    try{
                        const con = await connection()
                        const result = await con.query("UPDATE tb_doctor SET licensePath=? WHERE doctorID=?", 
                        [path.join(__dirname, req.file.path), doctorID])
                        con.end()
                        if (!result.length) throw new Error("Something went wrong")
                        return res.send({error: false, message: "Update license path complete."})
                    }
                    catch(err){
                        logger.error(req.originalUrl + " => " + err)
                        return res.send({error: true, message: err})
                    }
                }
            })
        }
        catch(err){
            logger.error(req.originalUrl + " => " + err)
        }
    }
})

router.get("/face/:filename", async (req, res) => {
    console.log(req.originalUrl)
    try{
        const filename = req.params.filename
        const filePath = path.join(__dirname, "..", "img/face", filename)
        if (!fs.existsSync(filePath)) throw new Error("File not found")

        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
    }
    catch(err){
        logger.error(req.originalUrl + " => " + err)
        return res.send({error: true, message: err})
    }
})

router.get("/license/:filename", async (req, res) => {
    console.log(req.originalUrl)
    try{
        const filename = req.params.filename
        const filePath = path.join(__dirname, "..", "img/license", filename)
        if (!fs.existsSync(filePath)) throw new Error("File not found")

        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
    }
    catch(err){
        logger.error(req.originalUrl + " => " + err)
        return res.send({error: true, message: err})
    }
})

module.exports = router