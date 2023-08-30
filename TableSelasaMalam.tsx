/* eslint-disable */
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTasks, editTask } from "../actions/actionCreator";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  TextField,
  DetailsList,
  SelectionMode,
  buildColumns,
  IconButton,
} from "@fluentui/react";
const Table = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  console.log(tasks, "INI TASKS");

  const { templates } = useSelector((state) => state.templates);

  // const { template } = useSelector((state) => state.template);

  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const [additionalColumns, setAdditionalColumns] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 5;

  // Delete
  const handleDeleteClick = (task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = () => {
    if (deletingTask) {
      dispatch(deleteTasks(deletingTask.id));
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingTask(null);
    setIsDeleteModalOpen(false);
  };

  // Edit
  // const [originalTaskData, setOriginalTaskData] = useState({});
  const [editingTaskData, setEditingTaskData] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const handleEditClick = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
    });
    setEditingTaskData(task); // Simpan data asli
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((form) => ({
      ...form,
      [name]: value,
    }));
  };

  // console.log(templates, "ini template");

  const handleEditConfirmation = () => {
    if (formData.title.trim() === "" || formData.description.trim() === "") {
      setError({ show: true, message: "Please fill all the fields" });
    } else {
      const editedTask = {
        ...editingTaskData, // Gunakan data asli sebagai basis
        ...formData, // Gabungkan dengan data yang diedit
      };
      console.log(editedTask, "ini edittedd task");
      dispatch(editTask(editingTask.id, editedTask));
      setIsEditModalOpen(false);
    }
  };

  useEffect(() => {
    dispatch(fetchTasks(currentPage, limitPerPage));
  }, [dispatch, currentPage, templates]);

  useEffect(() => {}, []);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const renderTableHead = () => {
    const tableHeadCells = templates.flatMap((row) =>
      row.map((field) => <th key={field.id}>{field.name}</th>)
    );
    return (
      <thead>
        <tr>
          <th>No</th>
          {tableHeadCells}
          <th>Action</th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.id}</td>
            {templates.flatMap((row) =>
              row.map((field) => <td key={field.id}>{task[field.id]}</td>)
            )}
            <td>
              <button
                onClick={() => handleDeleteClick(task)}
                className="button-delete"
                title="Delete"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
              <button
                onClick={() => handleEditClick(task)}
                className="button-edit"
                title="Edit"
              >
                <i className="fas fa-edit"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  // const rows = Object.entries(formValues);
  return (
    <>
      <h1>List of My Tasks</h1>
      {JSON.stringify(tasks)}
      <p>Franky</p>
      {JSON.stringify(templates)}
      {/* {JSON.stringify(templates)} */}
      <div className="table-container">
        <table>
          {renderTableHead()}
          {renderTableBody()}
          {deletingTask !== null && (
            <Dialog
              hidden={!isDeleteModalOpen}
              dialogContentProps={{
                type: DialogType.normal,
                title: `Apakah kamu yakin ingin menghapus ${deletingTask.title}?`,
              }}
              modalProps={{
                isBlocking: true,
              }}
            >
              <DialogFooter>
                <PrimaryButton text="Yes" onClick={handleDeleteConfirmation} />
                <DefaultButton text="No" onClick={handleDeleteCancel} />
              </DialogFooter>
            </Dialog>
          )}

          {editingTask !== null && (
            <Dialog
              hidden={!isEditModalOpen}
              dialogContentProps={{
                type: DialogType.normal,
                title: `Edit Task`,
              }}
              modalProps={{
                isBlocking: true,
              }}
            >
              {error.show && (
                <div
                  style={{
                    fontSize: "22px",
                    color: "red",
                    marginLeft: "14px",
                  }}
                >
                  {error.message}
                </div>
              )}
              <div>
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={handleChange}
                  name="title"
                />
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                  multiline
                  autoAdjustHeight
                />
              </div>
              <DialogFooter>
                <PrimaryButton text="Edit" onClick={handleEditConfirmation} />
                <DefaultButton
                  text="Cancel"
                  onClick={() => setIsEditModalOpen(false)}
                />
              </DialogFooter>
            </Dialog>
          )}
        </table>
        <div className="button-page">
          <DefaultButton
            text="Previous"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          />
          <DefaultButton
            text="Next"
            onClick={goToNextPage}
            disabled={tasks.length < limitPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default Table;
