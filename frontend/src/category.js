import { useContext, useEffect, useRef, useState } from "react"
import { Context } from "./usecontext"
import { Link, Navigate } from "react-router-dom"
import Swal from "sweetalert2"
import { SEO } from "./SEO"
import { API_BASE } from "./apiConfig"

export const Category = () => {
  const [name, setname] = useState("")
  const [img, setimg] = useState(null)
  const [brandname, setbrandname] = useState("")
  const [brandimg, setbrandimg] = useState(null)
  const [category, setcategory] = useState('')
  const { utype } = useContext(Context)
  const [d, setd] = useState([])
  const [saving, setsaving] = useState("")
  const categoryFileRef = useRef(null)
  const brandFileRef = useRef(null)
  const isAdminOrVendor = utype === "admin" || utype === "Vendor"
  // App restores the saved login after the first render, so wait one render before redirecting
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    if (isAdminOrVendor) show()
  }, [isAdminOrVendor])

  const add = async (e) => {
    e.preventDefault()
    if (!name.trim() || !img) {
      Swal.fire("Missing details", "Enter a category name and choose an image.", "info")
      return
    }
    setsaving("category")
    try {
      const formdata = new FormData()
      formdata.append("name", name.trim())
      formdata.append("pic", img)
      const result = await fetch(`${API_BASE}/api/category`, {
        method: "post",
        body: formdata
      })
      const res = await result.json().catch(() => ({}))
      if (result.ok && res.statuscode === 1) {
        Swal.fire("Success", "Category added successfully", "success")
        setname("")
        setimg(null)
        if (categoryFileRef.current) categoryFileRef.current.value = ""
        show()
      } else {
        Swal.fire("Error", res.message || "Failed to add category", "error")
      }
    } catch (err) {
      console.error("Failed to add category:", err)
      Swal.fire("Error", "Server error adding category", "error")
    } finally {
      setsaving("")
    }
  }

  const add2 = async (e) => {
    e.preventDefault()
    if (!brandname.trim() || !category || !brandimg) {
      Swal.fire("Missing details", "Enter a brand name, pick a category and choose an image.", "info")
      return
    }
    setsaving("brand")
    try {
      const formdata2 = new FormData()
      formdata2.append("brandname", brandname.trim())
      formdata2.append("pic", brandimg)
      formdata2.append("category", category)
      const result = await fetch(`${API_BASE}/api/brand`, {
        method: "post",
        body: formdata2,
      })
      const res = await result.json().catch(() => ({}))
      if (result.ok && res.statuscode === 1) {
        Swal.fire("Success", "Brand added successfully", "success")
        setbrandname("")
        setbrandimg(null)
        setcategory("")
        if (brandFileRef.current) brandFileRef.current.value = ""
      } else {
        Swal.fire("Error", res.message || "Failed to add brand", "error")
      }
    } catch (err) {
      console.error("Failed to add brand:", err)
      Swal.fire("Error", "Server error adding brand", "error")
    } finally {
      setsaving("")
    }
  }

  const show = async () => {
    try {
      const result = await fetch(`${API_BASE}/api/getcategory`, {
        method: "get"
      })
      if (result.ok) {
        const res = await result.json()
        if (res.statuscode === 1 && Array.isArray(res.data)) {
          setd(res.data)
        } else {
          setd([])
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err)
      setd([])
    }
  }


  return (
  <>
  <SEO
    title="Browse Categories - Electronics & Gadgets"
    description="Shop electronics by category: smartphones, laptops, smart TVs, audio, gaming, and wearables on ElectoMart."
    keywords="electronics categories, buy laptops by brand, smartphones category, audio devices, smart wearables"
  />
  {
    isAdminOrVendor ?   <>
      <section className="s-page-title d-flex align-items-center justify-content-center text-center">
        <div className="container-fluid bread">
          <div className="content">
            <h1 className="title-page">Category</h1>

            <ul className="breadcrumbs-page list-unstyled d-flex justify-content-center align-items-center gap-2 py-3">
              <li>
                <Link to="/" className="h6 link text-decoration-none">
                  Home
                </Link>
              </li>

              <li>
                <span>{">"}</span>
              </li>

              <li>
                <h6 className="current-page fw-normal mb-0">
                  Category
                </h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <div className="container p-5">
          <div className="row">

            <div className="col-md-6 mt-3">
              <h1>Add Category</h1>
              <form onSubmit={add}>
                <div>
                  <label htmlFor="category-name" className="form-label">Category name</label>
                  <input id="category-name" type="text" className="form-control" value={name} placeholder="e.g. Laptops" required onChange={(e) => setname(e.target.value)}></input>
                </div>
                <div>
                  <label htmlFor="category-image" className="form-label mt-3">Category image</label>
                  <input id="category-image" ref={categoryFileRef} type="file" accept="image/*" className="form-control" required onChange={(e) => setimg(e.target.files[0] || null)}></input>
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={saving === "category"}>{saving === "category" ? "Adding..." : "Add Category"}</button>
              </form>
            </div>
            <div className="col-md-6 mt-3">
              <h1>Add Brand</h1>
              <form onSubmit={add2}>
                <div>
                  <label htmlFor="brand-name" className="form-label">Brand name</label>
                  <input id="brand-name" type="text" className="form-control" value={brandname} placeholder="e.g. Samsung" required onChange={(e) => setbrandname(e.target.value)}></input>
                </div>
                <label htmlFor="brand-category" className="form-label mt-3">Category</label>
                <select id="brand-category" className="form-select" value={category} required onChange={(e) => setcategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {
                    d.map((a) =>
                      <option key={a._id} value={a._id}>{a.Name}</option>
                    )
                  }
                </select>
                <div>
                  <label htmlFor="brand-image" className="form-label mt-3">Brand image</label>
                  <input id="brand-image" ref={brandFileRef} type="file" accept="image/*" className="form-control" required onChange={(e) => setbrandimg(e.target.files[0] || null)}></input>
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={saving === "brand"}>{saving === "brand" ? "Adding..." : "Add Brand"}</button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </> : authChecked ? <Navigate to="/" replace /> : null
  }
  </>
  )
}
