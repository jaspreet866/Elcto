import { useContext, useEffect, useState } from "react"
import { Context } from "./usecontext"
import { useNavigate } from "react-router-dom"



export const Category = () => {
  const [name, setname] = useState("")
  const [img, setimg] = useState("")
  const [brandname, setbrandname] = useState("")
  const [brandimg, setbrandimg] = useState("")
  const [category, setcategory] = useState('')
  const{utype}=useContext(Context)
  const navigate=useNavigate()
  const [d, setd] = useState([])

  useEffect(() => {
    show()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append("name", name)
    formdata.append("pic", img)
    const result = await fetch("http://localhost:8000/api/category", {
      method: "post",
      body: formdata
    })
    if (result.ok) {
      const res = await result.json()
      if (res.statuscode === 1) {
        alert("added")
      }
      else {
        alert("not")
      }
    }

  }
  const add2 = async () => {
    const formdata2 = new FormData()
    formdata2.append("brandname", brandname)
    formdata2.append("pic", brandimg)
    formdata2.append("category", category)
    const result = await fetch("https://elcto-1.onrender.com/api/brand", {
      method: "post",
      body: formdata2,
    })
    if (result.ok) {
      const res = result.json()
      if (res.statuscode === 1) {
        alert("added")
      }
      else {
        alert("onot")
      }
    }
  }
  const show = async () => {
    const result = await fetch("https://elcto-1.onrender.com/api/getcategory", {
      method: "get"
    })
    if (result.ok) {
      const res = await result.json()
      if (res.statuscode === 1) {
      
        setd(res.data)
      }
      else {
        alert("rr")
      }
    }
  }


  return (
  <>
  {
    utype === "admin" ?   <>
      <section className="s-page-title d-flex align-items-center justify-content-center text-center">
        <div className="container-fluid bread">
          <div className="content">
            <h1 className="title-page">Category</h1>

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

            <div className="col mt-3">
              <h1>Add Category</h1>
              <form>
                <div>
                  <input type="text" className="form-control" onChange={(e) => setname(e.target.value)}></input>
                </div>
                <div>
                  <input type="file" className="form-control mt-3" onChange={(e) => setimg(e.target.files[0])}></input>
                </div>
                <button className="btn btn-primary mt-3" onClick={add}>Add Category</button>
              </form>
            </div>
            <div className="col mt-3">
              <h1>Add Brand</h1>
              <form>
                <div>
                  <input type="text" className="form-control" onChange={(e) => setbrandname(e.target.value)}></input>
                </div>
                <select className="form-select mt-3" aria-label="Default select example " onChange={(e) => setcategory(e.target.value)}>
                  <option>Select Category</option>
                  {
                    d.map((a) =>
                      <option value={a._id}>{a.Name}</option>
                    )
                  }
                </select>
                <div>
                  <input type="file" className="form-control mt-3" onChange={(e) => setbrandimg(e.target.files[0])}></input>
                </div>
                <button className="btn btn-primary mt-3" onClick={add2}>Add Brand</button>
              </form>
            </div>
          </div>
        </div>
      </section>





    </>:navigate("/")
  }
  </>
  )
}