import { NextPage } from "next";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  LinearProgress,
  Link,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import BlockIcon from "@mui/icons-material/Block";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Report } from "../../../../src/interfaces";
import AdminMenu from "../../../../components/Admin/AdminMenu";
import Title from "../../../../components/ui/Title";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import theme from "../../../../src/theme";

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        backgroundColor: "white",
      }}
    >
      <GridToolbarExport
        sx={{
          mx: 1,
          color: "white",
          backgroundColor: "#c9c9c9",
          marginY: 0.15,
          fontSize: 16,
        }}
      />
    </GridToolbarContainer>
  );
}

const ReportedUsers: NextPage = (props) => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "String",
      width: 50,
    },
    {
      field: "reportedId",
      headerName: "User ID",
      type: "String",
      width: 130,
    },
    {
      field: "reporterId",
      headerName: "Reported By",
      type: "String",
      width: 220,
    },
    {
      field: "reporter",
      headerName: "Reporter Name",
      type: "String",
      width: 220,
    },
    {
      field: "reason",
      headerName: "Reason",
      type: "String",
      width: 200,
    },
    {
      field: "DateTime",
      headerName: "Reported Date",
      type: "String",
      width: 210,
    },
    {
      field: "actions",
      type: "actions",
      width: 300,
      headerName: "Review",
      getActions: (params: GridRowParams) => [
        <Button
          variant="outlined"
          color="primary"
          key={params.row.id}
          sx={{ color: "black" }}
        >
          <Link
            href={`../../view/user/${params.row.reportedId}`}
            underline="hover"
          >
            <a>View Account</a>
          </Link>
        </Button>,
        <Tooltip title="Block User" key={params.row.id}>
          <GridActionsCellItem
            icon={<BlockIcon />}
            label="Delete"
            color="error"
            onClick={() => handleClickOpenBlock(params.row.id)}
          />
        </Tooltip>,
        <Tooltip title="Verify User" key={params.row.id}>
          <GridActionsCellItem
            icon={<VerifiedIcon />}
            label="Verify"
            color="success"
            onClick={() => handleClickOpenVerify(params.row.id)}
          />
        </Tooltip>,
      ],
    },
  ];

  const [rows, setRows] = useState<Report[]>([]);
  const [openBlock, setOpenBlock] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [id, setId] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("../../../api/getReports")
        .then((res) => {
          setRows(
            res.data.data.filter(
              (report: Report) => report.reportType === "USER"
            )
          );
          setIsPending(false);
          setError(null);
        })
        .catch((error) => {
          setIsPending(false);
          setError(error.message);
        });
    }, 300);
  }, [openBlock, openVerify]);

  const handleClickOpenBlock = (id: string) => {
    setOpenBlock(true);
    setId(id);
  };

  const handleCloseBlock = (result: string, id: string) => () => {
    setOpenBlock(false);
    if (result == "Yes") {
      const user: Report = rows.find((user) => user.id === id)!;
      setTimeout(() => {
        axios
          .post("../../api/setBlock", {
            data: {
              id: user.reportedId,
            },
            action: "block",
            type: "User",
          })
          .then(() => {
            setIsPending(false);
            setError(null);
          })
          .catch((error) => {
            setIsPending(false);
            setError(error.message);
          });
      });
    }
  };

  const handleClickOpenVerify = (id: string) => {
    setOpenVerify(true);
    setId(id);
  };

  const handleCloseVerify = (result: string, id: string) => () => {
    setOpenVerify(false);
    if (result == "Yes") {
      const user: Report = rows.find((user) => user.id === id)!;
      setTimeout(() => {
        axios
          .post("../../api/setBlock", {
            data: {
              id: user.reportedId,
            },
            action: "verify",
            type: "User",
          })
          .then(() => {
            setIsPending(false);
            setError(null);
          })
          .catch((error) => {
            setIsPending(false);
            setError(error.message);
          });
      });
    }
  };

  const onRowsSelectionHandler = (ids: any[]) => {
    const selectedRowsData = ids.map((id: any) =>
      rows.find((row: { id: string }) => row.id === id)
    );
    // console.log(selectedRowsData);
  };

  return (
    <div>
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Title firstWord="Reported" secondWord="Users" />

      <Box textAlign={"center"} display="flex" justifyContent="space-evenly">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 1, md: 1 }}
          sx={{ maxWidth: "80%" }}
        >
          <Grid alignSelf={"center"} item xs={12} sm={12} md={6}>
            <Link href="/admin" underline="none">
              <Button
                size="small"
                color="secondary"
                variant="contained"
                endIcon={<ArrowBackIcon color="action" fontSize="large" />}
                sx={{
                  minWidth: "40%",
                  height: "50px",
                  borderRadius: 3,
                }}
              >
                <Typography
                  color="white"
                  variant="h6"
                  sx={{
                    [theme.breakpoints.down("sm")]: {
                      fontWeight: 600,
                      fontSize: 17,
                    },
                  }}
                >
                  Admin Dashboard
                </Typography>
              </Button>
            </Link>
          </Grid>{" "}
          <Grid alignSelf={"center"} item xs={12} sm={12} md={6}>
            <AdminMenu />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          width: "90%",
          marginX: "auto",
          marginTop: "10px",
          marginBottom: "50px",
          height: 750,
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <DataGrid
          sx={{
            m: 2,
            fontWeight: 400,
            align: "center",
            backgroundColor: "#fcfcfc",
            borderRadius: "10px",
          }}
          rows={rows}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(id) => onRowsSelectionHandler(id)}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
      <Dialog
        open={openBlock}
        onClose={handleCloseBlock}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to block " + id + "?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseBlock("Yes", id)}>
            Yes
          </Button>
          <Button onClick={handleCloseBlock("No", id)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openVerify}
        onClose={handleCloseVerify}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure?"}
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 400 }}>
            {"Are you sure that you want to verify user " + id + "?"}
          </Typography>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseVerify("Yes", id)}>
            Yes
          </Button>
          <Button onClick={handleCloseVerify("No", id)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportedUsers;
