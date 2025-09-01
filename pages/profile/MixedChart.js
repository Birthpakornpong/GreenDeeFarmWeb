"use client"; // ใช้ client component สำหรับ Next.js 13+
import React from 'react';
import { CurrencyThai } from 'utils';
import dynamic from "next/dynamic";

// Import ApexChart โดยปิด SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MixedChart = () => {
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
                columnWidth: '50%',
            },
        },
        colors: ["#FF4560", "#FEB019", "#00A396"], // Colors for "Unsuccessful", "Late", "Successful"
        dataLabels: {
            enabled: true,
            enabledOnSeries: [3], // Only show data labels on the line series (index 3)
            style: {
                fontSize: '12px',
            },
            formatter: (val) => `${val.toFixed(1) / 1000}K`,
        },
        stroke: {
            width: [0, 0, 0, 2], // No stroke for bars, smooth line for SLA
            curve: "smooth",
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            labels: {
                style: {
                    fontSize: "14px",
                },
            },
        },
        yaxis: [
            {
                title: {
                    text: "",
                    show: false // Hides the Y-axis title
                },
                labels: {
                    formatter: (val) => `${CurrencyThai(val, 0)}`,
                },
                max: 7000, // Set the maximum value explicitly
            },
        ],
        annotations: {
            points: [
                // Dynamic annotations at the top of each bar
                { x: "Jan", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Feb", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Mar", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Apr", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "May", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Jun", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Jul", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Aug", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Sep", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Oct", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Nov", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
                { x: "Dec", y: 6500, marker: { size: 0 }, label: { text: "99.0%", style: { backgroundColor: "#00A396", color: "#000", fontWeight: 'bold' } } },
            ],
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
            type: 'bar',
            data: [1000, 1000, 900, 1100, 1000, 900, 1000, 1100, 1000, 900, 1000, 1100],
        },
        {
            name: "จัดส่งล่าช้า",
            type: 'bar',
            data: [1800, 1700, 1600, 1900, 1800, 1700, 1600, 1800, 1900, 1800, 1700, 1600],
        },
        {
            name: "จัดส่งสำเร็จ",
            type: 'bar',
            data: [2800, 2700, 2900, 3000, 2800, 2700, 2900, 2800, 3000, 2900, 2800, 2700],
        },
        {
            name: "รวมทั้งหมด",
            type: "line",
            data: [5600, 5400, 5500, 6000, 5600, 5300, 5500, 5700, 5900, 5600, 5500, 5400],
        },
    ];
    return <div style={{ zoom: '100%' }}>
        <Chart options={options} series={series} type="line" height={300} />
    </div>
}

export default MixedChart;
