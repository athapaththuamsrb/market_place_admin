import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import "@fontsource/roboto/900.css";

// Create a theme instance.
const theme = createTheme({
    
  typography: {
    button: {
      textTransform: "none",
    },
    h1: {
      fontSize: 40,
      fontWeight: 900,
    },
    h2: {
      fontSize: 32,
      fontWeight: 900,
    },
    h3: {
      fontSize: 24,
      fontWeight: 900,
    },
    h4: {
      fontSize: 16,
      fontWeight: 900,
    },
    fontFamily: "Roboto",
    fontWeightRegular: 900,
  },
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#CA82FF",
    },
  },
});

export default theme;
