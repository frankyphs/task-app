import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  deleteTasks,
  editTask,
  fetchTemplate,
} from "../actions/actionCreator";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  TextField,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react";

const Table: React.FC = () => {
  const { tasks } = useSelector((state: any) => state.tasks);
  const dispatch = useDispatch();
  // Pagination
  const { templates } = useSelector((state: any) => state.templates);
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 5;
  useEffect(() => {
    dispatch(fetchTasks(currentPage, limitPerPage));
    dispatch(fetchTemplate());
  }, [dispatch, currentPage]);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const [additionalColumns, setAdditionalColumns] = useState([]);

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

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // pakai table biasa
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

  // pakai DetailsList
  const renderDetailsListColumns = () => {
    const columns: IColumn[] = [
      {
        key: "id",
        name: "No",
        fieldName: "id",
        minWidth: 50,
        maxWidth: 50,
        isResizable: true,
        className: "kepala-tabel",
        onRender: (item, index: number) => index + 1,
        styles: {
          cellName: {
            fontSize: "20px",
          },
        },
      },
      ...templates.flatMap((row) =>
        row.map((field) => ({
          key: field.id,
          name: field.name,
          fieldName: field.id,
          minWidth: 100,
          maxWidth: 250,
          className: "kepala-tabel",
          isResizable: true,
          styles: {
            cellName: {
              fontSize: "20px",
            },
          },
        }))
      ),
      {
        key: "actions",
        name: "Action",
        minWidth: 100,
        styles: {
          cellName: {
            fontSize: "20px",
          },
        },
        onRender: (item) => (
          <>
            <button
              onClick={() => handleDeleteClick(item)}
              className="button-delete"
              title="Delete"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
            {/* <button
              onClick={() => handleEditClick(item)}
              className="button-edit"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </button> */}
          </>
        ),
      },
    ];
    return columns;
  };
  const getRowHeight = (item, index) => {
    return 150;
  };

  return (
    <>
      {/* <h1>template</h1>
      {JSON.stringify(templates)} */}
      <h1>List of My Tasks</h1>
      {/* {JSON.stringify(tasks)} */}
      <div className="table-container">
        {deletingTask !== null && (
          <Dialog
            hidden={!isDeleteModalOpen}
            dialogContentProps={{
              type: DialogType.normal,
              title: `Apakah kamu yakin ingin menghapus task ini?`,
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
        <DetailsList
          items={tasks}
          columns={renderDetailsListColumns()}
          layoutMode={DetailsListLayoutMode.fixedColumns}
        />
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
