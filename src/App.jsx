import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    quantity: "",
    image: null,
  });

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  // Categories
  const categories = ["dhall", "oil", "spices", "masala", "snacks", "biscuts"];

  // Quantity options
  const dhallQty = ["1kg", "1/2kg", "1/4kg", "1/3kg"];
  const spiceQty = ["25g", "50g", "100g", "250g", "500g", "1kg"];
  const oilQty = ["1/2 litre", "1 litre", "2 litre", "5 litre", "tin"];

  // Brand options
  const brandOptions = {
    oil: ["SVS", "Gold Winner", "Ruchi"],
    biscuts: ["Milk Bikis", "Marie Gold", "Good Day"],
    dhall: ["Aashirvaad", "Fortune", "Tata Sampann"],
    spices: ["MDH", "Everest", "Catch"],
    masala: ["MDH", "Everest", "Aachi"],
    snacks: ["Haldiram", "Bingo", "Lays"],
  };

  // Product names
  const dhallNames = ["Toor Dal", "Moong Dal", "Urad Dal"];
  const spiceNames = ["Turmeric Powder", "Chili Powder"];
  const masalaNames = ["Sambar Masala", "Rasam Masala"];
  const snackNames = ["Lays Chips", "Kurkure"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const getQuantityOptions = () => {
    if (form.category === "dhall") return dhallQty;
    if (["spices", "masala"].includes(form.category)) return spiceQty;
    if (form.category === "oil") return oilQty;
    return [];
  };

  const getBrandOptions = () => {
    return brandOptions[form.category] || [];
  };

  const getNameOptions = () => {
    switch (form.category) {
      case "dhall":
        return dhallNames;
      case "spices":
        return spiceNames;
      case "masala":
        return masalaNames;
      case "snacks":
        return snackNames;
      default:
        return [];
    }
  };

  // Load products
  const loadProducts = async (category) => {
    if (!category) return setProducts([]);
    const res = await fetch(`${API_URL}/products/${category}`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    if (form.category) loadProducts(form.category);

    if (form.category === "biscuts") {
      setForm((p) => ({ ...p, name: "", quantity: "" }));
    }
  }, [form.category]);

  const submitProduct = async () => {
    if (
      !form.category ||
      !form.brand ||
      !form.price ||
      (form.category !== "biscuts" && !form.name) ||
      (!["biscuts", "snacks"].includes(form.category) && !form.quantity)
    ) {
      return alert("Please fill all required fields");
    }

    const formData = new FormData();
    Object.keys(form).forEach((k) => {
      if (form[k] !== null) formData.append(k, form[k]);
    });

    const url = editId
      ? `${API_URL}/product/${form.category}/${editId}`
      : `${API_URL}/product`;

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      body: formData,
    });

    alert("Product saved");
    setEditId(null);
    setForm({
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity: "",
      image: null,
    });

    if (form.category) loadProducts(form.category);
  };

  const startEdit = (p) => {
    setForm({
      name: p.name || "",
      brand: p.brand,
      category: p.category,
      price: p.price,
      quantity: p.quantity || "",
      image: null,
    });
    setEditId(p._id);
  };

  return (
    <div className="container mt-4">
      <h3>{editId ? "Update Product" : "Add Product"}</h3>

      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <select
              className="form-select"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {form.category !== "biscuts" && (
            <div className="col-md-4">
              <select
                className="form-select"
                name="name"
                value={form.name}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                {getNameOptions().map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-4">
            <select
              className="form-select"
              name="brand"
              value={form.brand}
              onChange={handleChange}
            >
              <option value="">Select Brand</option>
              {getBrandOptions().map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {form.category &&
            !["biscuts", "snacks"].includes(form.category) && (
              <div className="col-md-4">
                <select
                  className="form-select"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                >
                  <option value="">Select Quantity</option>
                  {getQuantityOptions().map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            )}

          <div className="col-md-4">
            <input
              className="form-control"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input type="file" className="form-control" onChange={handleImage} />
          </div>

          <div className="col-md-12">
            <button className="btn btn-primary" onClick={submitProduct}>
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <h4>Products</h4>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-3" key={p._id}>
            <div className="card mb-3">
              <div className="card-body">
                <h6>{p.name || p.brand}</h6>
                <p>{p.brand}</p>
                {p.quantity && <p>{p.quantity}</p>}
                <strong>₹{p.price}</strong>
                <button
                  className="btn btn-sm btn-warning mt-2"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
