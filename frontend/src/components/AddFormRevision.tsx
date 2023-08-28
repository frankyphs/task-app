import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  TextField,
  PrimaryButton,
  DatePicker,
  SpinButton,
} from "@fluentui/react";

interface FormElement {
  id: string;
  type: string;
  name: string;
}

interface TemplateRow extends Array<FormElement> {}

interface AddFormProps {
  onSave: (formValues: Record<string, any>) => void;
  template: TemplateRow[];
}

const AddFormRevision: React.FC<AddFormProps> = ({ onSave, template }) => {
  const navigate = useNavigate();

  const [fixTemplate, setFixTemplate] = useState<TemplateRow[]>(template);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleFormChange = (id: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formValues);
  };

  useEffect(() => {
    setFixTemplate(template);
  }, [template]);

  console.log(template, "ini template");

  return (
    <>
      <div className="add-form-container">
        <NavLink to="/customize-form" style={{ fontSize: "24px" }}>
          Customize the form
          <i className="fas fa-cog"></i>
        </NavLink>
        {JSON.stringify(fixTemplate)}
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
                          handleFormChange(el.id, newValue)
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
