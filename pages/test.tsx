import * as React from "react";
import Title from "../components/ui/Title";
import CategoryNav from "../components/ui/CategoryNav";
import { Collection_Card } from "../src/interfaces";
import { Box } from "@mui/system";
import { LinearProgress, Typography, Button } from "@mui/material";
import { useIsMounted } from "../components/hooks";
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import axios from "axios";
import { useRouter } from "next/router";
interface ExploreProps {
  _time: string;
}
const Home: NextPage<ExploreProps> = ({
  _time,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  const revalidate = async () => {
    await axios.post("/api/revalidate", { data: { url: router.pathname } });
    router.reload();
  };
  return isMounted ? (
    <Box>
      <Typography
        color="black"
        align="center"
        variant="h2"
        sx={{ mt: 3, mb: 10 }}
      >
        {_time}
      </Typography>
      <Button onClick={() => revalidate()}> Revalidate</Button>
    </Box>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  console.log("revalidate ", new Date().toISOString());
  return {
    props: { _time: new Date().toISOString() },
    revalidate: 60,
  };
};
export default Home;
