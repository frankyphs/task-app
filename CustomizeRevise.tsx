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
} from "@fluentui/react";
import AddFormRevision from "./AddFormRevision";
import Data from "./Data";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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

// const FORM: FormElement[][] = [
//   [
//     { type: "TextField", id: "1", name: 1 },
//     { type: "TextField", id: "4", name: 4 },
//     { type: "TextField", id: "7", name: 7 },
//   ],
//   [{ type: "SpinButton", id: "3", name: 3 }],
//   [
//     { type: "DatePicker", id: "5", name: 5 },
//     { type: "TextField", id: "6", name: 6 },
//   ],
// ];

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
  const [dialogInputValue, setDialogInputValue] = useState("");
  const handleDialogInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDialogInputValue(event.target.value);
  };

  const handleDialogSave = () => {
    if (dialogInputValue.trim() === "") {
      setError({ show: true, message: "Please enter a valid name." });
      return;
    }

    // Mengganti newComponent.name dengan dialogInputValue
    const updatedComponent = {
      ...newComponent,
      name: dialogInputValue,
    };

    // Setelah semua perubahan selesai, tutup dialog
    setNewComponent(updatedComponent);
    setShowDialog(false);
    setDialogInputValue(""); // Reset input nilai
    setError({ show: false, message: "" }); // Reset error
    setShouldExecuteDragAndDrop(true);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    setDialogInputValue("");
  };

  // handle array template
  const filterArray = (array: FormElement[][]): FormElement[][] => {
    const simpanArray = array.filter((el) => el.length !== 0);
    return simpanArray;
  };

  const modifyArray = (array: FormElement[][]): FormElement[][] => {
    let result: FormElement[][] = [];

    for (let i = 0; i < array.length; i++) {
      result.push(array[i]);
      if (i < array.length - 1) {
        result.push([]);
      }
    }

    return result;
  };

  useEffect(() => {
    setTemplate(modifyArray(FORM));
  }, []);

  // const handleSave = () => {
  //   const arrayBaru = filterArray(template);
  //   navigate("/add-task", { state: { arrayBaru } });
  // };

  const handleSave = () => {
    const arrayBaru = filterArray(template);
    dispatch(saveTemplate(arrayBaru));
    navigate("/add-task");
  };

  const handleDragandDrops = (results: any) => {
    const { source, destination, type } = results;

    //Ini logic untuk menambah array baru (baris baru) pada area form
    if (!destination) {
      //nambah komponen pada row yang baru pada area droppable utama
      if (source.droppableId !== "component") {
        const arrayBaru: any[] = [];
        const newTemplate = [...template];
        const simpanArrayAsal = [...newTemplate[source.droppableId]];
        const [movedComponent] = simpanArrayAsal.splice(source.index, 1);
        arrayBaru.push(movedComponent);
        newTemplate[source.droppableId] = simpanArrayAsal;
        newTemplate.push(arrayBaru);
        const newArray = filterArray(newTemplate);
        const finalArray = modifyArray(newArray);
        setTemplate(finalArray);
        // setTemplate(modifyArray(filterArray(newTemplate)))
      } else if (source.droppableId === "component") {
        //mindahin komponen existing ke row yang baru
        const newTemplate = [...template];
        const reorderedComponents = [...custom];
        const arrayTujuanBaru: any[] = [];
        const [movedOriginComponent] = reorderedComponents.splice(
          source.index,
          1
        );
        const newComponent = {
          type: movedOriginComponent.type,
          id: new Date().getTime().toString(),
          name: movedOriginComponent.id,
        };
        arrayTujuanBaru.push(newComponent);
        newTemplate.push(arrayTujuanBaru);
        setCustom(custom);
        const newArray = filterArray(newTemplate);
        const finalArray = modifyArray(newArray);
        setTemplate(finalArray);
        // setTemplate(modifyArray(filterArray(newTemplate)))
      }
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
      setShowDialog(true);
      if (shouldExecuteDragAndDrop) {
        const newTemplate = [...template];
        const reorderedComponents = [...custom];
        const arrayDropId = destination.droppableId;
        const simpanArrayTujuan = [...newTemplate[arrayDropId]];
        const [movedOriginComponent] = reorderedComponents.splice(
          source.index,
          1
        );
        const komponent: FormElement = {
          type: movedOriginComponent.type,
          id: new Date().getTime().toString(),
          name: newComponent.name,
        };

        simpanArrayTujuan.splice(destination.index, 0, newComponent);
        newTemplate[destination.droppableId] = simpanArrayTujuan;
        setCustom(custom);
        const newArray = filterArray(newTemplate);
        const finalArray = modifyArray(newArray);
        setTemplate(finalArray);
      }
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
    // console.log(template, "Ini Template");
  };

  return (
    <>
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
                                        >
                                          <h3>
                                            Item {el.type} : name :{el.name}
                                          </h3>
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
      <PrimaryButton className="add-form-button" onClick={handleSave}>
        Save Template
      </PrimaryButton>
      <Dialog
        hidden={!showDialog}
        onDismiss={handleDialogCancel}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Enter Component Name",
        }}
      >
        {error.show && (
          <div style={{ fontSize: "18px", color: "red", textAlign: "center" }}>
            {error.message}
          </div>
        )}
        <TextField
          label="Component Name"
          value={dialogInputValue}
          onChange={handleDialogInputChange}
        />
        <DialogFooter>
          <PrimaryButton text="Yes" onClick={handleDialogSave} />
          <DefaultButton text="No" onClick={handleDialogCancel} />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default CustomizeRevise;
