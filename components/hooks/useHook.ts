import { useEffect, useState } from "react";
import axios from "axios";
import { NFT_card, Profile } from "../../src/interfaces";
import { useAccount } from "wagmi";
export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
};

export const useGetMyNFT = () => {
  const { data: account } = useAccount();
  const [data, setData] = useState<NFT_card[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      axios
        .post("/api/getMyNFT", {
          data: { address: account?.address },
        })
        .then((res) => {
          setData(res.data.data);
          setIsPending(false);
          setError(null);
        })
        .catch((error) => {
          setIsPending(false);
          setError(error.message);
        });
    }, 3000);
  }, [account?.address]);
  return { data, isPending, error };
};

export const useGetMyProfile = () => {
  const { data: account } = useAccount();
  const [profile, setProfile] = useState<Profile>();
  const [isPendingProfile, setIsPendingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);
  useEffect(() => {
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
  }, [account?.address]);
  return { profile, isPendingProfile, errorProfile };
};
