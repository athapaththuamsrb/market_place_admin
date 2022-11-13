import * as React from "react";
import { Stack } from "@mui/material";
import Popup from "../components/Popup/MainPopup";

export default function Home() {
  return (
    <Stack direction="row" spacing={2} sx={{ p: 50 }}>
      <Popup />
    </Stack>
  );
}
