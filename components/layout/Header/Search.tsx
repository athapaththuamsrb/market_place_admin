import * as React from "react";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   borderColor: "red",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("md")]: {
//       width: "20ch",
//     },
//   },
// }));
export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("");
  const router = useRouter();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const getCollection = async () => {
    if (search !== "") {
      try {
        const { data } = await axios.post("/api/getSearchItem", {
          data: {
            query: search,
          },
        });
        const id: string = data.data;
        if (id !== "") {
          router.push(`${router.basePath}/view/collection/${id}`);
        }
      } catch (error) {
        console.log("Search Item Error!");
      }
    }
  };

  useEffect(() => {
    getCollection();
  }, [search]);

  return (
    <Search>
      <TextField
        hiddenLabel
        variant="filled"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={handleChange}
        placeholder="Search collections here..."
      />
    </Search>
  );
}
