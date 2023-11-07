import React, { useState } from 'react';

const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        onPageChange(pageNumber);
    };

    const renderPaginationButtons = () => {
        const maxButtonsToShow = 5; // จำนวนสูงสุดของปุ่มที่แสดงใน pagination
        const buttons = [];

        const isAtFirstPage = currentPage === 1;
        const isAtLastPage = currentPage === totalPages;

        if (!isAtFirstPage) {
            // หากไม่ได้อยู่ที่หน้าแรก แสดงปุ่ม Home
            buttons.push(
                <button
                    key="home"
                    onClick={() => handlePageChange(1)}
                    className="bg-[#FFB2F3] text-black px-4 py-2 rounded mr-2 focus:outline-none"
                >
                    หน้าแรก
                </button>
            );
        }

        if (totalPages <= maxButtonsToShow) {
            // ถ้ามีหน้าไม่เกิน maxButtonsToShow แสดงทุกหน้า
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`${currentPage === i
                            ? 'bg-[#FFB2F3] text-black'
                            : 'text-black hover:bg-[#FFEAFC]'
                            } px-4 py-2 rounded mr-2 focus:outline-none`}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // มีมากกว่า maxButtonsToShow หน้า
            const leftEllipsis = currentPage > 2;
            const rightEllipsis = currentPage < totalPages - 1;

            buttons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`${currentPage === 1
                        ? 'bg-[#FFB2F3] text-black'
                        : 'text-black hover:bg-[#FFEAFC]'
                        } px-4 py-2 rounded mr-2 focus:outline-none`}
                >
                    1
                </button>
            );

            if (leftEllipsis) {
                buttons.push(<span key="leftEllipsis">...</span>);
            }

            const start = leftEllipsis ? currentPage - 1 : 2;
            const end = rightEllipsis ? currentPage + 1 : totalPages - 1;

            for (let i = start; i <= end; i++) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`${currentPage === i
                            ? 'bg-[#FFB2F3] text-black'
                            : 'text-black hover:bg-[#FFEAFC]'
                            } px-4 py-2 rounded mr-2 focus:outline-none`}
                    >
                        {i}
                    </button>
                );
            }

            if (rightEllipsis) {
                buttons.push(<span key="rightEllipsis">...</span>);
            }

            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`${currentPage === totalPages
                        ? 'bg-[#FFB2F3] text-black'
                        : 'text-black hover:bg-[#FFEAFC]'
                        } px-4 py-2 rounded mr-2 focus:outline-none`}
                >
                    {totalPages}
                </button>
            );
        }

        if (!isAtLastPage) {
            // หากไม่ได้อยู่ที่หน้าสุดท้าย แสดงปุ่ม Last
            buttons.push(
                <button
                    key="last"
                    onClick={() => handlePageChange(totalPages)}
                    className="bg-[#FFB2F3] text-black px-4 py-2 rounded mr-2 focus:outline-none"
                >
                    หน้าสุดท้าย
                </button>
            );
        }

        return buttons;
    };

    return <div className="flex justify-center items-center mt-8">{renderPaginationButtons()}</div>;
};

export default Pagination;
