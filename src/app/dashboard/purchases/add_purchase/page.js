'use client'
import { useState, useEffect } from "react";

const AddPurchasePage = () => {
  const [formData, setFormData] = useState({
    transaction_no: "",
    date: "",
    quanity: "",
    cost: "",
    total_cost: ""
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Load data from localStorage when the component mounts
    const storedData = localStorage.getItem("formData");
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
    if (!formData.quanity) {

    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateFinalCost = () => {
    formData.total_cost = formData.cost * formData.quanity
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {

      const updatedData = [...submittedData, formData];
      setSubmittedData(updatedData);

      // Store the data in localStorage
      localStorage.setItem("formData", JSON.stringify(updatedData));

      // Reset the form
      setFormData({
        transaction_no: "",
        date: "",
        quanity: "",
        cost: "",
        total_cost: ""
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
            value={formData.quanity}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>{errors.quanity}</p>
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
              <th>Name</th>
              <th>Age</th>
              <th>Date</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.date}</td>
                <td>{item.cost}</td>
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
