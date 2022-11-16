import { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  CardActionArea,
  CardActions,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import { useAccount } from "wagmi";
interface NFTProps {
  id: string;
  collectionName: string;
  logoImage: string;
  featuredImage: string;
}

const CollectionCard: FC<NFTProps> = ({
  id,
  collectionName,
  logoImage,
  featuredImage,
}) => {
  return (
    <div>
      <Link href={`/view/collection/${id}`}>
        <Card
          sx={{
            border: "solid",
            //width: 450,
            marginX: "auto",
            "&:hover": {
              opacity: [0.9, 0.8, 0.7],
              transform: "scale(1.1)",
            },
          }}
        >
          <CardActionArea>
            <CardMedia
              sx={{ padding: "10px" }}
              component="img"
              height="250"
              image={featuredImage}
              alt="green iguana"
            />
            <CardContent>
              <Avatar
                alt="Remy Sharp"
                src={logoImage}
                sx={{
                  width: 50,
                  height: 50,
                  boxShadow: 3,
                  mt: "-15%",
                  ml: 2,
                }}
                variant="rounded"
              />
              <Typography
                variant="h3"
                component="div"
                textAlign={"center"}
                sx={{ fontSize: 20 }}
              >
                {collectionName}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </div>
  );
};

export default CollectionCard;
