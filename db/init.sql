/* 
 * Run this file for the first time to set update the database
 */


DROP DATABASE IF EXISTS db_clinic_project;
CREATE DATABASE db_clinic_project COLLATE "utf8mb4_general_ci";

USE db_clinic_project;

SET @@global.time_zone = "SYSTEM";
SET @@session.time_zone = "SYSTEM";

/***************************************************************
--                          static table
***************************************************************/

-- table tb_item
DROP TABLE IF EXISTS tb_item;
CREATE TABLE tb_item(
    itemID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    itemName VARCHAR(50) NOT NULL,
    price DECIMAL(14,4) UNSIGNED NOT NULL
);
/**************************************************************/

-- table tb_owner
DROP TABLE IF EXISTS tb_owner;
CREATE TABLE tb_owner(
    ownerID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    nationalID VARCHAR(13) NOT NULL,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- table tb_clinic
DROP TABLE IF EXISTS tb_clinic;
CREATE TABLE tb_clinic(
    clinicID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    amphure VARCHAR(50) NOT NULL,
    tambon VARCHAR(50) NOT NULL,
    zip_code VARCHAR(5) NOT NULL,
    place VARCHAR(200) NOT NULL,
    detail VARCHAR(200) NULL,
    totalMoney DECIMAL(14,4) NOT NULL DEFAULT 0,
    createDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    inUsed TINYINT NOT NULL DEFAULT 1
);

-- table tb_bank
DROP TABLE IF EXISTS tb_bank;
CREATE TABLE tb_bank(
    clinicID SMALLINT UNSIGNED NOT NULL,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    value DECIMAL(14,4) NOT NULL,
    type TINYINT NOT NULL,

    -- FK
    CONSTRAINT `fk_clinicID_from_tb_clinic_to_bank` FOREIGN KEY (clinicID) REFERENCES tb_clinic(clinicID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_category
DROP TABLE IF EXISTS tb_category;
CREATE TABLE tb_category(
    categoryID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    categoryName VARCHAR(50) NOT NULL,
    inUsed TINYINT NOT NULL DEFAULT 1
);

-- table tb_serviceType
DROP TABLE IF EXISTS tb_serviceType;
CREATE TABLE tb_serviceType(
    typeID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    categoryID SMALLINT UNSIGNED NOT NULL,
    clinicID SMALLINT UNSIGNED NOT NULL,
    typeName VARCHAR(50) NOT NULL,
    duration TIME NOT NULL,
    price DECIMAL(14,4) NOT NULL,
    inUsed TINYINT NOT NULL DEFAULT 1,

    -- FK
    CONSTRAINT `fk_categoryID_from_tb_category_to_serviceType` FOREIGN KEY (categoryID) REFERENCES tb_category(categoryID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_clinicID_from_tb_clinic_to_serviceType` FOREIGN KEY (clinicID) REFERENCES tb_clinic(clinicID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_storage
DROP TABLE IF EXISTS tb_storage;
CREATE TABLE tb_storage(
    productID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    clinicID SMALLINT UNSIGNED NOT NULL,
    productName VARCHAR(50) NOT NULL,
    amount SMALLINT UNSIGNED NOT NULL,

    -- FK
    CONSTRAINT `fk_clinicID_from_tb_clinic_to_storage` FOREIGN KEY (clinicID) REFERENCES tb_clinic(clinicID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_admin
DROP TABLE IF EXISTS tb_admin;
CREATE TABLE tb_admin(
    adminID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    clinicID SMALLINT UNSIGNED NOT NULL,
    nationalID VARCHAR(13) NOT NULL,
    password VARCHAR(200) NOT NULL,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,

    -- FK
    CONSTRAINT `fk_clinicID_from_tb_clinic_to_admin` FOREIGN KEY (clinicID) REFERENCES tb_clinic(clinicID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_orderItem
DROP TABLE IF EXISTS tb_orderItem;
CREATE TABLE tb_orderItem(
    ownerID SMALLINT UNSIGNED,
    adminID SMALLINT UNSIGNED,
    clinicID SMALLINT UNSIGNED NOT NULL,
    itemID SMALLINT UNSIGNED NOT NULL,
    amount SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    totalPrice DECIMAL(14,4) UNSIGNED NOT NULL,

    -- FK
    CONSTRAINT `fk_ownerID_from_tb_owner_to_orderItem` FOREIGN KEY (ownerID) REFERENCES tb_owner(ownerID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_adminID_from_tb_admin_to_orderItem` FOREIGN KEY (adminID) REFERENCES tb_admin(adminID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_clinicID_from_tb_clinic_to_orderItem` FOREIGN KEY (clinicID) REFERENCES tb_clinic(clinicID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_itemID_from_tb_item_to_orderItem` FOREIGN KEY (itemID) REFERENCES tb_item(itemID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_doctor
DROP TABLE IF EXISTS tb_doctor;
CREATE TABLE tb_doctor(
    doctorID MEDIUMINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    clinicID SMALLINT UNSIGNED NOT NULL,
    adminID SMALLINT UNSIGNED NOT NULL,
    prefix VARCHAR(10) NOT NULL,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    gender VARCHAR(1) NOT NULL,
    nationalID VARCHAR(13) NOT NULL,
    password VARCHAR(200) NOT NULL,
    licensePath VARCHAR(200) NULL,
    facePath VARCHAR(200) NULL,
    email VARCHAR(100) NOT NULL,

    -- FK
    CONSTRAINT `fk_clinicID_from_tb_clinic_to_doctor` FOREIGN KEY (clinicID) REFERENCES tb_clinic(clinicID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_adminID_from_tb_admin_to_doctor` FOREIGN KEY (adminID) REFERENCES tb_admin(adminID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_timetable
DROP TABLE IF EXISTS tb_timetable;
CREATE TABLE tb_timetable(
    doctorID MEDIUMINT UNSIGNED NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,

    -- FK
    CONSTRAINT `fk_doctorID_from_tb_doctor_to_timetable` FOREIGN KEY (doctorID) REFERENCES tb_doctor(doctorID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_customer
DROP TABLE IF EXISTS tb_customer;
CREATE TABLE tb_customer(
    customerID BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    gender VARCHAR(1) NOT NULL,
    nationalID VARCHAR(13) NOT NULL,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NOT NULL,
    drugAllergy VARCHAR(200) NULL,
    disease VARCHAR(200) NULL,
    blood VARCHAR(3) NOT NULL
);

-- table tb_reqTime
DROP TABLE IF EXISTS tb_reqTime;
CREATE TABLE tb_reqTime(
    clinicID SMALLINT UNSIGNED NOT NULL,
    customerID BIGINT UNSIGNED NOT NULL,
    typeID SMALLINT UNSIGNED NOT NULL,
    doctorID MEDIUMINT UNSIGNED NULL,
    startTime DATETIME NOT NULL,

    -- FK
    CONSTRAINT `fk_clinicID_from_tb_clinic_to_reqTime` FOREIGN KEY (clinicID) REFERENCES tb_clinic(clinicID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_customerID_from_tb_customer_to_reqTime` FOREIGN KEY (customerID) REFERENCES tb_customer(customerID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_typeID_from_tb_serviceType_to_reqTime` FOREIGN KEY (typeID) REFERENCES tb_serviceType(typeID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_doctorID_from_tb_doctor_to_reqTime` FOREIGN KEY (doctorID) REFERENCES tb_doctor(doctorID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_historyEvaluate
DROP TABLE IF EXISTS tb_historyEvaluate;
CREATE TABLE tb_historyEvaluate(
    doctorID MEDIUMINT UNSIGNED NOT NULL,
    customerID BIGINT UNSIGNED NOT NULL,
    typeID SMALLINT UNSIGNED NOT NULL,
    score TINYINT UNSIGNED NULL,
    comment VARCHAR(200) NULL,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),

    -- FK
    CONSTRAINT `fk_doctorID_from_tb_doctor_to_historyEvaluate` FOREIGN KEY (doctorID) REFERENCES tb_doctor(doctorID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_customerID_from_tb_customer_to_historyEvaluate` FOREIGN KEY (customerID) REFERENCES tb_customer(customerID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_typeID_from_tb_serviceType_to_historyEvaluate` FOREIGN KEY (typeID) REFERENCES tb_serviceType(typeID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- table tb_useItem
DROP TABLE IF EXISTS tb_useItem;
CREATE TABLE tb_useItem(
    doctorID MEDIUMINT UNSIGNED NOT NULL,
    productID SMALLINT UNSIGNED NOT NULL,
    typeID SMALLINT UNSIGNED NOT NULL,
    amount TINYINT UNSIGNED NOT NULL,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),

    -- FK
    CONSTRAINT `fk_doctorID_from_tb_doctor_to_useItem` FOREIGN KEY (doctorID) REFERENCES tb_doctor(doctorID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_productID_from_tb_storage_to_useItem` FOREIGN KEY (productID) REFERENCES tb_storage(productID) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT `fk_typeID_from_tb_serviceType_to_useItem` FOREIGN KEY (typeID) REFERENCES tb_serviceType(typeID) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- trigger check valid account clinic
DROP TRIGGER IF EXISTS checkValidClinic;
delimiter //
CREATE TRIGGER checkValidClinic BEFORE INSERT ON tb_clinic
    FOR EACH ROW
    BEGIN
        IF NEW.place IN (SELECT place FROM tb_clinic WHERE name=NEW.name AND province=NEW.province AND amphure=NEW.amphure AND tambon=NEW.tambon AND place=NEW.place) THEN
            SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "That place is valid";
        END IF;
    END;
//
delimiter ;

-- trigger check valid account admin
DROP TRIGGER IF EXISTS checkValidAdmin;
delimiter //
CREATE TRIGGER checkValidAdmin BEFORE INSERT ON tb_admin
    FOR EACH ROW
    BEGIN
        IF NEW.nationalID IN (SELECT nationalID FROM tb_admin WHERE nationalID=NEW.nationalID) THEN
            SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "That nationalID valid";
        END IF;
    END;
//
delimiter ;

-- trigger check valid account doctor
DROP TRIGGER IF EXISTS checkValidDoctor;
delimiter //
CREATE TRIGGER checkValidDoctor BEFORE INSERT ON tb_doctor
    FOR EACH ROW
    BEGIN
        IF NEW.nationalID IN (SELECT nationalID FROM tb_doctor WHERE nationalID=NEW.nationalID) THEN
            SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "That nationalID valid";
        END IF;
    END;
//
delimiter ;

-- trigger check valid account customer
DROP TRIGGER IF EXISTS checkValidCustomer;
delimiter //
CREATE TRIGGER checkValidCustomer BEFORE INSERT ON tb_customer
    FOR EACH ROW
    BEGIN
        IF NEW.nationalID IN (SELECT nationalID FROM tb_customer WHERE nationalID=NEW.nationalID) THEN
            SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "That nationalID valid";
        ELSEIF NEW.email IN (SELECT email FROM tb_customer WHERE email=NEW.email) THEN
            SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "That email valid";
        END IF;
    END;
//
delimiter ;

-- trigger check valid account serviceType
DROP TRIGGER IF EXISTS checkValidServiceType;
delimiter //
CREATE TRIGGER checkValidServiceType BEFORE INSERT ON tb_serviceType
    FOR EACH ROW
    BEGIN
        IF NEW.typeName IN (SELECT typeName FROM tb_serviceType WHERE typeName=NEW.typeName AND duration=NEW.duration AND price=NEW.price AND clinicID=NEW.clinicID) THEN
            SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "That type valid";
        END IF;
    END;
//
delimiter ;

-- trigger check valid reqTime
DROP TRIGGER IF EXISTS checkValidReqTime;
delimiter //
CREATE TRIGGER checkValidReqTime BEFORE INSERT ON tb_reqTime
    FOR EACH ROW
    BEGIN
        IF NEW.startTime IN (SELECT startTime FROM tb_reqTime WHERE clinicID=NEW.clinicID AND customerID=NEW.customerID AND typeID=NEW.typeID AND startTime=NEW.startTime) THEN
            SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "You've already register in that time";
        END IF;
    END;
//
delimiter ;

/***************************************************************
--                          Order item
***************************************************************/

-- trigger total price and bank then store to storage
DROP TRIGGER IF EXISTS totalPriceAndBankAndStorageOrderItem
delimiter //
CREATE TRIGGER totalPriceAndBankAndStorageOrderItem BEFORE INSERT ON tb_orderItem
    FOR EACH ROW
    BEGIN
        DECLARE price DECIMAL(14,4) UNSIGNED DEFAULT (SELECT price FROM tb_item WHERE itemID=NEW.itemID);
        DECLARE prodName VARCHAR(50);
        SET NEW.totalPrice = price * NEW.amount;

        INSERT INTO tb_bank(clinicID, type, value) VALUES (NEW.clinicID, 0, NEW.totalPrice);
        UPDATE tb_clinic SET totalMoney = totalMoney-NEW.totalPrice WHERE clinicID=NEW.clinicID;

        SET prodName = (SELECT itemName FROM tb_item WHERE itemID=NEW.itemID);
        IF prodName IN (SELECT productName FROM tb_storage WHERE clinicID=NEW.clinicID) THEN
            UPDATE tb_storage SET amount=amount+NEW.amount WHERE productName=prodName AND clinicID=NEW.clinicID;
        ELSE
            INSERT INTO tb_storage (clinicID, productName, amount) VALUES (NEW.clinicID, prodName, NEW.amount);
        END IF;
    END;
//
delimiter ;

/***************************************************************
--                          Use item
***************************************************************/

-- trigger doctor use item from storage
DROP TRIGGER IF EXISTS useItem;
delimiter //
CREATE TRIGGER useItem BEFORE INSERT ON tb_useItem
    FOR EACH ROW
    BEGIN
        DECLARE currentTime DATETIME DEFAULT CURRENT_TIMESTAMP();
        DECLARE initTime DATETIME DEFAULT (SELECT startTime FROM tb_timetable WHERE doctorID=NEW.doctorID AND currentTime BETWEEN startTime AND endTime);
        DECLARE serviceType SMALLINT UNSIGNED DEFAULT (SELECT typeID FROM tb_reqTime WHERE doctorID=NEW.doctorID AND startTime=initTime);
        SET NEW.typeID = serviceType;

        UPDATE tb_storage SET amount = amount-NEW.amount WHERE productID=NEW.productID;
    END;
//
delimiter ;

/***************************************************************
--                 After treat clinic earn money
***************************************************************/

-- trigger after treat clinic bank earn money 60% of service type
DROP TRIGGER IF EXISTS earnMoney;
delimiter //
CREATE TRIGGER earnMoney AFTER INSERT ON tb_historyEvaluate
    FOR EACH ROW
    BEGIN
        DECLARE earnValue DECIMAL(14,4) DEFAULT (SELECT price FROM tb_serviceType WHERE typeID=NEW.typeID);
        DECLARE clinic SMALLINT UNSIGNED DEFAULT (SELECT clinicID FROM tb_serviceType WHERE typeID=NEW.typeID);
        SET earnValue = earnValue*0.6;

        INSERT INTO tb_bank(clinicID, type, value) VALUES (clinic, 1, earnValue);
        UPDATE tb_clinic SET totalMoney = totalMoney+earnValue WHERE clinicID=clinic;
    END;
//
delimiter ;

/***************************************************************
--             Doctor approve then add to timetable
***************************************************************/

-- trigger add to timetable
DROP TRIGGER IF EXISTS approveToTimetable;
delimiter //
CREATE TRIGGER approveToTimetable AFTER UPDATE ON tb_reqTime
    FOR EACH ROW
    BEGIN
        DECLARE currentTime DATETIME DEFAULT CURRENT_TIMESTAMP();
        DECLARE durationTime TIME DEFAULT (SELECT duration FROM tb_serviceType WHERE typeID=NEW.typeID);

        INSERT INTO tb_timetable (doctorID, startTime, endTime) VALUES (NEW.doctorID, NEW.startTime, TIMESTAMPADD(MINUTE, TIMESTAMPDIFF(MINUTE, CONCAT(YEAR(currentTime),"-",MONTH(currentTime),"-",DAY(currentTime)," 00:00:00"), CONCAT(YEAR(currentTime),"-",MONTH(currentTime),"-",DAY(currentTime), " ", durationTime)), NEW.startTime));
    END;
//
delimiter ;

/***************************************************************
--              Save history then delete reqTime
***************************************************************/

-- procedure after treat finist save history then delete reqTime
DROP PROCEDURE IF EXISTS sp_treatFinish;
delimiter //
CREATE PROCEDURE sp_treatFinish(IN DrID MEDIUMINT UNSIGNED)
    BEGIN
        DECLARE currentTime DATETIME DEFAULT CURRENT_TIMESTAMP();
        DECLARE initTime DATETIME DEFAULT (SELECT MIN(startTime) FROM tb_reqTime WHERE doctorID=DrID);
        DECLARE serviceType SMALLINT UNSIGNED DEFAULT (SELECT typeID FROM tb_reqTime WHERE doctorID=DrID AND startTime=initTime);
        DECLARE durationTime TIME DEFAULT (SELECT duration FROM tb_serviceType WHERE typeID=serviceType);
        DECLARE finTime DATETIME DEFAULT TIMESTAMPADD(MINUTE, TIMESTAMPDIFF(MINUTE, CONCAT(YEAR(currentTime),"-",MONTH(currentTime),"-",DAY(currentTime)," 00:00:00"), CONCAT(YEAR(currentTime),"-",MONTH(currentTime),"-",DAY(currentTime), " ", durationTime)), initTime);
        DECLARE cusID BIGINT UNSIGNED DEFAULT (SELECT customerID FROM tb_reqTime WHERE startTime=initTime AND doctorID=DrID AND typeID=serviceType);
        IF currentTime BETWEEN initTime AND finTime THEN
            INSERT INTO tb_historyEvaluate (doctorID, customerID, typeID, time) VALUES (DrID, cusID, serviceType, currentTime);
            DELETE FROM tb_reqTime WHERE startTime=initTime AND doctorID=DrID AND typeID=serviceType;
            UPDATE tb_timetable SET endTime=currentTime WHERE startTime=initTime AND doctorID=DrID;
        ELSEIF currentTime > finTime THEN
            INSERT INTO tb_historyEvaluate (doctorID, customerID, typeID, time) VALUES (DrID, cusID, serviceType, currentTime);
            DELETE FROM tb_reqTime WHERE startTime=initTime AND doctorID=DrID AND typeID=serviceType;
        END IF;
    END;
//
delimiter ;

/***************************************************************
--   Change state clinic to unused or delete clinic complete
***************************************************************/

-- procedure change state to unused or delete clinic
DROP PROCEDURE IF EXISTS sp_changeStateOrDeleteClinic;
delimiter //
CREATE PROCEDURE sp_changeStateOrDeleteClinic(IN cID SMALLINT UNSIGNED)
    BEGIN
        DECLARE clinicState TINYINT DEFAULT (SELECT inUsed FROM tb_clinic WHERE clinicID=cID);
        IF clinicState = 1 THEN
            UPDATE tb_clinic SET inUsed=0 WHERE clinicID=cID;
        ELSE
            DELETE FROM tb_clinic WHERE clinicID=cID;
        END IF;
    END;
//
delimiter ;

/***************************************************************
--   Change state clinic from unused to inused
***************************************************************/

-- procedure change state from unused to inused
DROP PROCEDURE IF EXISTS sp_changeStateBringBackClinic;
delimiter //
CREATE PROCEDURE sp_changeStateBringBackClinic(IN cID SMALLINT UNSIGNED)
    BEGIN
        DECLARE clinicState TINYINT DEFAULT (SELECT inUsed FROM tb_clinic WHERE clinicID=cID);
        IF clinicState = 0 THEN
            UPDATE tb_clinic SET inUsed=1 WHERE clinicID=cID;
        END IF;
    END;
//
delimiter ;

/***************************************************************
-- Change state service category to unused or delete service category complete
***************************************************************/

-- procedure change state to unused or delete service category
DROP PROCEDURE IF EXISTS sp_changeStateOrDeleteServiceCategory;
delimiter //
CREATE PROCEDURE sp_changeStateOrDeleteServiceCategory(IN cateID SMALLINT UNSIGNED)
    BEGIN
        DECLARE serviceCategoryState TINYINT DEFAULT (SELECT inUsed FROM tb_category WHERE categoryID=cateID);
        IF serviceCategoryState = 1 THEN
            UPDATE tb_category SET inUsed=0 WHERE categoryID=cateID;
        ELSE
            DELETE FROM tb_category WHERE categoryID=cateID;
        END IF;
        UPDATE tb_serviceType SET inUsed=0 WHERE categoryID=cateID;
    END;
//
delimiter ;

/***************************************************************
-- Change state service category from unused to inused service category
***************************************************************/

-- procedure change state from unused to inused service category
DROP PROCEDURE IF EXISTS sp_changeStateBringBackServiceCategory;
delimiter //
CREATE PROCEDURE sp_changeStateBringBackServiceCategory(IN cateID SMALLINT UNSIGNED)
    BEGIN
        DECLARE serviceCategoryState TINYINT DEFAULT (SELECT inUsed FROM tb_category WHERE categoryID=cateID);
        IF serviceCategoryState = 0 THEN
            UPDATE tb_category SET inUsed=1 WHERE categoryID=cateID;
        END IF;
    END;
//
delimiter ;

/***************************************************************
-- Change state service type to unused or delete service type complete
***************************************************************/

-- procedure change state to unused or delete service type
DROP PROCEDURE IF EXISTS sp_changeStateOrDeleteServiceType;
delimiter //
CREATE PROCEDURE sp_changeStateOrDeleteServiceType(IN tID SMALLINT UNSIGNED)
    BEGIN
        DECLARE serviceTypeState TINYINT DEFAULT (SELECT inUsed FROM tb_serviceType WHERE typeID=tID);
        IF serviceTypeState = 1 THEN
            UPDATE tb_serviceType SET inUsed=0 WHERE typeID=tID;
        ELSE
            DELETE FROM tb_serviceType WHERE typeID=tID;
        END IF;
    END;
//
delimiter ;

/***************************************************************
-- Change state service type from unused to inused service type
***************************************************************/

-- procedure change state from unused to inused service type
DROP PROCEDURE IF EXISTS sp_changeStateBringBackServiceType;
delimiter //
CREATE PROCEDURE sp_changeStateBringBackServiceType(IN tID SMALLINT UNSIGNED)
    BEGIN
        DECLARE serviceTypeState TINYINT DEFAULT (SELECT inUsed FROM tb_serviceType WHERE typeID=tID);
        IF serviceTypeState = 0 THEN
            UPDATE tb_serviceType SET inUsed=1 WHERE typeID=tID;
        END IF;
    END;
//
delimiter ;

/***************************************************************
--               Get total money per month
***************************************************************/

-- procedure get total money per month
DROP PROCEDURE IF EXISTS sp_totalMoneyPerMonth;
delimiter //
CREATE PROCEDURE sp_totalMoneyPerMonth(IN cID SMALLINT UNSIGNED, IN y SMALLINT UNSIGNED, IN m TINYINT UNSIGNED, OUT val DECIMAL(14,4))
    BEGIN
        DECLARE income DECIMAL(14,4) DEFAULT (SELECT SUM(value) FROM tb_bank WHERE clinicID=cID AND type=1 AND YEAR(time)=y AND MONTH(time)=m);
        DECLARE expense DECIMAL(14,4) DEFAULT (SELECT SUM(value) FROM tb_bank WHERE clinicID=cID AND type=0 AND YEAR(time)=y AND MONTH(time)=m);
        IF income IS NULL THEN
            SET income = 0;
        END IF;
        IF expense IS NULL THEN
            SET expense = 0;
        END IF;

        SET val = income - expense;
    END;
//
delimiter ;