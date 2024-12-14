'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ViewSalesPage = () => {
  // Initialize all components
  const [data, setData] = useState([]);
  const router = useRouter();

  // Function to load data from localStorage
  const loadFromLocalStorage = () => {
    const purchase_data = localStorage.getItem("sales_data");
    if (purchase_data) {
      setData(JSON.parse(purchase_data));
    }
  };

  // Handle page route
  const add_sale_routing = () => {
    router.push("/dashboard/sales/add_sale");
  };

  useEffect(() => {
    // Just load data from localStorage for now
    loadFromLocalStorage();
  }, []);

  return (
    <div>
      {/* Page Title */}
      <h1>Sales</h1>
      {/* Display table containing data from localStorage */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction No.</th>
            <th>Quantity</th>
            <th>Sales Price per unit (RM)</th>
            <th>Total Amount (RM)</th>
            <th>Total Cost (RM)</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.transaction_id}>
                <td>{item.date}</td>
                <td>{item.transaction_id}</td>
                <td>{item.quantity}</td>
                <td>{item.price_per_unit}</td>
                <td>{item.total_amount}</td>
                <td>{item.total_cost}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Button to register a new item */}
      <button onClick={add_sale_routing} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "darkgreen" }}>
      Add Sale Entry
      </button>
    </div>
  );
};

export default ViewSalesPage;
