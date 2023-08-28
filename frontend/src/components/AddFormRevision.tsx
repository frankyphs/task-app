import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import {
  TextField,
  PrimaryButton,
  DatePicker,
  SpinButton,
} from "@fluentui/react";

const AddFormRevision = ({ onSave, template }) => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({});
  const handleFormChange = (id, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formValues);
  };

  return (
    <>
      <div className="add-form-container">
        <NavLink to="/customize-form" style={{ fontSize: "24px" }}>
          Customize the form
          <i className="fas fa-cog"></i>
        </NavLink>
        <div>
          {template &&
            template.map((row, rowIndex) => (
              <div key={rowIndex} className="div-baris">
                {row.map((el) => (
                  <div key={el.id} className="div-kolom">
                    {/* <h3>{el.name}</h3> */}
                    {el.type === "TextField" && (
                      <TextField
                        placeholder="Enter text"
                        value={formValues[el.id] || ""}
                        onChange={(e) =>
                          handleFormChange(el.id, e.target.value)
                        }
                        label={el.type}
                      />
                    )}
                    {el.type === "SpinButton" && (
                      <SpinButton
                        value={formValues[el.id] || ""}
                        onChange={(_, value) => handleFormChange(el.id, value)}
                        label={el.type}
                      />
                    )}
                    {el.type === "DatePicker" && (
                      <DatePicker
                        value={formValues[el.id] || null}
                        onSelectDate={(date) => handleFormChange(el.id, date)}
                        placeholder="Enter Date"
                        label={el.type}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>

        <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
      </div>
    </>
  );
};

export default AddFormRevision;
