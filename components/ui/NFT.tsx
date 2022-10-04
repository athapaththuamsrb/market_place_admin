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
  ownerWalletAddress: string;
}

const NFT: FC<NFTProps> = (props) => {
  const { data: account } = useAccount();
  return (
    <div>
      <Link href={`/view/${props.ownerWalletAddress}/${props.id}`}>
        <Card sx={{ border: "2px solid", marginX: "auto" }}>
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
              <Typography variant="h3" component="div" textAlign={"center"} sx={{fontSize:20}}>
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
                sx={{ marginX: "32%" }} href={`/view/${props.ownerWalletAddress}/${props.id}`}
              >
                BUY
              </Button>
            )}
            {!props.listed && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                sx={{ marginX: "32%" }}
                href={`/view/${props.ownerWalletAddress}/${props.id}`}
              >
                VIEW
              </Button>
            )}
            {account?.address === props.ownerWalletAddress && props.listed && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                sx={{ marginLeft: "32%" }}
                href={`/view/${props.ownerWalletAddress}/${props.id}`}
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

export default NFT;
