import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <div className="sidebar-container">
        <h2>My Task Management</h2>
        <NavLink exact activeClassName="active" to="/" className="nav-link">
          My Tasks
          <i className="fas fa-list-ul"></i>
        </NavLink>
        <NavLink activeClassName="active" to="/add-task" className="nav-link">
          Add Task
          <i className="fas fa-plus"></i>
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;
