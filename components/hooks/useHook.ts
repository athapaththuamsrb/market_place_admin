import { useEffect, useState } from "react";
import axios from "axios";
import {
  NFT_card,
  Profile,
  Collection_Card,
  Collection_Item,
} from "../../src/interfaces";
import { useAccount } from "wagmi";
import { gridTopLevelRowCountSelector } from "@mui/x-data-grid";
export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
};

export const useGetMyNFT = () => {
  const { data: account } = useAccount();
  const [collectedNFTCard, setCollectedNFTCard] = useState<NFT_card[]>([]);
  const [createdNFTCard, setCreatedNFTCard] = useState<NFT_card[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      if (account?.address !== undefined) {
        axios
          .post("/api/getMyNFT", {
            data: { address: account?.address },
          })
          .then((res) => {
            setCollectedNFTCard(res.data.data[0]);
            setCreatedNFTCard(res.data.data[1]);
            setIsPending(false);
            setError(null);
          })
          .catch((error) => {
            setIsPending(false);
            setError(error.message);
          });
      }
    }, 3000);
  }, [account?.address]);
  return { collectedNFTCard, createdNFTCard, isPending, error };
};

export const useGetMyProfile = () => {
  const { data: account } = useAccount();
  const [profile, setProfile] = useState<Profile>();
  const [isPendingProfile, setIsPendingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);
  useEffect(() => {
    if (account?.address !== undefined) {
      setIsPendingProfile(true);
      setTimeout(() => {
        axios
          .post("/api/getMyProfile", {
            data: { address: account?.address },
          })
          .then((res) => {
            setProfile(res.data.data);
            setIsPendingProfile(false);
            setErrorProfile(null);
          })
          .catch((error) => {
            setIsPendingProfile(false);
            setErrorProfile(error.message);
          });
      }, 3000);
    } else {
      setIsPendingProfile(false);
    }
  }, [account?.address]);
  return { profile, isPendingProfile, errorProfile };
};

export const useGetMyCollectionCard = () => {
  const { data: account } = useAccount();
  const [collectionCards, setCollectionCards] = useState<Collection_Card[]>([]);
  const [isPendingCollectionCards, setIsPendingCollectionCards] =
    useState(true);
  const [errorCollectionCards, setErrorCollectionCards] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      if (account?.address !== undefined) {
        axios
          .post("/api/getMyCollectionCard", {
            data: { address: account?.address },
          })
          .then((res) => {
            setCollectionCards(res.data.data);
            setIsPendingCollectionCards(false);
            setErrorCollectionCards(null);
          })
          .catch((error) => {
            setIsPendingCollectionCards(false);
            setErrorCollectionCards(error.message);
          });
      }
    }, 3000);
  }, [account?.address]);
  return { collectionCards, isPendingCollectionCards, errorCollectionCards };
};

export const useGetMyCollectionItem = () => {
  const { data: account } = useAccount();
  const [collectionItem, setCollectionItem] = useState<Collection_Item[]>([]);
  const [isPendingCollectionItem, setIsPendingCollectionItem] = useState(true);
  const [errorCollectionItem, setErrorCollectionItem] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      if (account?.address !== undefined) {
        axios
          .post("/api/getMyCollectionItem", {
            data: { address: account?.address },
          })
          .then((res) => {
            setCollectionItem(res.data.data);
            setIsPendingCollectionItem(false);
            setErrorCollectionItem(null);
          })
          .catch((error) => {
            setIsPendingCollectionItem(false);
            setErrorCollectionItem(error.message);
          });
      }
    }, 3000);
  }, [account?.address]);
  return { collectionItem, isPendingCollectionItem, errorCollectionItem };
};
