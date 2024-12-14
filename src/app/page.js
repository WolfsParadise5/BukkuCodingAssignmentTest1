'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MainPage = () => {
    // Initialize the router
    const router = useRouter();

    // State for storing localStorage values
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    // Function to route to a specific page
    const routeToPage = (pageToRoute) => {
        router.push(pageToRoute);
    };

    const calculateWAC = (quantity, price_per_unit) => {
        if (quantity && price_per_unit) {
            return parseFloat((parseFloat(price_per_unit) / parseInt(quantity)).toFixed(2));
        }
        return 0;
    };

    // Fetch data from localStorage on client-side
    useEffect(() => {
        if (typeof window !== "undefined" && localStorage) {
            setTotalQuantity(localStorage.getItem('total_quantity') || 0);
            setTotalCost(localStorage.getItem('total_cost') || 0);
        }
    }, []);

    // Return the JSX
    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Welcome to the Basic Accounting Page!</h1>
            <div className="status_data" style={{ marginBottom: "20px" }}>
                <h2>Total Quantity: {totalQuantity}</h2>
                <h2>Total Cost(RM): {totalCost}</h2>
                <h2>Weighted Average Cost(WAC): {calculateWAC(totalQuantity, totalCost)}</h2>
            </div>
            <div className="button_options" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                    onClick={() => routeToPage('/dashboard/purchases/view_purchases')}
                    style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "darkgreen" }}
                >
                    Manage Purchases
                </button>
                <button
                    onClick={() => routeToPage('/dashboard/sales/view_sales')}
                    style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "darkgreen" }}
                >
                    Manage Sales
                </button>
            </div>
        </div>
    );
};

export default MainPage;