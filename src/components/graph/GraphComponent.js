import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";

const GraphComponent = ({ statementList }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null); // Use a ref to store the Chart instance

    useEffect(() => {

        const labels = statementList.map((item) => {
            const dateObject = new Date(item.time);
            const year = dateObject.getUTCFullYear();
            const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = dateObject.getUTCDate().toString().padStart(2, '0');
            const hours = dateObject.getUTCHours().toString().padStart(2, '0');
            const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
        
            return `${year}-${month}-${day} ${hours}:${minutes} `;
        });
        const values = statementList.map((item) => parseFloat(item.value));

        const ctx = chartRef.current.getContext("2d");

        // Check if there is an existing Chart instance and destroy it
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create a new Chart instance
        chartInstance.current = new Chart(ctx, {
            type: "bar", // Change the chart type to "bar"
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "ค่าใช้จ่าย",
                        data: values,
                        backgroundColor: "rgba(75, 192, 192, 0.2)", // Set a background color for the bars
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: "category", // Use "category" scale for labels in a bar chart
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
    }, [statementList]);

    return (
        <div className="w-full h-96 p-4 bg-white rounded shadow">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default GraphComponent;
