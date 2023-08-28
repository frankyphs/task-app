import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveTemplate } from "../actions/actionCreator";

import {
  Stack,
  TextField,
  DatePicker,
  SpinButton,
  Dialog,
  DialogType,
  DialogFooter,
  DefaultButton,
  PrimaryButton,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";

const TaskForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [leftColumnComponents, setLeftColumnComponents] = useState([]);
  const [rightColumnComponents, setRightColumnComponents] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogInputValue, setDialogInputValue] = useState("");
  const [currentDroppedComponent, setCurrentDroppedComponent] = useState(null);
  const [currentDroppedColumn, setCurrentDroppedColumn] = useState("");
  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, column) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData("componentType");
    if (componentType) {
      setCurrentDroppedComponent({ type: componentType });
      setCurrentDroppedColumn(column);
      setShowDialog(true);
    }
  };

  const handleDialogInputChange = (event) => {
    setDialogInputValue(event.target.value);
  };

  const handleDialogSave = () => {
    if (dialogInputValue.trim() === "") {
      // error message if the input is empty
      setError({ show: true, message: "Please fill the name" });
    } else {
      setShowDialog(false);
      const newComponent = {
        ...currentDroppedComponent,
        id: Math.random(),
        name: dialogInputValue,
      };

      if (currentDroppedColumn === "column-left") {
        setLeftColumnComponents([...leftColumnComponents, newComponent]);
      } else if (currentDroppedColumn === "column-right") {
        setRightColumnComponents([...rightColumnComponents, newComponent]);
      }

      setCurrentDroppedComponent(null);
      setCurrentDroppedColumn("");
      setDialogInputValue("");
    }
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    setCurrentDroppedComponent(null);
    setCurrentDroppedColumn("");
    setDialogInputValue("");
  };

  const handleRemoveComponent = (id, column) => {
    if (column === "column-left") {
      setLeftColumnComponents(
        leftColumnComponents.filter((component) => component.id !== id)
      );
    } else if (column === "column-right") {
      setRightColumnComponents(
        rightColumnComponents.filter((component) => component.id !== id)
      );
    }
  };

  const handleMoveComponentUp = (id, column) => {
    const components =
      column === "column-left" ? leftColumnComponents : rightColumnComponents;
    const index = components.findIndex((component) => component.id === id);
    if (index > 0) {
      const updatedComponents = [...components];
      const [movedComponent] = updatedComponents.splice(index, 1);
      updatedComponents.splice(index - 1, 0, movedComponent);
      if (column === "column-left") {
        setLeftColumnComponents(updatedComponents);
      } else {
        setRightColumnComponents(updatedComponents);
      }
    }
  };

  const handleMoveComponentDown = (id, column) => {
    const components =
      column === "column-left" ? leftColumnComponents : rightColumnComponents;
    const index = components.findIndex((component) => component.id === id);
    if (index < components.length - 1) {
      const updatedComponents = [...components];
      const [movedComponent] = updatedComponents.splice(index, 1);
      updatedComponents.splice(index + 1, 0, movedComponent);
      if (column === "column-left") {
        setLeftColumnComponents(updatedComponents);
      } else {
        setRightColumnComponents(updatedComponents);
      }
    }
  };

  const renderFormComponents = (components, column) => {
    return components.map((component) => {
      let componentElement;
      switch (component.type) {
        case "TextField":
          componentElement = <TextField placeholder="Enter text" />;
          break;
        case "DatePicker":
          componentElement = <DatePicker />;
          break;
        case "SpinButton":
          componentElement = <SpinButton min={0} max={100} />;
          break;
        default:
          return null;
      }

      return (
        <div key={component.id} className="form-component">
          <div>{component.name}</div>
          {componentElement}
          <button onClick={() => handleRemoveComponent(component.id, column)}>
            Remove
          </button>
          <button onClick={() => handleMoveComponentUp(component.id, column)}>
            Move Up
          </button>
          <button onClick={() => handleMoveComponentDown(component.id, column)}>
            Move Down
          </button>
        </div>
      );
    });
  };

  const handleSaveTemplate = () => {
    console.log("Template saved:", {
      leftColumnComponents,
      rightColumnComponents,
    });

    dispatch(saveTemplate(leftColumnComponents, rightColumnComponents));
    navigate("/add-task");
  };

  return (
    <>
      <PrimaryButton text="Save Template" onClick={handleSaveTemplate} />
      <Stack horizontal>
        {/* <Stack
        className="component-list"
        onDrop={(e) => handleDrop(e, "column-left")}
        onDragOver={handleDragOver}
        tokens={{ childrenGap: 8 }}
      >
        <h2>Drag components dari sini:</h2>
        <div
          className="draggable-component"
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData("componentType", "TextField")
          }
        >
          <i className="fas fa-font"></i> TextField
        </div>
        <div
          className="draggable-component"
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData("componentType", "DatePicker")
          }
        >
          <i className="far fa-calendar-alt"></i> DatePicker
        </div>
        <div
          className="draggable-component"
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData("componentType", "SpinButton")
          }
        >
          <i className="fas fa-cog"></i> SpinButton
        </div>

        <PrimaryButton text="Save Template" onClick={handleSaveTemplate} />
      </Stack> */}

        <div className="form-area">
          <Stack
            className="form-builder"
            onDrop={(e) => handleDrop(e, "column-left")}
            onDragOver={handleDragOver}
            tokens={{ childrenGap: 8 }}
          >
            <h2>Form Builder (Column Left):</h2>
            {renderFormComponents(leftColumnComponents, "column-left")}
          </Stack>
          <Stack
            className="form-builder"
            onDrop={(e) => handleDrop(e, "column-right")}
            onDragOver={handleDragOver}
            tokens={{ childrenGap: 8 }}
          >
            <h2>Form Builder (Column Right):</h2>
            {renderFormComponents(rightColumnComponents, "column-right")}
          </Stack>
        </div>
        <Dialog
          hidden={!showDialog}
          onDismiss={handleDialogCancel}
          dialogContentProps={{
            type: DialogType.normal,
            title: "Enter Component Name",
          }}
        >
          {error.show && (
            <div
              style={{ fontSize: "18px", color: "red", textAlign: "center" }}
            >
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
      </Stack>
    </>
  );
};

export default TaskForm;
