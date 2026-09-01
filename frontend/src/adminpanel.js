import { useContext, useEffect, useState } from "react";
import {
    Chart as ChartJs,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement
} from "chart.js";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Context } from "./usecontext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SEO } from "./SEO";

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
    // Context & Routing
    const { utype } = useContext(Context);
    const navigate = useNavigate();

    // Data States
    const [usersList, setUsersList] = useState([]);
    const [ordersList, setOrdersList] = useState([]);
    const [vendorsList, setVendorsList] = useState([]);
    const [categoryCount, setCategoryCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [brandCount, setBrandCount] = useState(0);

    // Chart Data Counts
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const [adminUsersCount, setAdminUsersCount] = useState(0);
    const [codOrdersCount, setCodOrdersCount] = useState(0);
    const [cardOrdersCount, setCardOrdersCount] = useState(0);

    const [monthlyData, setMonthlyData] = useState({
        labels: [],
        datasets: []
    });

    // Selected options for role/status change per user/vendor
    const [selectedRole, setSelectedRole] = useState({});
    const [selectedStatus, setSelectedStatus] = useState({});
    const [selectedVendorStatus, setSelectedVendorStatus] = useState({});

    // Search and Filter States
    const [orderSearch, setOrderSearch] = useState("");
    const [orderPaymentFilter, setOrderPaymentFilter] = useState("all");

    const [userSearch, setUserSearch] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState("all");
    const [userStatusFilter, setUserStatusFilter] = useState("all");

    const [vendorSearch, setVendorSearch] = useState("");
    const [vendorStatusFilter, setVendorStatusFilter] = useState("all");

    // Pagination States (Items per page = 5)
    const itemsPerPage = 5;
    const [orderPage, setOrderPage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [vendorPage, setVendorPage] = useState(1);

    // -------------------------------------------------------------
    // 1. Fetching Data From API Backend
    // -------------------------------------------------------------

    useEffect(() => {
        loadMonthlySales();
        loadUsers();
        loadCategories();
        loadProducts();
        loadBrands();
        loadOrders();
        loadVendors();
    }, []);

    const loadMonthlySales = async () => {
        try {
            const res = await fetch("https://elcto-1.onrender.com/api/sales/monthly");
            const data = await res.json();
            if (data && data.labels) {
                setMonthlyData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: "Monthly Sales (₹)",
                            data: data.values,
                            borderColor: "#0d6efd",
                            backgroundColor: "rgba(13, 110, 253, 0.1)",
                            fill: true,
                            tension: 0.3
                        }
                    ]
                });
            }
        } catch (err) {
            console.log("Error loading monthly sales", err);
        }
    };

    const loadUsers = async () => {
        try {
            const res = await fetch("https://elcto-1.onrender.com/api/users");
            const result = await res.json();
            if (result.statuscode === 1) {
                setUsersList(result.data);
                setTotalUsersCount(result.data.length);
                const admins = result.data.filter((u) => u.UserType === "admin");
                setAdminUsersCount(admins.length);
            }
        } catch (err) {
            console.log("Error loading users", err);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await fetch("https://elcto-1.onrender.com/api/getcategory");
            const result = await res.json();
            if (result.statuscode === 1) {
                setCategoryCount(result.data.length);
            }
        } catch (err) {
            console.log("Error loading categories", err);
        }
    };

    const loadProducts = async () => {
        try {
            const res = await fetch("https://elcto-1.onrender.com/api/getproduct");
            const result = await res.json();
            if (result.statuscode === 1) {
                setProductCount(result.data.length);
            }
        } catch (err) {
            console.log("Error loading products", err);
        }
    };

    const loadBrands = async () => {
        try {
            const res = await fetch("https://elcto-1.onrender.com/api/showbrand");
            const result = await res.json();
            if (result.statuscode === 1) {
                setBrandCount(result.data.length);
            }
        } catch (err) {
            console.log("Error loading brands", err);
        }
    };

    const loadOrders = async () => {
        try {
            const res = await fetch("https://elcto-1.onrender.com/api/orderdata");
            const result = await res.json();
            if (result.statuscode === 1) {
                setOrdersList(result.data);
                const cashOrders = result.data.filter((o) => o.Payment === "Cash on Delivery");
                const cardOrders = result.data.filter((o) => o.Payment === "Credit Card");
                setCodOrdersCount(cashOrders.length);
                setCardOrdersCount(cardOrders.length);
            }
        } catch (err) {
            console.log("Error loading orders", err);
        }
    };

    const loadVendors = async () => {
        try {
            const res = await fetch("https://elcto-1.onrender.com/api/vendordata");
            const result = await res.json();
            if (result.statuscode === 1) {
                setVendorsList(result.data);
            }
        } catch (err) {
            console.log("Error loading vendors", err);
        }
    };

    // -------------------------------------------------------------
    // 2. Action Functions (Change User Role, Status, Vendor Status)
    // -------------------------------------------------------------

    const changeUserRole = async (userId) => {
        const role = selectedRole[userId];
        if (!role) {
            Swal.fire("Select Role", "Please select a role from dropdown first", "info");
            return;
        }

        const confirm = await Swal.fire({
            title: "Change Role?",
            text: `Are you sure you want to set role to ${role}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Change"
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`https://elcto-1.onrender.com/api/makeadmin/${userId}`, {
                    method: "put",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ad: role })
                });
                const data = await res.json();
                if (data.statuscode === 1) {
                    Swal.fire("Success", "User role changed successfully!", "success");
                    loadUsers();
                } else {
                    Swal.fire("Error", "Could not change user role", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Server error while changing role", "error");
            }
        }
    };

    const changeUserStatus = async (userId) => {
        const status = selectedStatus[userId];
        if (!status) {
            Swal.fire("Select Status", "Please select a status from dropdown first", "info");
            return;
        }

        const confirm = await Swal.fire({
            title: "Change Status?",
            text: `Are you sure you want to set status to ${status}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Change"
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`https://elcto-1.onrender.com/api/changestatus/${userId}`, {
                    method: "put",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: status })
                });
                const data = await res.json();
                if (data.statuscode === 1) {
                    Swal.fire("Success", "User status changed successfully!", "success");
                    loadUsers();
                } else {
                    Swal.fire("Error", "Could not change user status", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Server error while changing status", "error");
            }
        }
    };

    const changeVendorStatus = async (vendorId) => {
        const status = selectedVendorStatus[vendorId];
        if (!status) {
            Swal.fire("Select Status", "Please select vendor approval status first", "info");
            return;
        }

        const confirm = await Swal.fire({
            title: "Update Vendor?",
            text: `Set vendor status to ${status}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Update"
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`https://elcto-1.onrender.com/api/approval/${vendorId}`, {
                    method: "put",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: status })
                });
                const data = await res.json();
                if (data.statuscode === 1) {
                    Swal.fire("Success", "Vendor status updated!", "success");
                    loadVendors();
                } else {
                    Swal.fire("Error", "Could not update vendor status", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Server error updating vendor", "error");
            }
        }
    };

    // -------------------------------------------------------------
    // 3. Search, Filter, and Simple Pagination Logic
    // -------------------------------------------------------------

    // Filter Orders
    const filteredOrders = ordersList.filter((item) => {
        const matchSearch = (item.OrderNo && String(item.OrderNo).toLowerCase().includes(orderSearch.toLowerCase())) ||
            (item.FirstName && item.FirstName.toLowerCase().includes(orderSearch.toLowerCase())) ||
            (item.LastName && item.LastName.toLowerCase().includes(orderSearch.toLowerCase()));
        const matchPayment = orderPaymentFilter === "all" || item.Payment === orderPaymentFilter;
        return matchSearch && matchPayment;
    });

    // Orders Pagination math
    const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    const paginatedOrders = filteredOrders.slice((orderPage - 1) * itemsPerPage, orderPage * itemsPerPage);

    // Filter Users
    const filteredUsers = usersList.filter((item) => {
        const matchSearch = (item.FirstName && item.FirstName.toLowerCase().includes(userSearch.toLowerCase())) ||
            (item.LastName && item.LastName.toLowerCase().includes(userSearch.toLowerCase())) ||
            (item.Email && item.Email.toLowerCase().includes(userSearch.toLowerCase()));
        const matchType = userTypeFilter === "all" || item.UserType === userTypeFilter;
        const matchStatus = userStatusFilter === "all" || item.Status === userStatusFilter;
        return matchSearch && matchType && matchStatus;
    });

    // Users Pagination math
    const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const paginatedUsers = filteredUsers.slice((userPage - 1) * itemsPerPage, userPage * itemsPerPage);

    // Filter Vendors
    const filteredVendors = vendorsList.filter((item) => {
        const matchSearch = (item.Name && item.Name.toLowerCase().includes(vendorSearch.toLowerCase())) ||
            (item.Email && item.Email.toLowerCase().includes(vendorSearch.toLowerCase())) ||
            (item.Phone && item.Phone.toLowerCase().includes(vendorSearch.toLowerCase()));
        const matchStatus = vendorStatusFilter === "all" || item.Status === vendorStatusFilter;
        return matchSearch && matchStatus;
    });

    // Vendors Pagination math
    const totalVendorPages = Math.ceil(filteredVendors.length / itemsPerPage) || 1;
    const paginatedVendors = filteredVendors.slice((vendorPage - 1) * itemsPerPage, vendorPage * itemsPerPage);

    // Chart Configuration
    const barChartData = {
        labels: ["Users Statistics"],
        datasets: [
            {
                label: "Regular Users",
                data: [totalUsersCount],
                backgroundColor: "#0d6efd",
                barThickness: 45
            },
            {
                label: "Admins",
                data: [adminUsersCount],
                backgroundColor: "#dc3545",
                barThickness: 45
            }
        ]
    };

    const pieChartData = {
        labels: ["Total Orders", "Cash On Delivery", "Credit Card"],
        datasets: [
            {
                label: "Orders Summary",
                data: [ordersList.length, codOrdersCount, cardOrdersCount],
                backgroundColor: ["#0d6efd", "#198754", "#ffc107"]
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <>
            <SEO
                title="Admin Dashboard"
                robots="noindex, nofollow"
            />
            {utype === "admin" ? (
                <div className="container-fluid py-4">
                    <div className="row g-4 align-items-start">
                        {/* Sidebar Navigation */}
                        <div className="col-lg-3 col-md-4 admin-sticky-sidebar">
                            <div className="card shadow-sm border-0 admin-sidebar-card">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                                        <i className="bi bi-shield-lock-fill fs-4 text-primary"></i>
                                        <h5 className="fw-bold m-0 text-primary">Admin Panel</h5>
                                    </div>
                                    <div className="list-group list-group-flush admin-sidebar-nav">
                                        <a href="#stats" className="list-group-item list-group-item-action border-0 fw-semibold">
                                            <i className="bi bi-pie-chart-fill text-primary fs-5"></i>
                                            <span>Overview & Stats</span>
                                        </a>
                                        <a href="#orders" className="list-group-item list-group-item-action border-0 fw-semibold">
                                            <i className="bi bi-box-seam-fill text-warning fs-5"></i>
                                            <span>Orders List</span>
                                            <span className="badge bg-warning bg-opacity-25 text-warning ms-auto rounded-pill px-2">
                                                {ordersList.length}
                                            </span>
                                        </a>
                                        <a href="#users" className="list-group-item list-group-item-action border-0 fw-semibold">
                                            <i className="bi bi-people-fill text-info fs-5"></i>
                                            <span>Users List</span>
                                            <span className="badge bg-info bg-opacity-25 text-info ms-auto rounded-pill px-2">
                                                {usersList.length}
                                            </span>
                                        </a>
                                        <a href="#vendors" className="list-group-item list-group-item-action border-0 fw-semibold">
                                            <i className="bi bi-shop text-success fs-5"></i>
                                            <span>Vendors List</span>
                                            <span className="badge bg-success bg-opacity-25 text-success ms-auto rounded-pill px-2">
                                                {vendorsList.length}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Main Content */}
                        <div className="col-lg-9 col-md-8">
                            {/* Summary Stat Cards */}
                            <div className="row g-3 mb-4" id="stats">
                                <div className="col-md-3 col-sm-6">
                                    <div className="card text-white bg-primary shadow-sm border-0 admin-stat-card">
                                        <div className="card-body d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <h6 className="text-white-50 text-uppercase fw-semibold small mb-1">Categories</h6>
                                                <h3 className="fw-bold m-0">{categoryCount}</h3>
                                            </div>
                                            <div className="fs-1 opacity-75">
                                                <i className="bi bi-grid-3x3-gap-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="card text-white bg-success shadow-sm border-0 admin-stat-card">
                                        <div className="card-body d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <h6 className="text-white-50 text-uppercase fw-semibold small mb-1">Products</h6>
                                                <h3 className="fw-bold m-0">{productCount}</h3>
                                            </div>
                                            <div className="fs-1 opacity-75">
                                                <i className="bi bi-box-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="card text-white bg-warning shadow-sm border-0 admin-stat-card">
                                        <div className="card-body d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <h6 className="text-white-50 text-uppercase fw-semibold small mb-1">Users</h6>
                                                <h3 className="fw-bold m-0 text-white">{totalUsersCount}</h3>
                                            </div>
                                            <div className="fs-1 opacity-75 text-white">
                                                <i className="bi bi-people-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="card text-white bg-dark shadow-sm border-0 admin-stat-card">
                                        <div className="card-body d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <h6 className="text-white-50 text-uppercase fw-semibold small mb-1">Brands</h6>
                                                <h3 className="fw-bold m-0">{brandCount}</h3>
                                            </div>
                                            <div className="fs-1 opacity-75">
                                                <i className="bi bi-award-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                    <div className="card shadow-sm border-0 p-3">
                                        <h5 className="fw-bold d-flex align-items-center gap-2">
                                            <i className="bi bi-bar-chart-line-fill text-primary"></i>
                                            User Distribution
                                        </h5>
                                        <div style={{ height: "300px" }}>
                                            <Bar data={barChartData} options={chartOptions} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card shadow-sm border-0 p-3">
                                        <h5 className="fw-bold d-flex align-items-center gap-2">
                                            <i className="bi bi-pie-chart-fill text-warning"></i>
                                            Orders Breakdown
                                        </h5>
                                        <div style={{ height: "300px" }}>
                                            <Pie data={pieChartData} options={chartOptions} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sales Trend Chart */}
                            <div className="card shadow-sm border-0 p-3 mb-5">
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <i className="bi bi-graph-up text-success"></i>
                                    Monthly Sales
                                </h5>
                                <div style={{ height: "300px" }}>
                                    <Line data={monthlyData} options={chartOptions} />
                                </div>
                            </div>

                            {/* ======================================================== */}
                            {/* SECTION 1: ORDERS LIST WITH PAGINATION & SEARCH           */}
                            {/* ======================================================== */}
                            <div className="card shadow-sm border-0 mb-5" id="orders">
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                        <i className="bi bi-bag-check-fill text-primary"></i>
                                        Customer Orders
                                    </h5>
                                    <span className="badge bg-primary rounded-pill px-3">Total Orders: {filteredOrders.length}</span>
                                </div>

                                <div className="card-body">
                                    {/* Search & Filter Bar */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-7">
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <i className="bi bi-search text-muted"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control border-start-0"
                                                    placeholder="Search by order number or name..."
                                                    value={orderSearch}
                                                    onChange={(e) => {
                                                        setOrderSearch(e.target.value);
                                                        setOrderPage(1);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <select
                                                className="form-select"
                                                value={orderPaymentFilter}
                                                onChange={(e) => {
                                                    setOrderPaymentFilter(e.target.value);
                                                    setOrderPage(1);
                                                }}
                                            >
                                                <option value="all">All Payment Methods</option>
                                                <option value="Cash on Delivery">Cash on Delivery</option>
                                                <option value="Credit Card">Credit Card</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Orders Accordion */}
                                    {paginatedOrders.length > 0 ? (
                                        <div className="accordion" id="ordersAccordion">
                                            {paginatedOrders.map((ord) => (
                                                <div className="accordion-item mb-2 border rounded" key={ord._id}>
                                                    <h2 className="accordion-header">
                                                        <button
                                                            className="accordion-button collapsed bg-white"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#order${ord._id}`}
                                                        >
                                                            <div className="w-100 d-flex justify-content-between pe-3 align-items-center">
                                                                <span><i className="bi bi-receipt me-2 text-primary"></i><strong>Order #{ord.OrderNo || ord._id.slice(-6)}</strong></span>
                                                                <span>Customer: {ord.FirstName} {ord.LastName}</span>
                                                                <span className="badge bg-secondary rounded-pill">{ord.Payment}</span>
                                                            </div>
                                                        </button>
                                                    </h2>
                                                    <div id={`order${ord._id}`} className="accordion-collapse collapse" data-bs-parent="#ordersAccordion">
                                                        <div className="accordion-body">
                                                            <p><strong>Customer Name:</strong> {ord.FirstName} {ord.LastName}</p>
                                                            <p><strong>Payment Method:</strong> {ord.Payment}</p>
                                                            <hr />
                                                            <h6>Order Items:</h6>
                                                            {ord.Order && ord.Order.map((item, idx) => (
                                                                <div key={idx} className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom">
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <img src={item.Img} alt={item.ProductName} width="45" height="45" className="rounded" />
                                                                        <div>
                                                                            <div className="fw-semibold">{item.ProductName}</div>
                                                                            <small className="text-muted">Quantity: {item.Quantity} × ₹{item.Price}</small>
                                                                        </div>
                                                                    </div>
                                                                    <strong>₹{item.Quantity * item.Price}</strong>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted text-center py-3">No orders found.</p>
                                    )}

                                    {/* Simple Orders Pagination */}
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <small className="text-muted">
                                            Page {orderPage} of {totalOrderPages} ({filteredOrders.length} orders total)
                                        </small>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-outline-primary btn-sm rounded-start-pill px-3"
                                                disabled={orderPage === 1}
                                                onClick={() => setOrderPage(orderPage - 1)}
                                            >
                                                <i className="bi bi-chevron-left me-1"></i> Previous
                                            </button>
                                            <button
                                                className="btn btn-outline-primary btn-sm rounded-end-pill px-3"
                                                disabled={orderPage >= totalOrderPages}
                                                onClick={() => setOrderPage(orderPage + 1)}
                                            >
                                                Next <i className="bi bi-chevron-right ms-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ======================================================== */}
                            {/* SECTION 2: USERS LIST WITH PAGINATION & SEARCH            */}
                            {/* ======================================================== */}
                            <div className="card shadow-sm border-0 mb-5" id="users">
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                        <i className="bi bi-people-fill text-info"></i>
                                        Registered Users List
                                    </h5>
                                    <span className="badge bg-warning text-dark rounded-pill px-3">Total Users: {filteredUsers.length}</span>
                                </div>

                                <div className="card-body">
                                    {/* User Search and Filters */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <i className="bi bi-search text-muted"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control border-start-0"
                                                    placeholder="Search user by name or email..."
                                                    value={userSearch}
                                                    onChange={(e) => {
                                                        setUserSearch(e.target.value);
                                                        setUserPage(1);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <select
                                                className="form-select"
                                                value={userTypeFilter}
                                                onChange={(e) => {
                                                    setUserTypeFilter(e.target.value);
                                                    setUserPage(1);
                                                }}
                                            >
                                                <option value="all">All User Types</option>
                                                <option value="admin">Admin</option>
                                                <option value="user">User</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <select
                                                className="form-select"
                                                value={userStatusFilter}
                                                onChange={(e) => {
                                                    setUserStatusFilter(e.target.value);
                                                    setUserPage(1);
                                                }}
                                            >
                                                <option value="all">All Statuses</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Users Table */}
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Status</th>
                                                    <th>Role</th>
                                                    <th>Change Role</th>
                                                    <th>Change Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedUsers.length > 0 ? (
                                                    paginatedUsers.map((u) => (
                                                        <tr key={u._id}>
                                                            <td className="fw-semibold">
                                                                <i className="bi bi-person-circle me-2 text-secondary"></i>
                                                                {u.FirstName} {u.LastName}
                                                            </td>
                                                            <td>{u.Email}</td>
                                                            <td>
                                                                {u.Status === "Active" ? (
                                                                    <span className="badge bg-success rounded-pill px-2">Active</span>
                                                                ) : (
                                                                    <span className="badge bg-danger rounded-pill px-2">Inactive</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-secondary rounded-pill px-2">{u.UserType}</span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-1">
                                                                    <select
                                                                        className="form-select form-select-sm"
                                                                        onChange={(e) => setSelectedRole({ ...selectedRole, [u._id]: e.target.value })}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        <option value="admin">Admin</option>
                                                                        <option value="user">User</option>
                                                                    </select>
                                                                    <button
                                                                        className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                                                        onClick={() => changeUserRole(u._id)}
                                                                    >
                                                                        <i className="bi bi-arrow-repeat"></i>
                                                                        Update
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-1">
                                                                    <select
                                                                        className="form-select form-select-sm"
                                                                        onChange={(e) => setSelectedStatus({ ...selectedStatus, [u._id]: e.target.value })}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        <option value="Active">Active</option>
                                                                        <option value="Inactive">Inactive</option>
                                                                    </select>
                                                                    <button
                                                                        className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                                                        onClick={() => changeUserStatus(u._id)}
                                                                    >
                                                                        <i className="bi bi-arrow-repeat"></i>
                                                                        Update
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-3 text-muted">No users found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Simple Users Pagination */}
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <small className="text-muted">
                                            Page {userPage} of {totalUserPages} ({filteredUsers.length} users total)
                                        </small>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-outline-primary btn-sm rounded-start-pill px-3"
                                                disabled={userPage === 1}
                                                onClick={() => setUserPage(userPage - 1)}
                                            >
                                                <i className="bi bi-chevron-left me-1"></i> Previous
                                            </button>
                                            <button
                                                className="btn btn-outline-primary btn-sm rounded-end-pill px-3"
                                                disabled={userPage >= totalUserPages}
                                                onClick={() => setUserPage(userPage + 1)}
                                            >
                                                Next <i className="bi bi-chevron-right ms-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ======================================================== */}
                            {/* SECTION 3: VENDORS LIST WITH PAGINATION & SEARCH         */}
                            {/* ======================================================== */}
                            <div className="card shadow-sm border-0 mb-5" id="vendors">
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                        <i className="bi bi-shop-window text-success"></i>
                                        Vendor List
                                    </h5>
                                    <span className="badge bg-success rounded-pill px-3">Total Vendors: {filteredVendors.length}</span>
                                </div>

                                <div className="card-body">
                                    {/* Vendor Search and Filter */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-8">
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <i className="bi bi-search text-muted"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control border-start-0"
                                                    placeholder="Search vendor by name, email or phone..."
                                                    value={vendorSearch}
                                                    onChange={(e) => {
                                                        setVendorSearch(e.target.value);
                                                        setVendorPage(1);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <select
                                                className="form-select"
                                                value={vendorStatusFilter}
                                                onChange={(e) => {
                                                    setVendorStatusFilter(e.target.value);
                                                    setVendorPage(1);
                                                }}
                                            >
                                                <option value="all">All Vendor Statuses</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Accept">Accept</option>
                                                <option value="Reject">Reject</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Vendor Table */}
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedVendors.length > 0 ? (
                                                    paginatedVendors.map((v) => (
                                                        <tr key={v._id}>
                                                            <td className="fw-semibold">
                                                                <i className="bi bi-building me-2 text-secondary"></i>
                                                                {v.Name}
                                                            </td>
                                                            <td>{v.Email}</td>
                                                            <td>{v.Phone || "N/A"}</td>
                                                            <td>
                                                                <span className={`badge rounded-pill px-2 ${v.Status === 'Accept' ? 'bg-success' : v.Status === 'Pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                                    {v.Status || 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <select
                                                                        className="form-select form-select-sm"
                                                                        onChange={(e) => setSelectedVendorStatus({ ...selectedVendorStatus, [v._id]: e.target.value })}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        <option value="Accept">Accept</option>
                                                                        <option value="Pending">Pending</option>
                                                                        <option value="Reject">Reject</option>
                                                                    </select>
                                                                    <button
                                                                        className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                                                        onClick={() => changeVendorStatus(v._id)}
                                                                    >
                                                                        <i className="bi bi-check2-circle"></i>
                                                                        Approve
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-3 text-muted">No vendors found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Simple Vendors Pagination */}
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <small className="text-muted">
                                            Page {vendorPage} of {totalVendorPages} ({filteredVendors.length} vendors total)
                                        </small>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-outline-primary btn-sm rounded-start-pill px-3"
                                                disabled={vendorPage === 1}
                                                onClick={() => setVendorPage(vendorPage - 1)}
                                            >
                                                <i className="bi bi-chevron-left me-1"></i> Previous
                                            </button>
                                            <button
                                                className="btn btn-outline-primary btn-sm rounded-end-pill px-3"
                                                disabled={vendorPage >= totalVendorPages}
                                                onClick={() => setVendorPage(vendorPage + 1)}
                                            >
                                                Next <i className="bi bi-chevron-right ms-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                navigate("/")
            )}
        </>
    );
};