import { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea, CardActions } from "@mui/material";
import Link from "next/link";
import { useAccount } from "wagmi";
interface NFTProps {
  id: string;
  price: string;
  name: string;
  image: string;
  listed: boolean;
  ownerId: string;
  ownerWalletAddress: string;
}

const NFTCard: FC<NFTProps> = (props) => {
  const { data: account } = useAccount();
  return (
    <div>
      <Link href={`/view/nft/${props.id}`}>
        <Card
          sx={{
            border: "2px solid",
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
              height="175"
              width="500"
              image={props.image}
              alt="green iguana"
            />
            <CardContent>
              <Typography
                variant="h3"
                component="div"
                textAlign={"center"}
                sx={{ fontSize: 20 }}
              >
                {props.name}
              </Typography>
              {props.price !== "0" && (
                <Typography
                  sx={{ padding: "2px", borderTop: "1px solid" }}
                  variant="h4"
                  color="text.primary"
                  textAlign={"center"}
                >
                  {`${props.price} ETH`}
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
          <CardActions>
            {account?.address !== props.ownerWalletAddress && props.listed && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                sx={{ marginX: "auto" }}
                href={`/view/nft/${props.id}`}
              >
                BUY
              </Button>
            )}
            {!props.listed && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                sx={{ marginX: "auto" }}
                href={`/view/nft/${props.id}`}
              >
                VIEW
              </Button>
            )}
            {account?.address === props.ownerWalletAddress && props.listed && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                sx={{ marginX: "auto" }}
                href={`/view/nft/${props.id}`}
              >
                SELL
              </Button>
            )}
          </CardActions>
        </Card>
      </Link>
    </div>
  );
};

export default NFTCard;
