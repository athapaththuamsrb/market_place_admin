import { NextPage } from "next";

import { Box, Button, Grid, Paper, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Title from "../../../components/ui/Title";
import Link from "@mui/material/Link";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";
import { CountData } from "../../../src/interfaces";
import theme from "../../../src/theme";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Chart, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Charts: NextPage = (props) => {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("1");
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "User statistics",
        data: [],
        backgroundColor: ["#4c00b0", "#b100cd", "#da8ee7"],
        hoverOffset: 50,
        datalabels: {
          color: "#FFCE56",
        },
        tooltip: true,
      },
    ],
  });
  const [collectionData, setcollectionData] = useState({
    labels: [],
    datasets: [
      {
        label: "Collection statistics",
        data: [],
        backgroundColor: ["#4c00b0", "#b100cd", "#da8ee7"],
        hoverOffset: 50,
        datalabels: {
          color: "#FFCE56",
        },
        tooltip: true,
      },
    ],
  });
  const [NFTData, setNFTData] = useState({
    labels: [],
    datasets: [
      {
        label: "NFT statistics",
        data: [],
        backgroundColor: ["#4c00b0", "#b100cd", "#da8ee7"],
        hoverOffset: 50,
        datalabels: {
          color: "#FFCE56",
        },
        tooltip: true,
      },
    ],
  });
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  useEffect(() => {
    setTimeout(async () => {
      await axios
        .get("../api/getCounts")
        .then((res) => {
          setUserData({
            labels: res.data.data[0].map((data: CountData) => data.status),
            datasets: [
              {
                label: "User statistics",
                data: res.data.data[0].map((data: CountData) => data.count),
                backgroundColor: ["#4c00b0", "#b100cd", "#da8ee7"],
                hoverOffset: 50,
                datalabels: {
                  color: "#FFCE56",
                },
                tooltip: true,
              },
            ],
          });
          setcollectionData({
            labels: res.data.data[1].map((data: CountData) => data.status),
            datasets: [
              {
                label: "Collection statistics",
                data: res.data.data[1].map((data: CountData) => data.count),
                backgroundColor: ["#4c00b0", "#b100cd", "#da8ee7"],
                hoverOffset: 50,
                datalabels: {
                  color: "#FFCE56",
                },
                tooltip: true,
              },
            ],
          });
          setNFTData({
            labels: res.data.data[2].map((data: CountData) => data.status),
            datasets: [
              {
                label: "NFT statistics",
                data: res.data.data[2].map((data: CountData) => data.count),
                backgroundColor: ["#4c00b0", "#b100cd", "#da8ee7"],
                hoverOffset: 50,
                datalabels: {
                  color: "#FFCE56",
                },
                tooltip: true,
              },
            ],
          });
        })
        .catch((error) => {
          setIsPending(false);
          setError(error.message);
        });
    }, 300);
  }, []);

  return (
    <div>
      <Title firstWord="Chart" secondWord="Analysis" />
      <Typography variant="h2" align="center" marginBottom={3}>
        Analysis of the platform
      </Typography>
      <Box
        marginTop={5}
        textAlign={"center"}
        display="flex"
        justifyContent="space-evenly"
      >
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 1, md: 1 }}
          sx={{ maxWidth: "80%" }}
        >
          <Grid alignSelf={"center"} item xs={12} sm={12} md={6}>
            <Link href="/admin/viewAdmin" underline="none">
              <Button
                size="small"
                color="secondary"
                variant="contained"
                endIcon={<GroupIcon color="disabled" />}
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
                      fontSize: 15,
                    },
                  }}
                >
                  Admin Panel
                </Typography>
              </Button>
            </Link>
          </Grid>
          <Grid alignSelf={"center"} item xs={12} sm={12} md={6}>
            <Link href="/admin" underline="none">
              <Button
                size="small"
                color="secondary"
                variant="contained"
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
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "90%", typography: "body1", margin: 10, marginY: 5 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              centered
            >
              <Tab label="Users" value="1" />
              <Tab label="Collections" value="2" />
              <Tab label="NFTs" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Paper sx={{ width: "30%", padding: 2, marginX: "auto" }}>
              <Pie data={userData} />
            </Paper>
          </TabPanel>
          <TabPanel value="2">
            <Paper sx={{ width: "30%", padding: 2, marginX: "auto" }}>
              <Pie data={collectionData} />
            </Paper>
          </TabPanel>
          <TabPanel value="3">
            <Paper sx={{ width: "30%", padding: 2, marginX: "auto" }}>
              <Pie data={NFTData} />
            </Paper>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default Charts;
