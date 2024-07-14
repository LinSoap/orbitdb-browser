import React, { createContext, useContext, useState, useEffect } from "react";
import { Identities } from "@orbitdb/core";
import { useIpfs } from "./IpfsProvider";
import { IdentitiesInstance, IdentityType } from "../types/Identities";
import { useCookies } from "react-cookie";

const IdentitiesContext = createContext<any | undefined>(undefined);

export const IdentitiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cookies, setCookie] = useCookies(["identityID"]);
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

  const initIdentities = async () => {
    if (ipfs) {
      try {
        const IdentitiesInstance = await Identities({ ipfs });
        console.log("Identities instance:", IdentitiesInstance);
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
    <IdentitiesContext.Provider value={{ identity, createIdentity }}>
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
