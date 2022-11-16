import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import { useIsMounted } from "../../../components/hooks";
import type { NextPage } from "next";

const ViewPage: NextPage = (props) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  useEffect(() => {
    router.push(`${router.basePath}/explore-collections`);
  }, [router]);

  return isMounted ? (
    <Box></Box>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
};

export default ViewPage;
