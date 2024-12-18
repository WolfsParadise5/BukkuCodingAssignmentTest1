'use client';

import { useState, useEffect } from "react";

export default function AddSale() {
    // Initialize variables
    const [formData, setFormData] = useState({
      date: "",
      transaction_id: "",
      quantity: "",
      price_per_unit: "",
      total_amount: 0,
      total_cost: 0
    });
    const [errors, setErrors] = useState({});
    const [latestDate, setLatestDate] = useState("");
    const [submittedData, setSubmittedData] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    const [existingQuantity, setExistingQuantity] = useState(0);
    const [existingTotalCost, setExistingTotalCost] = useState(0);

    useEffect(() => {
        const storedQuantity = localStorage.getItem('total_quantity');
        const storedTotalCost = localStorage.getItem("total_cost");
         // Fetch existing localStorage values
        const storedLatestDate = localStorage.getItem("latest_date");

        setExistingQuantity(storedQuantity ? parseInt(storedQuantity) : 0);
        setExistingTotalCost(storedTotalCost ? parseFloat(storedTotalCost) : 0);
        setLatestDate(storedLatestDate);

        const storedData = localStorage.getItem("sales_data");
        if (storedData) {
          setSubmittedData(JSON.parse(storedData));
        }
    }, []);

    // To set the latest date into localStorage
    const updateLatestDate = (newDate) => {
      // Parse the newDate and add 1 day
      let updatedDate = new Date(newDate);
      updatedDate.setDate(updatedDate.getDate() + 1);
  
      // Convert updatedDate back to a string if necessary (e.g., ISO format)
      let updatedDateString = updatedDate.toISOString().split('T')[0]; // Example format: "YYYY-MM-DD"
  
      // Compare and update the latestDate if necessary
      if (!latestDate || new Date(updatedDateString) > new Date(latestDate)) {
          localStorage.setItem("latest_date", updatedDateString);
          setLatestDate(updatedDateString);
      }
    };
    // Calculate weighted cost average ( for cost calculation purposes )
    const calculateWAC = (total_cost, quantity) => {
      if (quantity && total_cost) {
          return parseFloat((parseFloat(total_cost) / parseInt(quantity)).toFixed(2));
      }
      return 0;
    };

    // Validates data in the form
    const validate = () => {
        const newErrors = {};
        //  Fetch existing sales data from localStorage
        const existingSalesData = JSON.parse(localStorage.getItem("sales_data")) || [];
        // Date validation
        if (!formData.date) {
            newErrors.date = "Date is required.";
        } else if (new Date(formData.date) < new Date(latestDate)+1 || new Date(formData.date) > new Date()) {
            newErrors.date = "Date must be between a previous transaction and today.";
        }

        // Transaction No. validation
        if (!formData.transaction_id) {
            newErrors.transaction_id = "Transaction ID. is required.";
        } else if (!/^[a-zA-Z0-9]+$/.test(formData.transaction_id)) {
            newErrors.transaction_id = "Transaction ID. can only contain numbers and letters.";
        } else if (existingSalesData.some(data => data.transaction_id === formData.transaction_id)) {
          newErrors.transaction_no = "Transaction ID. already exists. Please use a unique value.";
        }

        // Quantity validation
        if (!formData.quantity || isNaN(formData.quantity) || formData.quantity <= 0) {
            newErrors.quantity = "Quantity must be a positive number.";
        } else if (formData.quantity > existingQuantity) {
            newErrors.quantity = "Not enough recorded items in stock. Please adjust accordingly.";
        }

        // Sales Price validation
        if (!formData.price_per_unit || isNaN(formData.price_per_unit) || formData.price_per_unit < 0) {
            newErrors.price_per_unit = "Sales Price must be a number greater than or equal to zero.";
        } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price_per_unit)) {
            newErrors.price_per_unit = "Sales Price must have two decimal places.";
        }

        // Check weighted cost average constraint
        // const totalCost = formData.quantity * formData.price_per_unit;
        // if (existingTotalCost - totalCost < 0) {
        //     newErrors.price_per_unit = "Total cost would exceed available funds. Adjust your values.";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            const totalCost = parseFloat((formData.quantity * formData.price_per_unit).toFixed(2));
            const wac = calculateWAC(localStorage.getItem('total_cost'), localStorage.getItem('total_quantity'));
            const totalCostAmount = parseFloat(wac * parseInt(formData.quantity)).toFixed(2);

            // Update localStorage values
            const updatedQuantity = existingQuantity - formData.quantity;
            const updatedTotalCost = existingTotalCost - totalCost;

            localStorage.setItem('total_quantity', updatedQuantity.toString());
            localStorage.setItem("total_cost", updatedTotalCost.toString());
            
            // Update latest transaction date
            updateLatestDate(formData.date)

            // Add the total cost to formData
            const updatedFormData = {
                ...formData,
                total_amount: totalCost,
                total_cost: totalCostAmount
            };

            // Update submittedData and save to localStorage
            const updatedData = [...submittedData, updatedFormData];
            setSubmittedData(updatedData);

            // Store form data in localStorage
            const salesData = JSON.parse(localStorage.getItem("sales_data")) || [];
            salesData.push(updatedFormData);
            localStorage.setItem("sales_data", JSON.stringify(salesData));

            // Reset form
            setFormData({
              date: "",
              transaction_id: "",
              quantity: "",
              price_per_unit: "",
              total_amount: 0,
              total_cost: 0
            });
            setErrors({});
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Add Sale</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Date: </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        max={today}
                        min={latestDate}
                    />
                    <p style={{ color: "red" }}>{errors.date}</p>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Transaction No. / ID: </label>
                    <input
                        type="text"
                        name="transaction_id"
                        value={formData.transaction_id}
                        onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{errors.transaction_id}</p>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Quantity / No. of Items: </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{errors.quantity}</p>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Sales Price per Unit (RM): </label>
                    <input
                        type="text"
                        name="price_per_unit"
                        value={formData.price_per_unit}
                        onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{errors.price_per_unit}</p>
                </div>
                <button type="submit" style={{ backgroundColor: "darkgreen", padding: "10px 20px" }}>
                    Submit
                </button>
            </form>
            <h2>Submitted Data</h2>
        {submittedData.length > 0 ? (
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
              {submittedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.transaction_id}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price_per_unit}</td>
                  <td>{item.total_amount}</td>
                  <td>{item.total_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data submitted yet.</p>
        )}
        </div>
    );
};

