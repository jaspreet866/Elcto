import { useContext, useEffect, useState } from "react"

import { Chart as ChartJs, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from "chart.js"
import { Bar, Pie, Line } from 'react-chartjs-2'
import { Context } from "./usecontext";
import { useNavigate } from "react-router-dom";


ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    Tooltip,
    Legend,
    Title

);

export const Dashboard = () => {

    const [d, setd] = useState([])
    const [order, setorderdata] = useState([])
    const [users, setuser] = useState("")
    const [length, setlength] = useState("")
    const [totalorder, settotalorder] = useState("")
    const [brand, setbrand] = useState("")
    const [prolength, setprolength] = useState("")
    const [totaladmin, setadmin] = useState(0)
    const [ondelivery, setondelivery] = useState(0)
    const [bycredit, setcredit] = useState(0)
    const [saledata, setsaledata] = useState(0)
    const [total, settotal] = useState("")
    const {utype}=useContext(Context)
    const navigate=useNavigate()

    const [monthlyData, setMonthlyData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        fetch("http://localhost:8000/api/sales/monthly")
            .then(res => res.json())
            .then(data => {
                setMonthlyData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: "Monthly Sales",
                            data: data.values,
                            borderColor: "green",
                            tension: 0.1
                        }
                    ]
                });
            });
    }, []);


    useEffect(() => {
        show();
        show2();
        show3();
        show4();
        show5()

    }, [])

    const show = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/users", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)
                setuser(res.data.length)
                const admin = res.data.filter((a) => a.UserType === "admin")
                setadmin(admin.length)
            }
            else {
                alert("error")
            }
        }
    }
    const show2 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/getcategory", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setlength(res.data.length)
            }
            else {
                alert("sfdf")
            }
        }
    }
    const show3 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/getproduct", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setprolength(res.data.length)
            }
            else {
                alert("error")
            }
        }
    }
    const show4 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/showbrand", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setbrand(res.data.length)
            }
            else {
                alert("error")
            }
        }
    }



    const bardata = {
        labels: ["UserData"],
        datasets: [
            {
                label: "Users",
                data: [users],
                backgroundColor:

                    "rgba(13,110,253,0.7)"
                ,
                barThickness: 50
            },
            {
                label: "Admin",
                data: [totaladmin],
                backgroundColor: "red",
                barThickness: 50
            }
        ]
    }
    const piedata = {
        labels: ["Orders", "Cash On Delivery", "By Card"],
        datasets: [
            {
                label: "TotalOrder",
                data: [totalorder, ondelivery, bycredit],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                categoryPercentage: 0.6,
                barPercentage: 0.5,
            },
        },
    };

    const show5 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/orderdata", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setorderdata(res.data)
                settotalorder(res.data.length)
                const bycash = res.data.filter((a) => a.Payment === "Cash on Delivery")
                const bycard = res.data.filter((a) => a.Payment === "Credit Card")
                const sale = res.data.filter((a) => a.Date === "xfdg")
                setsaledata(sale)
                setondelivery(bycash.length)
                setcredit(bycard.length)


            }
            else {
                alert("df")
            }
        }
    }


    return (
      <>
      {
        utype==="admin"?  <>
            <div className="container-fluid">
                <div className="row">


                    <div className="col-lg-3 col-md-4 bg-light min-vh-100 p-4 sticky-top">
                        <h4 className="fw-bold mb-4">Dashboard</h4>
                        <ul className="nav flex-column gap-3 ">
                            <li className="nav-item">
                                <a href="#orders" className="nav-link text-dark fw-semibold">
                                    📦 Orders
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#users" className="nav-link text-dark fw-semibold">
                                    👤 Users
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#products" className="nav-link text-dark fw-semibold">
                                    🛒 Products
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#categories" className="nav-link text-dark fw-semibold">
                                    🗂 Categories
                                </a>
                            </li>
                        </ul>
                    </div>


                    <div className="col-lg-9 col-md-8 p-4">


                        <div className="row g-3 mb-4" id="categories">
                            <div className="col-md-3">
                                <div className="card w-100 shadow-sm bg-primary text-white">
                                    <div className="card-body">
                                        <h6>  🗂  Categories</h6>
                                        <h4>{length}</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="card w-100 shadow-sm bg-success text-white">
                                    <div className="card-body">
                                        <h6>  🛒  Products</h6>
                                        <h4>{prolength}</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="card w-100 shadow-sm bg-warning text-white">
                                    <div className="card-body">
                                        <h6> 👤 Users</h6>
                                        <h4>{users}</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="card w-100 shadow-sm bg-dark text-white">
                                    <div className="card-body">
                                        <h6>Brands</h6>
                                        <h4>{brand}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card w-100 shadow-sm bg-dark text-white">
                                    <div className="card-body">
                                        <h6>Orders</h6>
                                        <h4>{totalorder}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-3 ">

                            <div className="" style={{ width: "50%", height: "500px" }}>
                                <h1>Users</h1>
                                <Bar data={bardata} options={options} />
                            </div>
                            <div className="" style={{ width: "50%", height: "500px" }}>
                                <h1>Orders</h1>
                                <Pie data={piedata} options={options} />
                            </div>
                        </div>
                        <div className="border" style={{ marginTop: "100px" }}>
                            <h1 className="mt-2">Sales</h1>
                            <div className="mt-3">
                                <Line data={monthlyData} />
                            </div>
                        </div>
                        <div className="card w-100 shadow-sm border-top-2 mt-5" id="orders">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">Order</h5>
                                <span className="badge bg-primary">Orders:{totalorder}</span>
                            </div>

                            <div className="accordion" id="ordersAccordion">

                                {order.map((order, i) => (

                                    <div className="accordion-item mb-3 shadow-sm" key={order._id}>                            
                                        <h2 className="accordion-header">
                                            <button
                                                className={`accordion-button `}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#order${order._id}`}
                                            >
                                                <div className="w-100 d-flex justify-content-between pe-3">
                                                    <span>Order #{order.OrderNo}</span>
                                                    <strong>{order.FirstName}</strong>
                                                </div>

                                            </button>
                                        </h2>                                
                                        <div
                                            id={`order${order._id}`}
                                            className={`accordion-collapse collapse `}
                                            data-bs-parent="#ordersAccordion"
                                        >
                                            <div className="accordion-body">

                                                <p><strong>Name:</strong> {order.FirstName} {order.LastName}</p>
                                                <p><strong>Payment:</strong> {order.Payment}</p>
                                                <hr />                                            
                                                {order.Order.map((item, idx) => (
                                                    <div key={idx} className="d-flex align-items-center gap-3 mb-2">
                                                        <img
                                                            src={`/uploads/${item.Img}`}
                                                            width="50"
                                                            height="50"
                                                            className="rounded"
                                                        />
                                                        <div className="flex-grow-1">
                                                            <div>{item.ProductName}</div>
                                                            <small>
                                                                Qty: {item.Quantity} × ₹{item.Price}
                                                            </small>
                                                        </div>
                                                        <strong>₹{item.Quantity * item.Price}</strong>

                                                    </div>

                                                ))}

                                            </div>
                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>
                        <div className="card w-100 shadow-sm border-top mt-5" id="users">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">Users List</h5>
                                <span className="badge bg-primary">Total: {users}</span>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>User Type</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {d.map((a) => (
                                            <tr key={a._id}>
                                                <td className="text-muted small">{a._id}</td>
                                                <td className="fw-semibold">
                                                    {a.FirstName} {a.LastName}
                                                </td>
                                                <td>{a.Email}</td>
                                                <td> {a.Status === "Active" ? <span className="badge bg-success">{a.Status}</span> : <span className="badge bg-danger">Inactive</span>}</td>
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {a.UserType}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </>:navigate("/")
      }
      </>
    )
}