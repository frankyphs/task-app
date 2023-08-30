import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  TextField,
  PrimaryButton,
  DatePicker,
  SpinButton,
} from "@fluentui/react";
// import { useDispatch, useSelector } from "react-redux";
// import { saveTemplate } from "../actions/actionCreator";
// import { useNavigate } from "react-router-dom";

interface FormElement {
  id: string;
  type: string;
  name: string;
}

interface AddFormProps {
  onSave: (formValues: Record<string, any>) => void;
  template: FormElement[][];
}

const AddFormRevision: React.FC<AddFormProps> = ({ onSave, template }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const handleFormChange = (id: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  function formatDateTime(inputDate) {
    const dateObj = new Date(inputDate);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    const formattedDate = dateObj.toLocaleString("id-ID", options);
    return formattedDate;
  }

  const handleSubmit = () => {
    onSave(formValues);
    navigate("/");
  };

  return (
    <>
      <div className="add-form-container">
        <NavLink to="/customize-form" style={{ fontSize: "24px" }}>
          Customize the form
          <i className="fas fa-cog"></i>
        </NavLink>
        {/* {JSON.stringify(template)} */}
        <div>
          {template &&
            template.map((row, rowIndex) => (
              <div key={rowIndex} className="div-baris">
                {row.map((el) => (
                  <div key={el.id} className="div-kolom">
                    {el.type === "TextField" && (
                      <TextField
                        placeholder="Enter text"
                        value={formValues[el.id] || ""}
                        onChange={(e, newValue) =>
                          handleFormChange(el.id, newValue, el.name)
                        }
                        label={el.name}
                      />
                    )}
                    {el.type === "SpinButton" && (
                      <SpinButton
                        value={formValues[el.id] || ""}
                        onChange={(_, value) =>
                          handleFormChange(el.id, value, el.name)
                        }
                        label={el.name}
                        className="spin-button"
                      />
                    )}
                    {el.type === "DatePicker" && (
                      <DatePicker
                        value={formValues[el.id] || null}
                        onSelectDate={(date) =>
                          handleFormChange(el.id, date, el.name)
                        }
                        placeholder="Enter Date"
                        label={el.name}
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
