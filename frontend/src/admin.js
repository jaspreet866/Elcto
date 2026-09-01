import { useContext, useEffect, useState } from "react";
import { Context } from "./usecontext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SEO } from "./SEO";

export const Admin = () => {
    // Context & Routing
    const { utype } = useContext(Context);
    const navigate = useNavigate();

    // User Data State
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Selected options for role and status change per row
    const [selectedRole, setSelectedRole] = useState({});
    const [selectedStatus, setSelectedStatus] = useState({});

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Pagination State (6 users per page)
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch user data on component load
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://elcto-1.onrender.com/api/users");
            const result = await res.json();
            if (result.statuscode === 1) {
                setUsersList(result.data);
            }
        } catch (err) {
            console.log("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    // Change User Role function
    const changeRole = async (userId) => {
        const role = selectedRole[userId];
        if (!role) {
            Swal.fire("Select Role", "Please select a role first", "info");
            return;
        }

        const confirm = await Swal.fire({
            title: "Change User Role?",
            text: `Set user role to "${role}"?`,
            icon: "question",
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
                    Swal.fire("Updated!", "User role changed successfully.", "success");
                    loadUsers();
                } else {
                    Swal.fire("Error", "Failed to update role", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Server error updating role", "error");
            }
        }
    };

    // Change User Status function
    const changeStatus = async (userId) => {
        const status = selectedStatus[userId];
        if (!status) {
            Swal.fire("Select Status", "Please select a status first", "info");
            return;
        }

        const confirm = await Swal.fire({
            title: "Change User Status?",
            text: `Set user status to "${status}"?`,
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
                    Swal.fire("Updated!", "User status changed successfully.", "success");
                    loadUsers();
                } else {
                    Swal.fire("Error", "Failed to update status", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Server error updating status", "error");
            }
        }
    };

    // Filter Logic
    const filteredUsers = usersList.filter((u) => {
        const matchSearch = (u.FirstName && u.FirstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.LastName && u.LastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.Email && u.Email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchRole = roleFilter === "all" || u.UserType === roleFilter;
        const matchStatus = statusFilter === "all" || u.Status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            <SEO
                title="Admin - User Management"
                robots="noindex, nofollow"
            />
            {utype === "admin" ? (
                <div className="container py-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold mb-0">User Data / Updation</h3>
                        <button className="btn btn-outline-primary btn-sm" onClick={loadUsers}>
                            Refresh List
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Cards Grid */}
                    {loading ? (
                        <p className="text-center py-4">Loading users...</p>
                    ) : paginatedUsers.length > 0 ? (
                        <div className="row g-3">
                            {paginatedUsers.map((a) => (
                                <div className="col-md-4 col-sm-6" key={a._id}>
                                    <div className="card shadow-sm h-100 p-3">
                                        <div className="card-body">
                                            <h5 className="fw-bold">{a.FirstName} {a.LastName}</h5>
                                            <p className="text-muted mb-1">Email: {a.Email}</p>
                                            <p className="mb-2">
                                                UserType: <span className="badge bg-secondary">{a.UserType}</span>
                                            </p>
                                            <div className="mb-3">
                                                Status: {a.Status === "Active" ? (
                                                    <span className="badge bg-success">Active</span>
                                                ) : (
                                                    <span className="badge bg-danger">Inactive</span>
                                                )}
                                            </div>

                                            <hr />

                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <small className="text-muted">Set Role:</small>
                                                    <select
                                                        className="form-select form-select-sm my-1"
                                                        onChange={(e) => setSelectedRole({ ...selectedRole, [a._id]: e.target.value })}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="user">User</option>
                                                    </select>
                                                    <button
                                                        className="btn btn-primary btn-sm w-100"
                                                        onClick={() => changeRole(a._id)}
                                                    >
                                                        Change
                                                    </button>
                                                </div>

                                                <div className="col-6">
                                                    <small className="text-muted">Set Status:</small>
                                                    <select
                                                        className="form-select form-select-sm my-1"
                                                        onChange={(e) => setSelectedStatus({ ...selectedStatus, [a._id]: e.target.value })}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Inactive</option>
                                                    </select>
                                                    <button
                                                        className="btn btn-success btn-sm w-100"
                                                        onClick={() => changeStatus(a._id)}
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4 text-muted">No users found.</p>
                    )}

                    {/* Pagination Bar */}
                    <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                        <small className="text-muted">
                            Page {currentPage} of {totalPages} ({filteredUsers.length} users total)
                        </small>
                        <div className="btn-group">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                navigate("/")
            )}
        </>
    );
};