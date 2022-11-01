// import * as React from "react";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import { Activity } from "../../src/interfaces";
// import { FC, useEffect, useState } from "react";

// interface Column {
//   id: "event" | "price" | "from" | "to" | "date";
//   label: string;
//   minWidth?: number;
//   align?: "right" | "left";
//   format?: (value: number) => string;
// }

// interface Data {
//   event: string;
//   price: string;
//   from: string;
//   to: string;
//   date: string;
// }

// interface ViewActivityProps {
//   activity: Activity[];
// }

// function createData(
//   event: string,
//   price: string,
//   from: string,
//   to: string,
//   date: string
// ): Data {
//   return { event, price, from, to, date };
// }

// // const rows = [
// //   createData("Transfer", "72.99", "D7C380", "bluechips", "2 days ago"),
// //   createData("Sale", "72.99", "E57388", "Explorer", "10 days ago"),
// //   createData("Transfer", "72.99", "D7C380", "bluechips", "2 days ago"),
// //   createData("Sale", "72.99", "E57388", "Explorer", "10 days ago"),
// //   createData("Transfer", "72.99", "D7C380", "bluechips", "2 days ago"),
// //   createData("Sale", "72.99", "E57388", "Internet-Explorer", "10 days ago"),
// // ];
// const StickyHeadTable: FC<ViewActivityProps> = ({activity}) => {
//   const [rows, setRows] = useState<Data[]>([]);
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   useEffect(() => {
//     const rowsArr: Data[] = [];
//     console.log(activity.toString());
//     // props.activity.map((activity) =>
//     //   rowsArr.push(
//     //     createData(
//     //       activity.event,
//     //       activity.price,
//     //       activity.from,
//     //       activity.to,
//     //       activity.date
//     //     )
//     //   )
//     // );
//     // setRows(rowsArr);
//   }, []);

//   const columns: readonly Column[] = [
//     { id: "event", label: "Event", minWidth: 100 },
//     { id: "price", label: "Price", minWidth: 50 },
//     {
//       id: "from",
//       label: "From",
//       minWidth: 80,
//       align: "left",
//     },
//     {
//       id: "to",
//       label: "To",
//       minWidth: 80,
//       align: "left",
//     },
//     {
//       id: "date",
//       label: "Date",
//       minWidth: 80,
//       align: "left",
//     },
//   ];

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden" }}>
//       <TableContainer sx={{ maxHeight: 300 }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align}
//                   style={{ minWidth: column.minWidth }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row) => {
//                 return (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.price}>
//                     {columns.map((column) => {
//                       const value = row[column.id];
//                       return (
//                         <TableCell
//                           key={column.id}
//                           align={column.align}
//                           sx={{ fontWeight: 400, fontSize: 15 }}
//                         >
//                           {value}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 );
//               })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={rows.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// };

// export default StickyHeadTable;

import { NextPage } from "next";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

import { useEffect, useState } from "react";
import { User } from "../../src/interfaces";
import axios from "axios";

const ItemActivity: NextPage = (props) => {
  const columns = [
    {
      field: "event",
      headerName: "Event",
      type: "string",
      width: 100,
    },
    {
      field: "price",
      headerName: "Price",
      type: "string",
      width: 100,
    },
    {
      field: "to",
      headerName: "To",
      type: "string",
      width: 130,
    },

    {
      field: "from",
      headerName: "From",
      type: "Date",
      width: 130,
    },
    {
      field: "date",
      headerName: "Date",
      type: "string",
      width: 100,
    },
  ];

  const [rows, setRows] = useState<User[]>([]);
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("http://localhost:8000/users")
        .then((res) => {
          setRows(res.data.filter((user: User) => user.Status === "Reported"));
          setIsPending(false);
          setError(null);
        })
        .catch((error) => {
          setIsPending(false);
          setError(error.message);
        });
    }, 300);
  }, []);

  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          height: 300,
        }}
      >
        <DataGrid
          sx={{
            fontWeight: 400,
            align: "center",
            borderRadius: "10px",
          }}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </div>
  );
};

export default ItemActivity;
