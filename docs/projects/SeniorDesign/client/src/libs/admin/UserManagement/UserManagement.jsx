import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateUser,
  addUser,
  getUsers,
  deleteUser,
} from "../../services/api-client/userRolesService";
import UserTableComponent from "../../table-tabs/UserTableComponent";
import "../../style/Admin.css";

function UserManagement(props) {
  const [unityId, setUnityId] = useState("");
  const [editUnityId, setEditUnityId] = useState("");
  const [role, setRole] = useState("admin");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState([]);

  // Gets the current user from the props and if they are not an admin, redirect
  const navigate = useNavigate();
  if (props.user?.role !== "admin") {
    navigate("/invalid");
  }

  // Loads the users from the database
  useEffect(() => {
    getUsers()
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  }, []);

  // Updates a user from the database
  const update = (e) => {
    e.preventDefault();
    updateUser(unityId, editUnityId, role, firstname, lastname, email)
      .then((res) => {
        if (res.status === 200) {
          setSuccess(`User ${unityId} updated successfully`);
          let user = users.find((user) => user.unityId === editUnityId);
          user.unityId = unityId;
          user.role = role;
          user.firstName = firstname;
          user.lastName = lastname;
          user.email = email;
          setUsers([...users]);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(`Unable to update user ${unityId}`);
      });
    clear();
  };

  // Adds a user to the database
  const add = async (e) => {
    e.preventDefault();
    const response = await addUser(unityId, role, firstname, lastname, email);
    if (response.status === 200) {
      setUsers([...users, response.data]);
      setSuccess(`User ${unityId} added successfully`);
      clear();
    } else {
      console.log("failed to add user");
      setError(`User ${unityId} already exists`);
    }
  };

  // Deletes a user from the database
  const del = async (e) => {
    e.preventDefault();
    if (unityId === "" && editUnityId === "") {
      setError("Please select a user to delete");
      return;
    }
    if (unityId === props.user.unityId && editUnityId === props.user.unityId) {
      setError("You cannot delete yourself");
      return;
    }

    const response = await deleteUser(editUnityId || unityId);
    if (response.status === 200) {
      setUsers(
        users.filter((user) => user.unityId !== (editUnityId || unityId))
      );
      setSuccess(`User ${editUnityId || unityId} deleted successfully`);
    } else {
      setError(response.message);
    }
    clear();
  };

  // Sets the state to the selected user
  const toEdit = (selection) => {
    console.log(selection);
    if (selection) {
      const user = users.find((user) => user.unityId === selection);
      setUnityId(user.unityId);
      setEditUnityId(user.unityId);
      setRole(user.role);
      setFirstname(user.firstName);
      setLastname(user.lastName);
      setEmail(user.email);
    }
  };

  // Clears the form
  const clear = (e) => {
    if (e) {
      e.preventDefault();
    }
    setUnityId("");
    setEditUnityId("");
    setRole("admin");
    setFirstname("");
    setLastname("");
    setEmail("");
  };

  // Clears the error/success messages
  const clearErrorSuccess = (e) => {
    setError("");
    setSuccess("");
  };

  // Sets up the rows and columns for the table
  const rows = users.map((row) => ({
    id: row.unityId,
    unityId: row.unityId,
    name: row.firstName + " " + row.lastName,
    role: row.role,
    email: row.email,
  }));

  const columns = [
    { field: "unityId", headerName: "Unity ID", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "role", headerName: "Role", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
  ];

  return (
    <div className="main-div">
      <div className="content-div">
        <h1>User Management</h1>
        <div className="admin-controls-div">
          <h2>Add/Edit a User</h2>
          <form className="form-admin">
            <div className="admin-text-inputs">
              <label className="label-admin">
                Unity ID:
                <input
                  className="input-admin"
                  type="text"
                  name="unityId"
                  value={unityId}
                  onChange={(e) => {
                    setUnityId(e.target.value);
                    clearErrorSuccess();
                  }}
                />
              </label>
              <label className="label-admin">
                Role:
                <select
                  className="input-admin"
                  name="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    clearErrorSuccess();
                  }}
                >
                  <option className="option-admin" value="admin">
                    Admin
                  </option>
                  <option className="option-admin" value="superuser">
                    Superuser
                  </option>
                  <option className="option-admin" value="user">
                    User
                  </option>
                </select>
              </label>
              <label className="label-admin">
                First Name:
                <input
                  className="input-admin"
                  type="text"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                    clearErrorSuccess();
                  }}
                />
              </label>
              <label className="label-admin">
                Last Name:
                <input
                  className="input-admin"
                  type="text"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                    clearErrorSuccess();
                  }}
                />
              </label>
              <label className="label-admin">
                Email:
                <input
                  className="input-admin"
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearErrorSuccess();
                  }}
                />
              </label>
            </div>
            <div>
              <button onClick={update} className="form-button-admin">
                Update
              </button>
              <button onClick={add} className="form-button-admin">
                Create
              </button>
              <button onClick={clear} className="form-button-admin">
                Clear
              </button>
              <button onClick={del} className="form-button-admin">
                Delete
              </button>
            </div>
          </form>
          {error ? <p className="error">{error}</p> : null}
          {success ? <p className="success">{success}</p> : null}
        </div>
        <div>
          <h2>Current Users</h2>
          <UserTableComponent rows={rows} columns={columns} toEdit={toEdit} />
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
