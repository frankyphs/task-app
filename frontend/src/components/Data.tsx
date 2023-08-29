import React from "react";
import { useLocation } from "react-router-dom";
import AddFormRevision from "./AddFormRevision";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveTemplate } from "../actions/actionCreator";

function Data() {
  const { templates } = useSelector((state: any) => state.templates);
  console.log(templates, "Ini template");
  if (templates === undefined) {
    return (
      <div>
        <NavLink to="/customize-form" style={{ fontSize: "24px" }}>
          Customize the form
          <i className="fas fa-cog"></i>
        </NavLink>
      </div>
    );
  }

  // melakukan save data ke dalam tabel

  return (
    <div>
      {JSON.stringify(templates)}
      <AddFormRevision
        onSave={(formValues) => {
          console.log(formValues);
        }}
        template={templates}
      />
    </div>
  );
}

export default Data;
