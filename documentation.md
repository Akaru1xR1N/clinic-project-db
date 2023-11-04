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
|post  |/clinic    |/              |Add clinic            |*{name,province,amphure,tambon,zip_code,place}{detail,totalMoney,createDate}|    message             |                 |
|put   |/clinic    |/              |update clinic info    |*{clinicID,name,province,amphure,tambon,zip_code,place,totalMoney,createDate}{detail}|message        |                 |
|delete|/clinic    |/              |delete clinic         |*{clinicID}          |        message      |change state to unused if delete again it will delete all info about clinic|
|post  |/clinic    |/bringback     |change unused to inused|*{clinicID}                                                   |                  message             |                |
|get   |/clinic    |/              |get clinic info       |*{clinicID}                                                   |{clinicID,name,province,amphure,tambon,place,totalMoney,createDate,detail}| |
|get   |/clinic    |/inused        |get clinic inused list|                                -                             |[clinicID,name,province,amphure,tambon,place,totalMoney,createDate,detail]| |
|get   |/clinic    |/unused        |get clinic unused list|                                -                             |[clinicID,name,province,amphure,tambon,place,totalMoney,createDate,detail]| |
|get   |/clinic    |/statement     |get clinic statement  |*{clinicID, year, month}                                      |[clinicID,time,value,type]            |                 |
|get   |/clinic    |/totalStatement|get total money clinic statement per month|*{clinicID, year, month}                  |{value}                               |                 |
|post  |/clinic    |/service/category|Add service category|*{categoryName}                                               |                  message             |                 |
|put   |/clinic    |/service/category|Update service category|*{categoryID,categoryName,inUsed}                          |                  message             |                 |
|delete|/clinic    |/service/category|delete service category|*{categoryID}                                              |                  message             |change state to unused if delete again it will delete all info about service category|
|post  |/clinic    |/service/category/bringback|change service category unused to inused|*{categoryID}                   |                  message             |                 |
|get   |/clinic    |/service/category|Get service category|*{categoryID}                                                 |{categoryID,categoryName,inUsed}      |                 |
|get   |/clinic    |/service/category/inused|Get service category inused list|             -                             |[categoryID,categoryName,inUsed]      |                 |
|get   |/clinic    |/service/category/unused|Get service category unused list|             -                             |[categoryID,categoryName,inUsed]      |                 |
|post  |/clinic    |/service/type  |Add service type      |*{categoryID,clinicID,typeName,duration,price}                |                  message             |                 |
|put   |/clinic    |/service/type  |Update service type   |*{typeID,categoryID,clinicID,typeName,duration,price}         |                  message             |                 |
|delete|/clinic    |/service/type  |Delete service type   |*{typeID}                                                     |                  message             |change state to unused if delete again it will delete all info about service type|
|post  |/clinic    |/service/type/bringback  |Change service type unused to inused   |           *{typeID}               |                  message             |                 |
|get   |/clinic    |/service/type  |Get service type info |*{typeID}                                                     |{typeID,categoryID,clinicID,typeName,duration,price,inUsed}| |
|get   |/clinic    |/service/type/inused|Get list service type inused|           *{clinicID}                             |[typeID,categoryID,clinicID,typeName,duration,price,inUsed]| |
|get   |/clinic    |/service/type/unused|Get list service type unused|           *{clinicID}                             |[typeID,categoryID,clinicID,typeName,duration,price,inUsed]| |
|get   |/clinic    |/storage|Get all item in storage      |                      *{clinicID}                             |[productID,clinicID,productName,amount]|                |
|get   |/clinic    |/useItemHistory|Get use item history  |                      *{clinicID}                       |[doctorID,productID,clinicID,typeID,amount,time,productName]| |

## owner
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|post  |/owner     |/              |Add owner             |*{name,surname,nationalID,password,email}                     |                 message              |                 |
|put   |/owner     |/              |update owner info     |*{ownerID,name,surname,nationalID,email}                      |                 message              |                 |
|delete|/owner     |/              |delete owner          |*{ownerID}                                                    |                 message              |                 |
|get   |/owner     |/              |get owner info        |*{ownerID}                                                    |{ownerID,name,surname,nationalID,email}|                |
|get   |/owner     |/list          |get owner list        |                                -                             |{ownerID,name,surname,nationalID,email}|                |
|post  |/owner     |/auth          |owner auth            |*{email, password}                                            |{ownerID,name,surname,nationalID,email}|                |
|post  |/owner     |/order         |Order item            |*{email, password}                                            |                 message              |                |

## admin
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|post  |/admin     |/              |Add admin             |*{clinicID,name,surname,nationalID,password,email}            |                 message              |                 |
|put   |/admin     |/              |update admin info     |*{clinicID,adminID,name,surname,nationalID,email}             |                 message              |                 |
|delete|/admin     |/              |delete admin          |*{adminID}                                                    |                 message              |                 |
|get   |/admin     |/              |get admin info        |*{adminID}                                                    |{clinicID,adminID,name,surname,nationalID,email}|       |
|get   |/admin     |/list          |get all admin in clinic|*{clinicID}                                                  |{clinicID,adminID,name,surname,nationalID,email}|       |
|post  |/admin     |/auth          |admin auth            |*{email, password}                                            |{adminID,name,surname,nationalID,email}|                |
|post  |/admin     |/order         |Order item            |*{email, password}                                            |                 message              |                 |

## doctor
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|post  |/doctor    |/              |Add doctor            |*{clinicID,adminID,prefix,name,surname,gender,nationalID,password,email}|       message              |                 |
|put   |/doctor    |/              |update doctor info    |*{doctorID,clinicID,adminID,prefix,name,surname,gender,nationalID,password,email}|  message          |                 |
|get   |/doctor    |/              |get doctor info       |*{doctorID}                                                   |{doctorID,clinicID,adminID,prefix,name,surname,gender,nationalID,password,email,licensePath,facePath}| |
|get   |/doctor    |/list          |get all doctor in clinic|*{clinicID}                                                 |{doctorID,clinicID,adminID,prefix,name,surname,gender,nationalID,password,email,licensePath,facePath}| |
|delete|/doctor    |/              |delete doctor         |*{doctorID}                                                   |                 message              |                  |
|get   |/doctor    |/viewRequestTime|View request time from customer|*{clinicID}                                         |[clinicID,customerID,typeID,doctorID,startTime]|        |
|post  |/doctor    |/acceptRequestTime|Accept service request time from customer|*{doctorID,clinicID,customerID,typeID,startTime}|          message             |                 |
|post  |/doctor    |/auth          |doctor auth           |*{email, password}                                            |{doctorID,name,surname,nationalID,email}|               |
|get   |/doctor    |/viewHistoryAndEvaluate|View history and evaluate|*{doctorID}                                        |[doctorID,customerID,typeID,score,comment,time]|        |
|post  |/doctor    |/useItem       |Use item              |*{doctorID,productID,amount}                                  |                  message             |                 |
|post  |/doctor    |/treatFinish   |Finish the treat      |*{doctorID}                                                   |                  message             |                 |

## customer
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|post  |/customer  |/              |customer register     |*{name,surname,gender,nationalID,password,phone,blood}{email,drugAllergy,disease}|      message      |                 |
|put   |/customer  |/              |customer update info  |*{customerID,name,surname,gender,nationalID,password,phone,blood}{email,drugAllergy,disease}|message |                 |
|get   |/customer  |/              |get customer info     |*{customerID}      |{customerID,name,surname,gender,nationalID,phone,blood,email,drugAllergy,disease}|                 |
|get   |/customer  |/list          |get all customer      |                                -                             |[customerID,name,surname,gender,phone]|                 |
|post  |/customer  |/serviceRequest|Add customer service request|*{clinicID,customerID,typeID,startTime}                 |                  message             |                 |
|delete|/customer  |/serviceRequest|Delete customer service request|*{clinicID,customerID,typeID,startTime}              |                  message             |                 |
|post  |/customer  |/auth          |customer auth         |*{email, password}                                            |{customerID,name,surname,nationalID,email}|             |
|get   |/customer  |/viewRequestTime|View own request time|*{customerID}                                                 |[clinicID,customerID,typeID,startTime]|                 |
|get   |/customer  |/viewRequestTimeApprove|View own request time approve|*{customerID}                                  |[clinicID,customerID,typeID,doctorID,startTime]|        |
|get   |/customer  |/viewHistoryAndEvaluate|View history and evaluate|*{customerID}                                      |[doctorID,customerID,typeID,score,comment,time]|        |

## location
|method|   group   |      path     |        detail        |                            data send                         |              data receive            |        note     |
|:----:|:---------:|:-------------:|:--------------------:|:------------------------------------------------------------:|:------------------------------------:|:---------------:|
|get   |/location  |/              |get all provinces     |                                                              |[province_id, name_th]                |                 |
|get   |/location  |/amphures      |get all amphures      |*province_id                                                  |[amphure_id, name_th]                 |                 |
|get   |/location  |/tambons       |get all tambons       |*amphure_id                                                   |[tambon_id, name_th, zip_code]        |                 |