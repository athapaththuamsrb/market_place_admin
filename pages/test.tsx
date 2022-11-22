import * as React from "react";
import Title from "../components/ui/Title";
import CategoryNav from "../components/ui/CategoryNav";
import { Collection_Card } from "../src/interfaces";
import { Box } from "@mui/system";
import { LinearProgress, Typography, Button } from "@mui/material";
import { useIsMounted } from "../components/hooks";
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import axios from "axios";
interface ExploreProps {
  _time: string;
}
const Home: NextPage<ExploreProps> = ({
  _time,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const isMounted = useIsMounted();
  const [time, setTime] = React.useState(_time);
  const revalidate = async () => {
    fetch("/api/revalidate");
  };
  // React.useEffect(() => {
  //   setTime(_time);
  // }, [_time]);
  console.log(time);
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
      <Typography
        color="black"
        align="center"
        variant="h2"
        sx={{ mt: 3, mb: 10 }}
      >
        {time}
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
