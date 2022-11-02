import { useEffect, useState } from "react";
import axios from "axios";
import {
  NFT_Card,
  Profile,
  Collection_Card,
  Collection_Item,
} from "../../src/interfaces";
import { useAccount } from "wagmi";
import jwt_decode from "jwt-decode";
import { Session } from "./../../src/interfaces";
const jwt = require("jsonwebtoken");
import authService from "../../services/auth.service";

export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

export const useGetMyNFT = () => {
  const { data: account } = useAccount();
  const [collectedNFTCard, setCollectedNFTCard] = useState<NFT_Card[]>([]);
  const [createdNFTCard, setCreatedNFTCard] = useState<NFT_Card[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      if (account?.address !== undefined) {
        axios
          .post("/api/getMyNFT", {
            data: { token: authService.getUserToken() },
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (account?.address !== undefined) {
      setIsPendingProfile(true);
      setTimeout(() => {
        axios
          .post("/api/getMyProfile", {
            data: {
              address: account?.address,
              // token: authService.getUserToken(),
            },
          })
          .then((res) => {
            setProfile(res.data.data);
            setIsPendingProfile(false);
            setErrorProfile(null);
            //local storage to stay logged in between page refreshes
            localStorage.setItem("token", res.data.token);
            let decoded: Session = jwt_decode(res.data.token);
            switch (decoded.type) {
              case "Admin":
                setIsAdmin(true);
                break;
              default:
                break;
            }
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
  return { profile, isPendingProfile, errorProfile, isAdmin };
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
            data: { token: authService.getUserToken() },
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
            data: {
              // address: account?.address,
              token: authService.getUserToken(),
            },
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
