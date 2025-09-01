"use client"; // ใช้ client component สำหรับ Next.js 13+
import React from 'react';
import { CurrencyThai } from 'utils';
import dynamic from "next/dynamic";

// Import ApexChart โดยปิด SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MixedChartDaily = () => {
    const generateDailyData = (monthlyTotal, days = 31) => {
        let data = [];
        let remaining = monthlyTotal;

        for (let i = 0; i < days; i++) {
            const value =
                i === days - 1
                    ? remaining // Assign the remaining total to the last day
                    : Math.round((Math.random() * (monthlyTotal / days)) * 0.8 + (monthlyTotal / days) * 0.5); // Random value
            data.push(value);
            remaining -= value;
        }

        return data.map((val) => Math.max(0, val)); // Ensure no negative values
    };

    const options = {
        chart: {
            type: "bar",
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
            },
        },
        colors: ["#FF4560", "#FEB019", "#00A396"], // Colors for "Unsuccessful", "Late", "Successful"
        dataLabels: {
            enabled: true,
            enabledOnSeries: [3], // Only show data labels on the line series (index 3)
            style: {
                fontSize: "10px",
            },
            formatter: (val) => `${(val)}`,
        },
        stroke: {
            width: [0, 0, 0, 2], // No stroke for bars, smooth line for SLA
            curve: "smooth",
        },
        xaxis: {
            categories: Array.from({ length: 31 }, (_, i) => i + 1), // Days of the month (1-31)
            labels: {
                style: {
                    fontSize: "10px",
                },
            },
        },
        yaxis: [
            {
                title: {
                    text: "",
                    show: false, // Hides the Y-axis title
                },
                labels: {
                    formatter: (val) => `${CurrencyThai(val, 0)}`,
                },
                max: 1000, // Adjusted maximum value for daily data
            },
        ],
        annotations: {
            points: Array.from({ length: 31 }, (_, i) => ({
                x: (i + 1).toString(),
                y: 220,
                marker: { size: 0 },
                label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: "bold" } },
            })),
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
        legend: {
            position: "top",
        },
    };

    const series = [
        {
            name: "จัดส่งไม่สำเร็จ",
            type: "bar",
            data: generateDailyData(1000), // Generate random daily values for "Unsuccessful"
        },
        {
            name: "จัดส่งล่าช้า",
            type: "bar",
            data: generateDailyData(1800), // Generate random daily values for "Late"
        },
        {
            name: "จัดส่งสำเร็จ",
            type: "bar",
            data: generateDailyData(2800), // Generate random daily values for "Successful"
        },
        {
            name: "รวมทั้งหมด",
            type: "line",
            data: generateDailyData(5600), // Generate random daily values for "Total"
        },
    ];
    return (
        <div style={{ zoom: "100%" }}>
            <Chart options={options} series={series} type="line" height={300} />
        </div>
    );
};

export default MixedChartDaily;
