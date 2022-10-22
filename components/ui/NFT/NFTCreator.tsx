import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { FC } from "react";

interface NFTCreatorProps {
  name: string;
  image: string;
}
const NFTCreator: FC<NFTCreatorProps> = (props) => {
  return (
    <div>
      <Card sx={{ maxWidth: 225, border: "2px solid" }}>
        <CardActionArea>
          <CardMedia
            sx={{ padding: "10px", borderBottom: "1px solid" }}
            component="img"
            height="225"
            image={props.image}
            alt="green iguana"
          />
          <CardContent>
            <Typography variant="h4" component="div" textAlign={"center"}>
              {props.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default NFTCreator;
