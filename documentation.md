# Requirement
```
ระบบบริหารจัดการร้านเสริมความงาม
- คลินิกความงาม: ต้องรับนัดจากลูกค้าได้ / จัดตารางหมอได้ / มีประเภทบริการให้เลือกได้อย่างน้อย 10 ประเภท เช่น รักษาสิว เลเซอร์ .../ เก็บประวัติคนไข้ได้ / 
เก็บประวัติการให้บริการของแพทย์ได้ เพื่อประเมินผลงาน / ทำ stock สินค้าคงคลังได้ / บัญชีรายรับรายจ่ายของคลินิก


เจ้าของธุรกิจ:
สามารถเปิดคลินิกกี่สาขาก็ได้
สามารถเพิ่มแอดมินเข้าคลินิกได้
สามารถดูรายรับรายจ่ายของทุกคลินิกได้
สามารถสั่งของเข้าคลินิกตัวเองได้
สามารถดูของในคลังได้
สามารถจัดการกับประเภทบริการได้

แอดมิน:
แอดมินที่อยู่ในคลินิกสามารถดูรายรับรายจ่ายได้แค่คลินิกที่ตัวเองอยู่
แอดมินแต่ละคนสามารถอยู่คลินิกได้แห่งเดียวเท่านั้น
แอดมินสามารถสั่งของเข้าคลินิกตัวเองได้เท่านั้น
สามารถดูสินค้าในคลินิกตัวเองได้
สามารถจัดการกับหมอที่อยู่ในคลินิกเดียวกันได้

หมอ:
หมอแต่ละคนสามารถทำงานได้คลินิกเดียวเท่านั้น
สามารถจัดตารางเวลาของตัวเองได้
สามารถใช้ของที่มีอยู่ในคลังได้
สามารถรับงานที่ลูกค้าขอมาได้
สามารถดูรีวิวและคะแนนของตัวเองได้

ลูกค้า:
สามารถสร้างบัญชีของตัวเองได้
สามารถเลือกเวลา บริการ และคลินิกที่จะไปรับบริการได้
สามารถให้คะแนนและรีวิวหมอที่ให้บริการได้
```

# Entity Relationship diagram
!["ERD"](https://github.com/Akaru1xR1N/clinic-project-db/blob/backend/db/er.png "ERD")

# API
## clinic
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|post  |/clinic    |/              |Add clinic            |*{name,province,amphure,tambon,place}{detail,totalMoney,createDate}|             message             |                 |
|put   |/clinic    |/              |update clinic info    |*{clinicID,name,province,amphure,tambon,place,totalMoney,createDate}{detail} |   message             |                 |
|delete|/clinic    |/              |delete clinic         |*{clinicID}                                                   |                  message             |change state to unused if delete again it will delete all info about clinic|
|get   |/clinic    |/              |get clinic info       |*{clinicID}                                                   |{clinicID,name,province,amphure,tambon,place,totalMoney,createDate,detail}| |
|get   |/clinic    |/inused        |get clinic inused list|                                -                             |[clinicID,name,province,amphure,tambon,place,totalMoney,createDate,detail]| |
|get   |/clinic    |/unused        |get clinic unused list|                                -                             |[clinicID,name,province,amphure,tambon,place,totalMoney,createDate,detail]| |

## owner
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|post  |/owner     |/              |Add owner             |*{name,surname,nationalID,password,email}                     |                 message              |                 |
|put   |/owner     |/              |update owner info     |*{ownerID,name,surname,nationalID,email}                      |                 message              |                 |
|delete|/owner     |/              |delete owner info     |*{ownerID}                                                    |                 message              |                 |
|get   |/owner     |/              |get owner info        |*{ownerID}                                                    |{ownerID,name,surname,nationalID,email}|                |

## admin
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|post  |/admin     |/              |Add admin             |*{clinicID,name,surname,nationalID,password,email}            |                 message              |                 |
|put   |/admin     |/              |update admin info     |*{clinicID,adminID,name,surname,nationalID,email}             |                 message              |                 |
|delete|/admin     |/              |delete admin info     |*{adminID}                                                    |                 message              |                 |
|get   |/admin     |/              |get admin info        |*{adminID}                                                    |{clinicID,adminID,name,surname,nationalID,email}|       |

## doctor

## customer
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|post  |/customer  |/              |customer register     |*{name,surname,gender,nationalID,password,phone,blood}{email,drugAllergy,disease}|      message      |                 |
|put   |/customer  |/              |customer update info  |*{customerID,name,surname,gender,nationalID,password,phone,blood}{email,drugAllergy,disease}|message |                 |
|get   |/customer  |/              |get customer info     |*{customerID}      |{customerID,name,surname,gender,nationalID,phone,blood,email,drugAllergy,disease}|                 |
|get   |/customer  |/list          |get all customer      |                                -                             |[customerID,name,surname,gender,phone]|                 |

## location
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|get   |/location  |/              |get all provinces     |                                                              |[province_id, name_th]                |                 |
|get   |/location  |/amphures      |get all amphures      |*province_id                                                  |[amphure_id, name_th]                 |                 |
|get   |/location  |/tambons       |get all tambons       |*amphure_id                                                   |[tambon_id, name_th, zip_code]        |                 |