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
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import GroupIcon from "@mui/icons-material/Group";
import { Collection, User, Report } from "../../../../src/interfaces";
import AdminMenu from "../../../../components/Admin/AdminMenu";
import Link from "@mui/material/Link";
import Title from "../../../../components/ui/Title";
import axios from "axios";
import BlockIcon from "@mui/icons-material/Block";
import VerifiedIcon from "@mui/icons-material/Verified";

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        backgroundColor: "#FCFCFC",
      }}
    >
      <GridToolbarExport
        sx={{
          mx: 1,
          color: "white",
          backgroundColor: "#CA82FF",
          marginY: 0.15,
          fontSize: 16,
        }}
      />
    </GridToolbarContainer>
  );
}

const ViewReportedCollections: NextPage = (props) => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "String",
      width: 50,
    },
    {
      field: "reportedId",
      headerName: "Collection ID",
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
      headerName: "Review",
      type: "actions",
      width: 240,
      getActions: (params: GridRowParams) => [
        <Button
          variant="outlined"
          color="primary"
          sx={{ color: "black" }}
          key={params.row.id}
        >
          <Link
            href={`../../account/collections/${params.row.id}`}
            underline="hover"
          >
            <a>View Collection</a>
          </Link>
        </Button>,
        <Tooltip title="Block Collection" key={params.row.id}>
          <GridActionsCellItem
            icon={<BlockIcon />}
            label="Delete"
            color="error"
            onClick={() => handleClickOpenBlock(params.row.id)}
          />
        </Tooltip>,
        <Tooltip title="Verify Collection" key={params.row.id}>
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

  const [collections, setCollections] = useState<Collection[]>([]);
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
          setCollections(
            res.data.data.filter(
              (report: Report) => report.reportType === "Collection"
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
      const collection: Collection = collections.find(
        (collection) => collection.id === id
      )!;
      // console.log(collection);
      collection.status = "Blocked";
      setTimeout(() => {
        collection;
        axios
          .put(`http://localhost:8000/collections/${collection.id}`, collection)
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
      const collection: Collection = collections.find(
        (collection) => collection.id === id
      )!;
      collection.status = "Active";
      setTimeout(() => {
        axios
          .put(`http://localhost:8000/collections/${collection.id}`, collection)
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
  return (
    <div>
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Title firstWord="Reported" secondWord="Collections" />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link href="/admin" underline="none">
          <Button
            size="small"
            color="secondary"
            variant="contained"
            endIcon={<GroupIcon color="disabled" />}
            sx={{
              marginX: "10px",
            }}
          >
            <Typography color="white" variant="h6" sx={{ fontWeight: 500 }}>
              Admin Dashboard
            </Typography>
          </Button>
        </Link>
        <AdminMenu />
      </Grid>
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
            backgroundColor: "#fcfcfc",
            borderRadius: "10px",
          }}
          rows={collections}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[5]}
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

export default ViewReportedCollections;
