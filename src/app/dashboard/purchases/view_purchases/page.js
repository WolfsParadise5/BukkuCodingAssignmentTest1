'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ViewPurchasePage = () => {
  // Initialize all components
  const [data, setData] = useState([]);
  const router = useRouter();

  // Function to load data from localStorage
  const loadFromLocalStorage = () => {
    const purchase_data = localStorage.getItem("purchase_data");
    if (purchase_data) {
      setData(JSON.parse(purchase_data));
    }
  };

  // Handle page route
  const add_purchase_routing = () => {
    router.push("/dashboard/purchases/add_purchase");
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  return (
    <div>
      <h1>Purchases</h1>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Cost (RM)</th>
            <th>Total Cost (RM)</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.transaction_no}>
                <td>{item.transaction_no}</td>
                <td>{item.date}</td>
                <td>{item.quantity}</td>
                <td>{item.cost}</td>
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
      <button onClick={add_purchase_routing} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "darkgreen" }}>
      Add Purchase Entry
      </button>
    </div>
  );
};

export default ViewPurchasePage;
