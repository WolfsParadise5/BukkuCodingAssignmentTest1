'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MainPage = () => {
    const router = useRouter();

    // States for storing localStorage values
    const [totalQuantity, setTotalQuantity] = useState(null);
    const [totalCost, setTotalCost] = useState(null);

    // Fetch data from localStorage on client side
    useEffect(() => {
        if (typeof window !== "undefined") {
            const quantity = parseInt(localStorage.getItem("total_quantity") || "0", 10);
            const cost = parseFloat(localStorage.getItem("total_cost") || "0");
            setTotalQuantity(quantity);
            setTotalCost(cost);
        }
    }, []);

    // Calculate Weighted Average Cost (WAC)
    const calculateWAC = (quantity, totalCost) => {
        if (quantity > 0 && totalCost > 0) {
            return (totalCost / quantity).toFixed(2);
        }
        return "0.00";
    };

    // Handle routing
    const routeToPage = (pageToRoute) => {
        router.push(pageToRoute);
    };

    // Ensure we only render when data is ready
    const isDataLoaded = totalQuantity !== null && totalCost !== null;

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Welcome to the Basic Accounting Page!</h1>
            {isDataLoaded ? (
                <div className="status_data" style={{ marginBottom: "20px" }}>
                    <h2>Total Quantity: {totalQuantity}</h2>
                    <h2>Total Amount(RM): {totalCost.toFixed(2)}</h2>
                    <h2>Weighted Average Cost (WAC) in RM: {calculateWAC(totalQuantity, totalCost)}</h2>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
            <div
                className="button_options"
                style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
                <button
                    onClick={() => routeToPage("/dashboard/purchases/view_purchases")}
                    style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "darkgreen" }}
                >
                    Manage Purchases
                </button>
                <button
                    onClick={() => routeToPage("/dashboard/sales/view_sales")}
                    style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "darkgreen" }}
                >
                    Manage Sales
                </button>
            </div>
        </div>
    );
};

export default MainPage;
