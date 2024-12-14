'use client';

import { useRouter } from "next/navigation";

const MainPage = () => {
    // Initialize the router
    const router = useRouter();

    // Function to route to a specific page
    const routeToPage = (pageToRoute) => {
        router.push(pageToRoute);
    };

    const calculateWAC = (quantity, cost) => {
        return parseFloat((parseFloat(cost) / parseInt(quantity)).toFixed(2))
    };

    // Return the JSX
    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Welcome to the Basic Accounting Page!</h1>
            <div className="status_data" style={{ marginBottom: "20px" }}>
                <h2>Total Quantity: {localStorage.getItem('total_quantity') || 0}</h2>
                <h2>Total Cost(RM): {localStorage.getItem('total_cost') || 0}</h2>
                <h2>Weighted Average Cost(WAC): {calculateWAC(localStorage.getItem('total_quantity'),localStorage.getItem('total_cost')) || 0}</h2>
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
