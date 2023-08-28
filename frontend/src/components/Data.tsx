import React from "react";
import { useLocation } from "react-router-dom";
import AddFormRevision from "./AddFormRevision";
import { NavLink } from "react-router-dom";

function Data() {
  const location = useLocation();
  const template = location?.state?.arrayBaru;

  if (template === undefined) {
    return (
      <div>
        <NavLink to="/customize-form" style={{ fontSize: "24px" }}>
          Customize the form
          <i className="fas fa-cog"></i>
        </NavLink>
      </div>
    );
  }
  return (
    <div>
      <AddFormRevision
        onSave={(formValues) => {
          console.log(formValues);
        }}
        template={template}
      />
    </div>
  );
}

export default Data;
