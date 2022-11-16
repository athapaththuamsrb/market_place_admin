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
import { Report } from "../../../../src/interfaces";
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

const ViewReportedNFTs: NextPage = (props) => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "string",
      width: 50,
    },
    {
      field: "reportedId",
      headerName: "NFT ID",
      type: "string",
      width: 130,
    },
    {
      field: "reporterId",
      headerName: "Reported By",
      type: "string",
      width: 220,
    },
    {
      field: "reporter",
      headerName: "Reporter Name",
      type: "string",
      width: 220,
    },
    {
      field: "reason",
      headerName: "Reason",
      type: "string",
      width: 200,
    },
    {
      field: "DateTime",
      headerName: "Reported Date",
      type: "string",
      width: 210,
    },
    {
      field: "actions",
      headerName: "Review",
      type: "actions",
      width: 200,
      getActions: (params: GridRowParams) => [
        //TODO link view NFT
        <Button
          variant="outlined"
          color="primary"
          key={params.row.id}
          sx={{ color: "black" }}
        >
          <Link
            href={`../../view/nft/${params.row.reportedOwner}/${params.row.reportedId}`}
            underline="hover"
          >
            <a>View NFT</a>
          </Link>
        </Button>,
        <Tooltip title="Block NFT" key={params.row.id}>
          <GridActionsCellItem
            icon={<BlockIcon />}
            label="Delete"
            color="error"
            onClick={() => handleClickOpenBlock(params.row.id)}
          />
        </Tooltip>,
        <Tooltip title="Verify NFT" key={params.row.id}>
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

  const [nfts, setNFTs] = useState<Report[]>([]);
  const [openBlock, setOpenBlock] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [id, setId] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("/api/getReports")
        .then((res) => {
          setNFTs(
            res.data.data.filter(
              (report: Report) => report.reportType === "NFT"
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
      const nft: Report = nfts.find((nft) => nft.id === id)!;
      setTimeout(() => {
        axios
          .post("/api/setBlock", {
            data: {
              id: nft.reportedId,
            },
            action: "block",
            type: "NFT",
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
      const nft: Report = nfts.find((nft) => nft.id === id)!;
      setTimeout(() => {
        axios
          .post("/api/setBlock", {
            data: {
              id: nft.reportedId,
            },
            action: "verify",
            type: "NFT",
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
  return (
    <div>
      {isPending && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <Title firstWord="Reported" secondWord="NFTs" />
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
          width: "70%",
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
          rows={nfts}
          columns={columns}
          //pageSize={12}
          //rowsPerPageOptions={[5]}
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

export default ViewReportedNFTs;
