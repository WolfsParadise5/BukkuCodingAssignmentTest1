'use client'
import { useState, useEffect } from "react";

const AddPurchasePage = () => {
  const [formData, setFormData] = useState({
    transaction_no: "",
    date: "",
    quantity: "",
    cost: "",
    total_cost: ""
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Load data from localStorage when the component mounts
    const storedData = localStorage.getItem("purchase_data");
    if (storedData) {
      setSubmittedData(JSON.parse(storedData));
    }
  }, []);

  const validate = () => {
    const newErrors = {};

    // Transaction no. validation
    if (!formData.transaction_no) {

    }
    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required.";
    } else if (new Date(formData.date) < new Date("1971-01-01") || new Date(formData.date) > new Date()) {
      newErrors.date = "Date must be between January 1, 1971, and today.";
    }

    // Cost validation
    if (!formData.cost) {
      newErrors.cost = "Cost is required.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.cost)) {
      newErrors.cost = "Cost must be a valid number with up to 2 decimal places.";
    }

    //Quantity validation
    function safeConvertToNumber(input) {
      const num = Number(input);
      return isNaN(num) ? null : num;
    }
    let testQuantity = formData.quantity;
    testQuantity = safeConvertToNumber(testQuantity);
    if (!testQuantity) {
      newErrors.quantity = "quantity is required and must be a number.";
    } else {
        // Checks all extra conditions
        const isQuantityValid = [
        { check: () => Number.isInteger(testQuantity), message: 'Quantity must be an integer.' },
        { check: () => testQuantity >= 0, message: 'Quantity must be a non-negative number.' }
      ];

      for (const { check, message } of isQuantityValid) {
        // Return this first error for the variable, as errors are designed in common order ( top to bottom )
        if (!check()) {
          newErrors.quantity = message
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const calculateFinalCost = (cost, quantity) => {
    // Calculate total cost to two decimal places
    const result = parseFloat((parseFloat(cost) * parseInt(quantity)).toFixed(2));
    return result
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (validate()) {
      // Create an updated formData object with total_cost
      const updatedFormData = {
        ...formData,
        total_cost: calculateFinalCost(formData.cost, formData.quantity),
      };
  
      // Update submittedData and save to localStorage
      const updatedData = [...submittedData, updatedFormData];
      setSubmittedData(updatedData);
      localStorage.setItem("purchase_data", JSON.stringify(updatedData));
  
      // Retrieve existing totals from localStorage
      const existingTotalCost = parseFloat(localStorage.getItem('total_cost')) || 0;
      const existingTotalQuantity = parseInt(localStorage.getItem('total_quantity')) || 0;
  
      // Update and save total cost and quantity
      const updatedTotalCost = parseFloat((existingTotalCost + updatedFormData.total_cost).toFixed(2));
      const updatedTotalQuantity = existingTotalQuantity + parseInt(updatedFormData.quantity);
  
      localStorage.setItem('total_cost', updatedTotalCost.toString());
      localStorage.setItem('total_quantity', updatedTotalQuantity.toString());
  
      // Reset the form
      setFormData({
        transaction_no: "",
        date: "",
        quantity: "", // Fixed typo here
        cost: "",
        total_cost: "",
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
      <h1>Form Without Plugins</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Transaction No.: </label>
          <input
            type="text"
            name="transaction_no"
            value={formData.transaction_no}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>{errors.transaction_no}</p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Date: </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={today}
            min="1971-01-01"
          />
          <p style={{ color: "red" }}>{errors.date}</p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Quantity: </label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>{errors.quantity}</p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Cost: </label>
          <input
            type="text"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>{errors.cost}</p>
        </div>
        <button type="submit" style={{ backgroundColor: "darkgreen" }}>Submit</button>
      </form>

      <h2>Submitted Data</h2>
      {submittedData.length > 0 ? (
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Transaction No.</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Cost</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((item, index) => (
              <tr key={index}>
                <td>{item.transaction_no}</td>
                <td>{item.quantity}</td>
                <td>{item.date}</td>
                <td>{item.cost}</td>
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

export default AddPurchasePage;
