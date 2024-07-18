import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ComposedStorage,
  Identities,
  IPFSBlockStorage,
  KeyStore,
  LevelStorage,
  LRUStorage,
} from "@orbitdb/core";
import { useIpfs } from "./IpfsProvider";
import { IdentitiesInstance, IdentityType } from "../types/Identities";
import { useCookies } from "react-cookie";

const IdentitiesContext = createContext<any | undefined>(undefined);

export const IdentitiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["identityID"]);
  const [identities, setIdentities] = useState<IdentitiesInstance>();
  const [identity, setIdentity] = useState<IdentityType>();
  const [error, setError] = useState("");
  const { ipfs } = useIpfs();

  const createIdentity = async (id: string) => {
    try {
      const identityInstance = await identities.createIdentity({ id });
      setIdentity(identityInstance);
      setCookie("identityID", id);
    } catch (error: any) {
      setError(`Error creating identity: ${error.message}`);
    }
  };

  const removeIdentity = async () => {
    try {
      setIdentity(undefined);
      removeCookie("identityID");
    } catch (error: any) {
      setError(`Error creating identity: ${error.message}`);
    }
  };

  const initIdentities = async () => {
    if (ipfs) {
      try {
        const storage1 = await ComposedStorage(
          await LRUStorage(),
          await LevelStorage()
        );
        const keystore = await KeyStore(
          await ComposedStorage(storage1, await IPFSBlockStorage({ ipfs }))
        );
        const IdentitiesInstance = await Identities({ ipfs, keystore });
        // console.log("OrbitDB instance:", orbitdbInstance);
        setIdentities(IdentitiesInstance);
      } catch (error: any) {
        setError(`Error creating Identities: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    initIdentities();
  }, [ipfs]);

  useEffect(() => {
    if (identities && cookies.identityID) {
      createIdentity(cookies.identityID);
    }
  }, [identities]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!Identities) {
    return <div>Loading OrbitDB...</div>;
  }

  return (
    <IdentitiesContext.Provider
      value={{ identity, createIdentity, removeIdentity }}
    >
      {children}
    </IdentitiesContext.Provider>
  );
};

export const useIdentities = () => {
  const context = useContext(IdentitiesContext);
  if (context === undefined) {
    throw new Error("useOrbitDB must be used within an OrbitDBProvider");
  }
  return context;
};
