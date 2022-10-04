import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

interface Column {
  id: "event" | "price" | "from" | "to" | "date";
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "event", label: "Event", minWidth: 170 },
  { id: "price", label: "Price", minWidth: 100 },
  {
    id: "from",
    label: "From",
    minWidth: 170,
    align: "left",
  },
  {
    id: "to",
    label: "To",
    minWidth: 170,
    align: "left",
  },
  {
    id: "date",
    label: "Date",
    minWidth: 170,
    align: "left",
  },
];

interface Data {
  event: string;
  price: string;
  from: string;
  to: string;
  date: string;
}

function createData(
  event: string,
  price: string,
  from: string,
  to: string,
  date: string
): Data {
  return { event, price, from, to, date };
}

const rows = [
  createData("Transfer", "72.99", "D7C380", "bluechips_vault", "2 days ago"),
  createData("Sale", "72.99", "E57388", "Internet-Explorer", "10 days ago"),
  createData("Transfer", "72.99", "D7C380", "bluechips_vault", "2 days ago"),
  createData("Sale", "72.99", "E57388", "Internet-Explorer", "10 days ago"),
  createData("Transfer", "72.99", "D7C380", "bluechips_vault", "2 days ago"),
  createData("Sale", "72.99", "E57388", "Internet-Explorer", "10 days ago"),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.price}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
