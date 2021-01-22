import React from "react";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import {Row} from "./updateGridRows";
import {DATA_COLUMNS} from "./constants"

export default function AGGrid({rows}: { rows: Row[] }) {

  return (
    <div className="wrapper">
      <div data-reactroot>
        <div>
          <div className="container">
            <div
              id="myGrid"
              className="ag-theme-alpine-dark"
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "70vw"
              }}
            >
              <AgGridReact
                rowData={rows}
                columnDefs={DATA_COLUMNS}
                domLayout={"autoHeight"}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  flex: 1,
                  autoHeight: true,
                  minWidth: 100
                }}
                sortingOrder={["asc", "dsc"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
