import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";

const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม",
    "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน",
    "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const GraphCaseComponent = ({ caseList }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null); // Use a ref to store the Chart instance

    useEffect(() => {
        const caseData = caseList.map((item) => item.Ccase);
        const monthData = caseList.map((item) => monthNames[item.month - 1]);

        const ctx = chartRef.current.getContext("2d");

        // Check if there is an existing Chart instance and destroy it
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Generate random colors for each bar
        const backgroundColors = Array.from({ length: caseData.length }, () => {
            const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
            return randomColor;
        });

        // Create a new Chart instance
        chartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: monthData,
                datasets: [
                    {
                        label: "จำนวนเคส",
                        data: caseData,
                        backgroundColor: backgroundColors,
                        borderColor: backgroundColors.map(color => color.replace('0.2', '1')),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: "category",
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // Clean up the Chart instance when the component is unmounted
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [caseList]);

    return (
        <div className="w-full h-96 p-4 bg-white rounded shadow">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default GraphCaseComponent;
