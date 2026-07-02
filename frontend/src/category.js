import API_URL from "./config";
import { useContext, useEffect, useState } from "react";
import { Context } from "./usecontext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Category = () => {
  const [name, setname] = useState("");
  const [img, setimg] = useState("");
  const [brandname, setbrandname] = useState("");
  const [brandimg, setbrandimg] = useState("");
  const [category, setcategory] = useState("");
  const { utype } = useContext(Context);
  const navigate = useNavigate();
  const [d, setd] = useState([]);

  useEffect(() => {
    if (utype !== "admin") {
      navigate("/");
    } else {
      show();
    }
  }, [utype, navigate]);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire("Validation Error", "Category name is required", "error");
      return;
    }
    if (!img) {
      Swal.fire("Validation Error", "Category image is required", "error");
      return;
    }

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("pic", img);

    try {
      const result = await fetch(`${API_URL}/api/category`, {
        method: "post",
        body: formdata,
      });

      if (result.ok) {
        const res = await result.json();
        if (res.statuscode === 1) {
          Swal.fire("Success", "Category added successfully!", "success");
          setname("");
          setimg("");
          show();
        } else {
          Swal.fire("Error", "Failed to add category", "error");
        }
      } else {
        Swal.fire("Error", "Server returned an error status code", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const add2 = async (e) => {
    e.preventDefault();
    if (!brandname.trim()) {
      Swal.fire("Validation Error", "Brand name is required", "error");
      return;
    }
    if (!category || category === "Select Category") {
      Swal.fire("Validation Error", "Please select a valid Category", "error");
      return;
    }
    if (!brandimg) {
      Swal.fire("Validation Error", "Brand logo/image is required", "error");
      return;
    }

    const formdata2 = new FormData();
    formdata2.append("brandname", brandname);
    formdata2.append("pic", brandimg);
    formdata2.append("category", category);

    try {
      const result = await fetch(`${API_URL}/api/brand`, {
        method: "post",
        body: formdata2,
      });

      if (result.ok) {
        const res = await result.json();
        if (res.statuscode === 1) {
          Swal.fire("Success", "Brand added successfully!", "success");
          setbrandname("");
          setbrandimg("");
          setcategory("");
        } else {
          Swal.fire("Error", "Failed to add brand", "error");
        }
      } else {
        Swal.fire("Error", "Server returned an error status code", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const show = async () => {
    try {
      const result = await fetch(`${API_URL}/api/getcategory`, {
        method: "get",
      });
      if (result.ok) {
        const res = await result.json();
        if (res.statuscode === 1) {
          setd(res.data);
        } else {
          Swal.fire("Error", "Failed to fetch categories", "error");
        }
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  if (utype !== "admin") {
    return null;
  }

  return (
    <>
      <section className="s-page-title d-flex align-items-center justify-content-center text-center">
        <div className="container-fluid bread">
          <div className="content">
            <h1 className="title-page">Category Management</h1>

            <ul className="breadcrumbs-page list-unstyled d-flex justify-content-center align-items-center gap-2 py-3">
              <li>
                <a href="/" className="h6 link text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <span>{">"}</span>
              </li>
              <li>
                <h6 className="current-page fw-normal mb-0">Category & Brand</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
                <h2 className="fw-bold mb-4 text-primary">Add Category</h2>
                <form onSubmit={add}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category Name</label>
                    <input
                      type="text"
                      className="form-control rounded-pill px-3 py-2"
                      value={name}
                      placeholder="e.g. Smart Watches"
                      onChange={(e) => setname(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Category Image</label>
                    <input
                      type="file"
                      className="form-control rounded-pill px-3 py-2"
                      onChange={(e) => setimg(e.target.files[0])}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold">
                    Add Category
                  </button>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
                <h2 className="fw-bold mb-4 text-primary">Add Brand</h2>
                <form onSubmit={add2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Brand Name</label>
                    <input
                      type="text"
                      className="form-control rounded-pill px-3 py-2"
                      value={brandname}
                      placeholder="e.g. Samsung"
                      onChange={(e) => setbrandname(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select rounded-pill px-3 py-2"
                      value={category}
                      onChange={(e) => setcategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {d.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Brand Image</label>
                    <input
                      type="file"
                      className="form-control rounded-pill px-3 py-2"
                      onChange={(e) => setbrandimg(e.target.files[0])}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold">
                    Add Brand
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
