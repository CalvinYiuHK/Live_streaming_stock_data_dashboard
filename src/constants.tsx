export const URL = 'localhost'
export const PORT = 8082

export const DATA_COLUMNS = [
    { headerName: "Portfolio", field: "Portfolio", sortingOrder: ["asc"], wrapText: true, sort: "asc" },
    { headerName: "Code", field: "Code", type: "numericColumn", sort: "asc" },
    { headerName: "Name", field: "Name", wrapText: true, sort: "asc" },
    { headerName: "Price", field: "Price", type: "numericColumn" },
    { headerName: "Quantity", field: "Quantity", type: "numericColumn" }
  ];
