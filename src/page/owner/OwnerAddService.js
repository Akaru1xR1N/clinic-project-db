import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Swal from 'sweetalert2';
import Pagination from '../../components/pagination/Pagination';

function OwnerAddService() {

    const [categoryName, setCategoryName] = useState('');
    const [newCategory, setNewCategoryName] = useState('');
    const [categoryData, setCategoryData] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [clinicID, setClinicID] = useState('');
    const [typeName, setTypeName] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [data, setData] = useState('');
    const [updateData, setUpdateData] = useState('');
    const [editID, setEditID] = useState('');
    const [status, setStatus] = useState('');

    const [isTableInusedVisible, setIsTableInusedVisible] = useState(false);
    const [isTableUnusedVisible, setIsTableUnusedVisible] = useState(false);
    const [isPopUpVisible, setIsPopUpVisible] = useState(false);
    const [isEditPopUpVisible, setIsEditPopUpVisible] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [opened, setOpened] = useState(false);
    const [closed, setClosed] = useState(false);
    const [edited, setEdited] = useState(false);

    const [InusedCategory, setInusedCategory] = useState([]);
    const [UnusedCategory, setUnusedCategory] = useState([]);
    const [selectCategory, setSelectCategory] = useState([]);
    const [selectClinic, setSelectClinic] = useState([]);

    const [filteredInusedCategoryList, setFilteredInusedCategoryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const [filteredUnusedCategoryList, setFilteredUnusedCategoryList] = useState([]);
    const [searchTermUnused, setSearchTermUnused] = useState('');
    const [currentPageUnused, setCurrentPageUnused] = useState(1);
    const [itemsPerPageUnused] = useState(5);

    const toggleTableInusedVisibility = () => {
        setIsTableInusedVisible(!isTableInusedVisible);
    };

    const toggleTableUnusedVisibility = () => {
        setIsTableUnusedVisible(!isTableUnusedVisible);
    };

    useEffect(() => {
        const isOwnerLogined = localStorage.getItem('isOwnerLogined');

        if (isOwnerLogined !== 'true') {
            // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
            window.location.href = '/owner/login';
        }

        const fetchDataInuesdTable = async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/category/inused');
                if (!data.error) {
                    setInusedCategory(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchDataUnuesdTable = async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/category/unused');
                if (!data.error) {
                    setUnusedCategory(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchSelectData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/category/inused');
                const responseData = response.data;
                if (!responseData.error) {
                    const options = responseData.data.map(category => ({
                        value: category.categoryID,
                        label: category.categoryName,
                        categoryID: category.categoryID
                    }))
                    setSelectCategory(options);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchClinicData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/inused');
                const responseData = response.data;
                if (!responseData.error) {
                    const options = responseData.data.map(clinic => ({
                        value: clinic.clinicID,
                        label: clinic.name,
                        clinicID: clinic.clinicID
                    }))
                    setSelectClinic(options);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataInuesdTable();
        fetchDataUnuesdTable();
        fetchSelectData();
        fetchClinicData();
    }, [deleted, closed, categoryName, opened, edited]);

    useEffect(() => {
        const filteredInusedList = InusedCategory.filter(inUsed => {
            return (
                inUsed.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredInusedCategoryList(filteredInusedList);
        setCurrentPage(1); // Reset to the first page when the search term changes

        const filteredUnusedList = UnusedCategory.filter(unUsed => {
            return (
                unUsed.categoryName.toLowerCase().includes(searchTermUnused.toLowerCase())
            );
        });
        setFilteredUnusedCategoryList(filteredUnusedList);
        setCurrentPageUnused(1); // Reset to the first page when the search term changes

    }, [InusedCategory, searchTerm, UnusedCategory, searchTermUnused]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInusedCategoryList.slice(indexOfFirstItem, indexOfLastItem);

    const indexOfLastItemUnused = currentPageUnused * itemsPerPageUnused;
    const indexOfFirstItemUnused = indexOfLastItemUnused - itemsPerPageUnused;
    const currentItemsUnused = filteredUnusedCategoryList.slice(indexOfFirstItemUnused, indexOfLastItemUnused);

    const renderInusedTableRows = (InusedCategory) => {
        return InusedCategory.map(category => {
            return (
                <tr key={category.categoryID}>
                    <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
                    <td style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div className=' flex space-x-4'>
                            <button
                                onClick={() => {
                                    setIsEditPopUpVisible(true)
                                    setEditID(category.categoryID)
                                    setStatus(category.inUsed)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>

                            </button>
                            <button
                                onClick={() => ChangeToClose(category.categoryID)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            );
        });
    };

    const renderUnusedTableRows = (UnusedCategory) => {
        return UnusedCategory.map(category => {
            return (
                <tr key={category.categoryID}>
                    <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
                    <td style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div className=' flex space-x-4'>
                            <button
                                onClick={() => {
                                    setIsEditPopUpVisible(true)
                                    setEditID(category.categoryID)
                                    setStatus(category.inUsed)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>

                            </button>
                            <button
                                onClick={() => ChangeToOpen(category.categoryID)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" />
                                </svg>
                            </button>
                            <button
                                onClick={() => deletedCategory(category.categoryID)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            );
        });
    };

    const addCategoryName = async () => {

        if (!categoryName) {
            Swal.fire({
                icon: "error",
                title: "โปรดกรอกชื่อหมวดหมู่",
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }

        const newCategory = {
            categoryName: categoryName
        };

        try {
            await axios.post(process.env.REACT_APP_API_URL + 'clinic/service/category', newCategory);
            setCategoryData([...categoryData, newCategory]);
            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มหมวดหมู่เสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            setCategoryName("");
            setCategoryData([]);
            setIsPopUpVisible(false);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const ChangeToClose = async (categoryID) => {
        await Swal.fire({
            icon: 'warning',
            title: 'ต้องการปิดให้บริการใช่หรือไม่?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก'
        })
            .then(async (result) => {
                setClosed(false)
                if (result.isConfirmed) {
                    try {
                        const response = await axios.delete(process.env.REACT_APP_API_URL + 'clinic/service/category', { data: { categoryID: categoryID } });
                        if (response.status === 200) {
                            await Swal.fire({
                                icon: 'success',
                                title: 'ปิดให้บริการ',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            setClosed(true);
                        } else {
                            console.error('ERROR FOUND');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            })
    };

    const deletedCategory = async (categoryID) => {
        await Swal.fire({
            icon: 'warning',
            title: 'ต้องการลบหมวดหมู่ใช่หรือไม่?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก'
        })
            .then(async (result) => {
                setDeleted(false);
                if (result.isConfirmed) {
                    try {
                        const response = await axios.delete(process.env.REACT_APP_API_URL + 'clinic/service/category', { data: { categoryID: categoryID } });
                        if (response.status === 200) {
                            await Swal.fire({
                                icon: 'success',
                                title: 'ลบหมวดหมู่เสร็จสิ้น',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            setDeleted(true);
                        } else {
                            console.error('ERROR FOUND');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            })
    };

    const ChangeToOpen = async (categoryID) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'ต้องการเปิดให้บริการใช่หรือไม่?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post(process.env.REACT_APP_API_URL + 'clinic/service/category/bringback', { categoryID: categoryID });
                if (response.status === 200) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'เปิดให้บริการ',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setOpened(true);
                } else {
                    console.error("ERROR FOUND")
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setOpened(false);
        }
    };

    const editCategory = async () => {
        const UpdateCategory = {
            categoryID: editID,
            categoryName: newCategory,
            inUsed: status
        }

        try {
            setEdited(false);
            await axios.put(process.env.REACT_APP_API_URL + 'clinic/service/category', UpdateCategory);
            setUpdateData([...updateData, UpdateCategory]);
            await Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            setEdited(true);
            setEditID('');
            setStatus('');
            setNewCategoryName("");
            setUpdateData([]);
            setIsEditPopUpVisible(false);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const onchangeCategory = async (selectCategory) => {
        setCategoryID(selectCategory.categoryID);
    };

    const onchangeClinic = async (selectClinic) => {
        setClinicID(selectClinic.clinicID);
    };

    const addServiceType = async () => {
        const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

        if (regex.test(duration)) {
            setDuration(duration);
        } else {
            Swal.fire({
                icon: 'error',
                title: "รูปแบบระยะเวลาไม่ถูกต้อง",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        const newServiceType = {
            clinicID: clinicID,
            categoryID: categoryID,
            typeName: typeName,
            duration: duration,
            price: price
        };

        try {
            await axios.post(process.env.REACT_APP_API_URL + 'clinic/service/type', newServiceType);
            setData([...data, newServiceType]);
            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มบริการเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = '/owner/service';
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const ToServicePage = () => {
        window.location.href = '/owner/service';
    };

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearchUnused = event => {
        setSearchTermUnused(event.target.value);
    };

    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber);
    };

    const handlePageChangeUnused = pageNumberUnused => {
        setCurrentPageUnused(pageNumberUnused);
    };

    return (
        <div>
            <h1 className=' text-4xl font-normal text-center p-7'>เพิ่มบริการ</h1>
            <div>
                <div>
                    <div className=' flex space-x-4 mb-4'>
                        <h2 className=' text-2xl font-normal'>หมวดหมู่ของบริการ</h2>
                        <button onClick={() => setIsPopUpVisible(true)} className=' rounded-lg px-2' style={{
                            backgroundColor: '#ACFF79',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>เพิ่ม</button>
                        <Popup
                            trigger={null}
                            open={isPopUpVisible}
                            onClose={() => setIsPopUpVisible(false)}
                            position={"right center"}
                            contentStyle={{
                                width: 400,
                            }}>
                            <div className=' grid pb-4 place-items-center'>
                                <span className=' text-xl font-normal mb-4'>ชื่อหมวดหมู่</span>
                                <input className=' border-2 border-black rounded-full w-5/6 py-3 px-6 mb-4'
                                    onChange={(event) => {
                                        setCategoryName(event.target.value);
                                    }}></input>
                                <button onClick={addCategoryName} className=' rounded-lg px-2 py-2' style={{
                                    backgroundColor: '#ACFF79',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                                }}>เพิ่ม</button>
                            </div>
                        </Popup>
                        <Popup
                            trigger={null}
                            open={isEditPopUpVisible}
                            onClose={() => setIsEditPopUpVisible(false)}
                            position={"right center"}
                            contentStyle={{
                                width: 400,
                            }}>
                            <div className=' grid pb-4 place-items-center'>
                                <span className=' text-xl font-normal mb-4'>แก้ไขชื่อหมวดหมู่</span>
                                <input className=' border-2 border-black rounded-full w-5/6 py-3 px-6 mb-4'
                                    onChange={(event) => {
                                        setNewCategoryName(event.target.value);
                                    }}></input>
                                <button onClick={editCategory} className=' rounded-lg px-2 py-2' style={{
                                    backgroundColor: '#ACFF79',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                                }}>แก้ไข</button>
                            </div>
                        </Popup>
                    </div>
                    <div>
                        <div className=' flex space-x-4 mb-4'>
                            <h2 className=' text-xl font-normal'>เปิดให้บริการ</h2>
                            <button onClick={toggleTableInusedVisibility}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    {isTableInusedVisible ? (
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                                    ) : (
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        {isTableInusedVisible && (
                            <div className=' grid pb-4'>
                                <input
                                    type="text"
                                    placeholder="ค้นหาตามชื่อ"
                                    className="rounded-lg p-2 border border-gray-300 mb-4"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <table className=' table-auto'>
                                    <thead style={{
                                        backgroundColor: '#FFB2B2',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ชื่อ</th>
                                            <th style={{ textAlign: 'center' }}>การกระทำ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderInusedTableRows(currentItems)}
                                    </tbody>
                                </table>
                                <div className="pagination flex justify-center mt-4">
                                    <Pagination
                                        totalItems={filteredInusedCategoryList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
                                        itemsPerPage={itemsPerPage} // จำนวนรายการต่อหน้า
                                        onPageChange={handlePageChange} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className=' flex space-x-4 mb-4'>
                            <h2 className=' text-xl font-normal'>ปิดให้บริการ</h2>
                            <button onClick={toggleTableUnusedVisibility}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    {isTableUnusedVisible ? (
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                                    ) : (
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        {isTableUnusedVisible && (
                            <div className=' grid mb-4'>
                                <input
                                    type="text"
                                    placeholder="ค้นหาตามชื่อ"
                                    className="rounded-lg p-2 border border-gray-300 mb-4"
                                    value={searchTermUnused}
                                    onChange={handleSearchUnused}
                                />
                                <table className=' table-auto'>
                                    <thead style={{
                                        backgroundColor: '#FFB2B2',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ชื่อ</th>
                                            <th style={{ textAlign: 'center' }}>การกระทำ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderUnusedTableRows(currentItemsUnused)}
                                    </tbody>
                                </table>
                                <div className="pagination flex justify-center mt-4">
                                    <Pagination
                                        totalItems={filteredUnusedCategoryList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
                                        itemsPerPage={itemsPerPageUnused} // จำนวนรายการต่อหน้า
                                        onPageChange={handlePageChangeUnused} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <h2 className=' text-3xl font-normal text-center p-7'>ประเภทของบริการ</h2>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>สาขา</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        options={selectClinic}
                        onChange={onchangeClinic}
                        placeholder='---โปรดระบุชื่อสาขา---'>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>หมวดหมู่</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        options={selectCategory}
                        onChange={onchangeCategory}
                        placeholder='---โปรดระบุชื่อสาขา---'>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ชื่อบริการ</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setTypeName(event.target.value);
                        }}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ระยะเวลา</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setDuration(event.target.value);
                        }}
                        placeholder='ชั่วโมง:นาที:วินาที เช่น 11:40:00'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ราคา</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setPrice(event.target.value);
                        }}
                        type='number'></input>
                </div>
            </div>
            <div className=' flex justify-around space-x-4'>
                <div className=' p-4'>
                    <button onClick={ToServicePage} className=' rounded-lg p-3' style={{
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>กลับ</button>
                </div>
                <div className=' p-4'>
                    <button onClick={addServiceType} className=' rounded-lg p-3' style={{
                        backgroundColor: '#ACFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>เพิ่มประเภทของบริการ</button>
                </div>
            </div>
        </div>
    )
}

export default OwnerAddService