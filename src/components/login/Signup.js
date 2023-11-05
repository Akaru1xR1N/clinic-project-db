import axios from 'axios';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

function Signup() {

    const [name, setName] = useState("");
    const [surName, setSurName] = useState("");
    const [gender, setGender] = useState('');
    const [nationalID, setNationalID] = useState('');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState('');
    const [blood, setBlood] = useState('');
    const [email, setEmail] = useState("");
    const [drugAllergy, setDrugAllergy] = useState('');
    const [disease, setDisease] = useState('');

    const [data, setData] = useState('');

    const AddCustomer = async () => {
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: "รหัสผ่านไม่ตรงกัน",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        const newCustomer = {
            name: name,
            surname: surName,
            gender: gender,
            nationalID: nationalID,
            password: password,
            phone: phone,
            blood: blood,
            email: email,
            drugAllergy: drugAllergy,
            disease: disease
        };

        try {
            await axios.post(process.env.REACT_APP_API_URL + 'customer', newCustomer);
            setData([...data, newCustomer]);
            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มผู้ใช้เสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = '/';
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const ToLogin = () => {
        window.location.href = '/Login';
    };

    return (
        <div>
            <h1 className=' text-4xl font-normal text-center p-7'>สร้างบัญชี</h1>
            <div className=' pl-14'>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ชื่อ</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                        value={name}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>นามสกุล</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setSurName(event.target.value);
                        }}
                        value={surName}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>เพศ</span>
                    <select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setGender(event.target.value);
                        }}
                        value={gender}
                    >
                        <option value={""}>---โปรดระบุเพศ---</option>
                        <option value={"F"}>หญิง</option>
                        <option value={"M"}>ชาย</option>
                    </select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>เลขประจำตัวประชาชน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setNationalID(event.target.value);
                        }}
                        value={nationalID}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>เบอร์มือถือ</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setPhone(event.target.value);
                        }}
                        value={phone}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>Email</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        value={email}
                        type='email'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>หมู่เลือด</span>
                    <select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setBlood(event.target.value);
                        }}
                        value={blood}
                    >
                        <option value={""}>---โปรดระบุหมู่เลือด---</option>
                        <option value={"A"}>A</option>
                        <option value={"B"}>B</option>
                        <option value={"O"}>O</option>
                        <option value={"AB"}>AB</option>
                    </select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>การแพ้ยา</span>
                    <textarea className=' border-2 border-black rounded-lg w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setDrugAllergy(event.target.value);
                        }}
                        value={drugAllergy}></textarea>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>โรคประจำตัว</span>
                    <textarea className=' border-2 border-black rounded-lg w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setDisease(event.target.value);
                        }}
                        value={disease}></textarea>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>รหัสผ่าน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        value={password}
                        type='password'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ยืนยันรหัสผ่าน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                        }}
                        value={confirmPassword}
                        type='password'></input>
                </div>
            </div>
            <div className=' flex justify-around space-x-4'>
                <div className=' p-4'>
                    <button onClick={ToLogin} className=' rounded-lg p-3' style={{
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>กลับ</button>
                </div>
                <div className=' p-4'>
                    <button onClick={AddCustomer} className=' rounded-lg p-3' style={{
                        backgroundColor: '#ACFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>สร้างบัญชี</button>
                </div>
            </div>
        </div>
    )
}

export default Signup