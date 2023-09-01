/* eslint-disable */

import React, { useState } from "react";
import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import {
  PrimaryButton,
  TextField,
  DatePicker,
  SpinButton,
  Dialog,
  DialogFooter,
  DialogType,
  DefaultButton,
  Panel,
} from "@fluentui/react";
import AddFormRevision from "./AddFormRevision";
import Data from "./Data";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveTemplate } from "../actions/actionCreator";

interface TextField {
  type: "TextField";
  id: string;
  name?: string;
  class?: string;
}

interface SpinButton {
  type: "SpinButton";
  id: string;
  name?: string;
  class?: string;
}

interface DatePicker {
  type: "DatePicker";
  id: string;
  name?: string;
  class?: string;
}

type FormElement = TextField | SpinButton | DatePicker;

const FORM: FormElement[][] = [
  [
    { type: "TextField", id: "1", name: "Judul" },
    { type: "TextField", id: "4", name: "Subjek" },
  ],
  [{ type: "SpinButton", id: "3", name: "Repetisi" }],
  [
    { type: "DatePicker", id: "5", name: "Deadline" },
    { type: "TextField", id: "6", name: "Deskripsi" },
  ],
];

type Component = TextField | DatePicker | SpinButton;
const COMPONENT: Component[] = [
  { type: "TextField", id: "11", class: "fas fa-font" },
  { type: "DatePicker", id: "12", class: "far fa-calendar-alt" },
  { type: "SpinButton", id: "13", class: "fas fa-cog" },
];

const CustomizeRevise: React.FC = () => {
  const { templates } = useSelector((state: any) => state.templates);
  const [template, setTemplate] = useState<FormElement[][]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [custom, setCustom] = useState<Component[]>(COMPONENT);

  // handle masukin nama komponen baru
  const [newComponent, setNewComponent] = useState<FormElement | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [shouldExecuteDragAndDrop, setShouldExecuteDragAndDrop] =
    useState(false);
  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const handlePanelSave = () => {
    if (editingComponentName.trim() === "") {
      setError({ show: true, message: "Please enter a valid name." });
      return;
    }

    // Cari indeks dan grup komponen yang sesuai dengan id
    let targetGroupIndex = -1;
    let targetComponentIndex = -1;

    template.forEach((group, groupIndex) => {
      group.forEach((component, componentIndex) => {
        if (component.id == editingComponentID) {
          targetGroupIndex = groupIndex;
          targetComponentIndex = componentIndex;
        }
      });
    });

    if (targetGroupIndex !== -1 && targetComponentIndex !== -1) {
      // Salin array template dan perbarui komponen yang sesuai
      const updatedTemplate = [...template];
      updatedTemplate[targetGroupIndex][targetComponentIndex] = {
        ...updatedTemplate[targetGroupIndex][targetComponentIndex],
        name: editingComponentName,
      };

      // Simpan perubahan ke state template
      setTemplate(updatedTemplate);
    }

    setError({ show: false, message: "" });
    setIsPanelOpen(false);
  };
  const handleDeleteComponent = (id) => {
    // Mencari indeks dan grup komponen yang akan dihapus
    let targetGroupIndex = -1;
    let targetComponentIndex = -1;

    template.forEach((group, groupIndex) => {
      group.forEach((component, componentIndex) => {
        if (component.id === id) {
          targetGroupIndex = groupIndex;
          targetComponentIndex = componentIndex;
        }
      });
    });

    if (targetGroupIndex !== -1 && targetComponentIndex !== -1) {
      // Salin array template dan hapus komponen yang sesuai
      const updatedTemplate = [...template];
      updatedTemplate[targetGroupIndex].splice(targetComponentIndex, 1);

      // Simpan perubahan ke state template
      setTemplate(modifyArray(filterArray(updatedTemplate)));
    }
  };

  // Panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingComponentName, setEditingComponentName] = useState("");
  const [editingComponentID, setEditingComponentID] = useState("");

  // handle array template
  const filterArray = (array: FormElement[][]): FormElement[][] => {
    const simpanArray = array.filter((el) => el.length !== 0);
    return simpanArray;
  };

  const handleOpenPanel = (nameComponent, idComponent) => {
    setIsPanelOpen(true);
    setEditingComponentName(nameComponent);
    setEditingComponentID(idComponent);
  };

  const modifyArray = (array: FormElement[][]): FormElement[][] => {
    let result: FormElement[][] = [];

    result.push([]);

    for (let i = 0; i < array.length; i++) {
      result.push(array[i]);

      if (i < array.length - 1) {
        result.push([]);
      }
    }

    result.push([]);

    return result;
  };

  //nampilin tombol delete
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [deleteButtonIndex, setDeleteButtonIndex] = useState(null);
  const [deleteButtonRow, setDeleteButtonRow] = useState(null);

  const handleMouseEnter = (row, index) => {
    setShowDeleteButton(true);
    setDeleteButtonIndex(index);
    setDeleteButtonRow(row);
  };

  const handleMouseLeave = () => {
    setShowDeleteButton(false);
    setDeleteButtonIndex(null);
    setDeleteButtonRow(null);
  };

  useEffect(() => {
    setTemplate(modifyArray(templates));
  }, []);

  const handleComponentNameChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditingComponentName(e.currentTarget.value);
  };

  const handleSave = () => {
    const arrayBaru = filterArray(template);
    dispatch(saveTemplate(arrayBaru));
    navigate("/add-task");
  };

  const handleDragandDrops = (results: any) => {
    const { source, destination, type } = results;

    //Ini logic untuk menambah array baru (baris baru) pada area form
    if (!destination) {
      return;
    }

    // ini logic ketika tidak terjadi perubahan apapun
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // ini logic untuk pemindahan komponen pada baris / row yang sama / droppableId yg sama
    if (source.droppableId === destination.droppableId) {
      // logic untuk pindah antar 3 komponen utama (tapi udah saya bikin isDropDisabled true)
      if (source.droppableId !== "group") {
        const newTemplate = [...template];
        const simpanArray = [...newTemplate[source.droppableId]];
        const [movedComponent] = simpanArray.splice(source.index, 1);
        simpanArray.splice(destination.index, 0, movedComponent);
        newTemplate[source.droppableId] = simpanArray;
        const newArray = filterArray(newTemplate);
        const finalArray = modifyArray(newArray);
        setTemplate(finalArray);
        // setTemplate(modifyArray(filterArray(newTemplate)))
      } else {
        const reorderedStores = [...template];
        const storeSourceIndex = source.index;
        const storeDestinatonIndex = destination.index;

        const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
        reorderedStores.splice(storeDestinatonIndex, 0, removedStore);
        const newArray = filterArray(reorderedStores);
        const finalArray = modifyArray(newArray);
        setTemplate(finalArray);
        // setTemplate(modifyArray(filterArray(newTemplate)))
      }
    }

    // ini logic untuk penambahan komponen pada form area
    if (
      source.droppableId === "component" &&
      destination.droppableId !== "group"
    ) {
      // setShowDialog(true);
      const newTemplate = [...template];
      const reorderedComponents = [...custom];
      const arrayDropId = destination.droppableId;
      const simpanArrayTujuan = [...newTemplate[arrayDropId]];
      const [movedOriginComponent] = reorderedComponents.splice(
        source.index,
        1
      );
      const newComponent: FormElement = {
        type: movedOriginComponent.type,
        id: new Date().getTime().toString(),
        name: movedOriginComponent.type,
      };

      simpanArrayTujuan.splice(destination.index, 0, newComponent);
      newTemplate[destination.droppableId] = simpanArrayTujuan;
      setCustom(custom);
      const newArray = filterArray(newTemplate);
      const finalArray = modifyArray(newArray);
      setTemplate(finalArray);
    }

    // ini logic untuk pemindahan komponen antar baris row
    if (
      source.droppableId !== destination.droppableId &&
      source.droppableId !== "component"
    ) {
      const newTemplate = [...template];
      const simpanArrayAsal = [...newTemplate[source.droppableId]];
      const simpanArrayTujuan = [...newTemplate[destination.droppableId]];
      const [movedComponent] = simpanArrayAsal.splice(source.index, 1);
      simpanArrayTujuan.splice(destination.index, 0, movedComponent);
      newTemplate[source.droppableId] = simpanArrayAsal;
      newTemplate[destination.droppableId] = simpanArrayTujuan;

      const newArray = filterArray(newTemplate);
      const finalArray = modifyArray(newArray);
      setTemplate(finalArray);
      // setTemplate(modifyArray(filterArray(newTemplate)))
    }
    console.log(template, "Ini Template");
  };

  return (
    <>
      {/* {JSON.stringify(templates)}{" "} */}
      <div>
        <DragDropContext onDragEnd={handleDragandDrops}>
          <Droppable
            droppableId="component"
            type="component1"
            isDropDisabled={true}
            renderClone={(provided, snapshot, rubric) => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                Item id: {custom[rubric.source.index].id}
              </div>
            )}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="dropArea-component"
              >
                {custom.map((el, index) => (
                  <Draggable key={el.id} draggableId={el.id} index={index}>
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="draggable-component"
                      >
                        <i className={el.class}></i> {el.type}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="group" type="form">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="dropArea1"
                style={{
                  backgroundColor: snapshot.isDraggingOver ? "#FF6969" : "#FFF",
                }}
              >
                {template.map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="bungkus">
                    <Draggable
                      key={`row-${rowIndex}`}
                      draggableId={`row-${rowIndex}`}
                      index={rowIndex}
                    >
                      {(provided) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className="draggable-item-main"
                        >
                          <Droppable
                            droppableId={`${rowIndex}`}
                            type="component1"
                            direction="horizontal"
                          >
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  backgroundColor: snapshot.isDraggingOver
                                    ? "#FFC6AC"
                                    : "#DFD7BF",
                                }}
                                className={`row ${
                                  row.length > 0 ? "filled-row" : "empty-row"
                                }`}
                              >
                                {row.map((el, colIndex) => (
                                  <div
                                    key={`col-${rowIndex}-${colIndex}`}
                                    className="col"
                                  >
                                    <Draggable
                                      key={el.id}
                                      draggableId={el.id}
                                      index={colIndex}
                                    >
                                      {(provided) => (
                                        <div
                                          {...provided.dragHandleProps}
                                          {...provided.draggableProps}
                                          ref={provided.innerRef}
                                          className="draggable-item-secondary"
                                          onMouseEnter={() =>
                                            handleMouseEnter(rowIndex, colIndex)
                                          }
                                          onMouseLeave={() =>
                                            handleMouseLeave()
                                          }
                                        >
                                          <div className="nama-form">
                                            <button
                                              onClick={() =>
                                                handleOpenPanel(el.name, el.id)
                                              }
                                              className="tombol-edit"
                                            >
                                              {el.name}
                                            </button>
                                            {showDeleteButton &&
                                              deleteButtonIndex === colIndex &&
                                              deleteButtonRow === rowIndex && (
                                                <div>
                                                  <button
                                                    onClick={() =>
                                                      handleDeleteComponent(
                                                        el.id
                                                      )
                                                    }
                                                    className="tombol-delete"
                                                  >
                                                    <i className="fas fa-trash"></i>
                                                  </button>
                                                </div>
                                              )}
                                          </div>

                                          {el.type === "TextField" && (
                                            <TextField disabled={true} />
                                          )}
                                          {el.type === "DatePicker" && (
                                            <DatePicker disabled={true} />
                                          )}
                                          {el.type === "SpinButton" && (
                                            <SpinButton disabled={true} />
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                    {/* {provided.placeholder} */}
                                  </div>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <PrimaryButton
        style={{ margin: "20px", fontSize: "20px" }}
        className="add-form-button"
        onClick={handleSave}
      >
        Save Template
      </PrimaryButton>
      <Panel
        isOpen={isPanelOpen}
        onDismiss={() => setIsPanelOpen(false)}
        headerText="Edit Component" // Judul panel
      >
        {/* Isi panel */}
        {error.show && (
          <div style={{ fontSize: "18px", color: "red", textAlign: "center" }}>
            {error.message}
          </div>
        )}
        <TextField
          label="Component Name"
          value={editingComponentName}
          // onChange={(e) => setEditingComponentName(e.target.value)}
          onChange={handleComponentNameChange}
        />
        {/* Tambahan elemen-elemen pengeditan lainnya */}
        <PrimaryButton text="Save" onClick={handlePanelSave} />
      </Panel>
    </>
  );
};

export default CustomizeRevise;
