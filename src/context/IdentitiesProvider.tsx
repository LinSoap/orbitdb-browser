import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Identities,
  IdentitiesType,
  Identity,
  KeyStore,
  KeyStoreType,
} from "@orbitdb/core";
import { useIpfs } from "./IpfsProvider";
import { useCookies } from "react-cookie";
import * as crypto from "@libp2p/crypto";
import pathJoin from "../utils/path-join";

const IdentitiesContext = createContext<any>(undefined);

export const IdentitiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["identityID"]);
  const [identities, setIdentities] = useState<IdentitiesType>();
  const [identity, setIdentity] = useState<Identity>();
  const [keyStore, setKeyStore] = useState<KeyStoreType>();
  const [error, setError] = useState("");
  const { ipfs } = useIpfs();

  const createIdentity = async (id: string) => {
    try {
      if (!identities) {
        throw new Error("Identities not initialized");
      }
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

  const initKeyStore = async () => {
    if (ipfs) {
      const keyStore = await KeyStore({
        path: pathJoin("./orbitdb", "identities"),
      });
      setKeyStore(keyStore);
    }
  };

  const initIdentities = async () => {
    if (ipfs) {
      try {
        const IdentitiesInstance = await Identities({
          ipfs,
          keystore: keyStore,
        });
        setIdentities(IdentitiesInstance);
      } catch (error: any) {
        setError(`Error creating Identities: ${error.message}`);
      }
    }
  };

  const importIdentity = async (id: string, bytes: Uint8Array) => {
    const keys = await crypto.keys.unmarshalPrivateKey(bytes);
    const key = {
      publicKey: keys.public.marshal(),
      privateKey: keys.marshal(),
    };
    console.log(keys);
    await keyStore?.addKey(id, key);

    const identity = await identities?.createIdentity({ id });
    setIdentity(identity);
    setCookie("identityID", id);

    console.log(identity);
  };

  const exportIdentity = async (identity: Identity) => {
    const key = await keyStore?.getKey(identity.id);
    const bytes = key?.bytes;

    const blob = new Blob([bytes], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `identity_${identity.id}.bin`; // 设置文件名
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return bytes;
  };

  useEffect(() => {
    initKeyStore();
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
      value={{
        identity,
        createIdentity,
        removeIdentity,
        exportIdentity,
        importIdentity,
      }}
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
