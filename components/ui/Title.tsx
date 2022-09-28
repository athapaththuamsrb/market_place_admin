import { Typography } from "@mui/material";
import { FC } from "react";

interface TitleProps {
  firstWord: string;
  secondWord: string;
}
const Title: FC<TitleProps> = (props) => {
  return (
    <div>
      <Typography sx={{ marginY: "70px" }} variant="h1" align="center">
        {`${props.firstWord} `}
        <span>
          <Typography
            color="secondary"
            display="inline"
            sx={{ marginY: "72px" }}
            variant="h1"
            align="center"
          >
            {`${props.secondWord}`}
          </Typography>
        </span>
      </Typography>
    </div>
  );
};

export default Title;
