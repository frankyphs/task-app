import React from "react";
import { useLocation } from "react-router-dom";
import AddFormRevision from "./AddFormRevision";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveTemplate } from "../actions/actionCreator";

function Data() {
  const { template } = useSelector((state: any) => state.template);
  console.log(template, "Ini template");
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
