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

  // Read
  // useEffect(() => {
  //   dispatch(fetchTasks(currentPage, limitPerPage));
  // }, [dispatch, currentPage]);

  // useEffect(() => {
  //   const leftColumns = leftColumnComponents.map((column) => {
  //     return {
  //       name: column.name,
  //       component: column.component,
  //       key: `left_${column.name}`,
  //     };
  //   });

  //   const rightColumns = rightColumnComponents.map((column) => {
  //     return {
  //       name: column.name,
  //       component: column.component,
  //       key: `right_${column.name}`,
  //     };
  //   });

  //   setAdditionalColumns([...leftColumns, ...rightColumns]);
  // }, [leftColumnComponents, rightColumnComponents]);

  useEffect(() => {
    dispatch(fetchTasks(currentPage, limitPerPage));
  }, [dispatch, currentPage]);

  useEffect(() => {}, []);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      <h1>List of My Tasks</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Task Name</th>
              <th>Task Description</th>
              {additionalColumns.map((column) => (
                <th key={column.key}>{column.name}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task?.title}</td>
                <td>{task?.description}</td>
                {Object.keys(task).map((key) => {
                  const isReservedKey = ["id", "title", "description"].includes(
                    key
                  );
                  if (!isReservedKey) {
                    return <td key={key}>{task[key] ?? "null"}</td>;
                  }
                })}
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
                  <PrimaryButton
                    text="Yes"
                    onClick={handleDeleteConfirmation}
                  />
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
          </tbody>
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
