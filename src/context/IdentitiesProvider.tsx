import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ComposedStorage,
  Identities,
  IdentitiesType,
  Identity,
  IPFSBlockStorage,
  LRUStorage,
  Storage,
} from "@orbitdb/core";
import { useIpfs } from "./IpfsProvider";
import { useCookies } from "react-cookie";
import * as Block from "multiformats/block";
import * as dagCbor from "@ipld/dag-cbor";
import { sha256 } from "multiformats/hashes/sha2";
import { Identity as IdentityFunction } from "@orbitdb/core/src/identities";

const IdentitiesContext = createContext<any>(undefined);

export const IdentitiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["identityID"]);
  const [identities, setIdentities] = useState<IdentitiesType>();
  const [identity, setIdentity] = useState<Identity>();
  const [storage, setStorage] = useState<Storage>();
  const [error, setError] = useState("");
  const { ipfs } = useIpfs();
  const codec = dagCbor;
  const hasher = sha256;

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

  const initIdentities = async () => {
    if (ipfs) {
      try {
        const IdentitiesInstance = await Identities({ ipfs });
        setIdentities(IdentitiesInstance);
      } catch (error: any) {
        setError(`Error creating Identities: ${error.message}`);
      }
    }
  };

  const initStorage = async () => {
    if (ipfs) {
      const newstorage = await ComposedStorage(
        await LRUStorage({ size: 1000 }),
        await IPFSBlockStorage({ ipfs, pin: true })
      );
      setStorage(newstorage);
    }
  };

  const importIdentity = async (bytes: Uint8Array) => {
    const { value } = await Block.decode({ bytes, codec, hasher });
    const identity = await IdentityFunction({ ...(value as object) });

    if (!identity || !identity.hash || !identity.bytes) {
      throw new Error("import Identity faild");
    }
    setIdentity(identity);
    setCookie("identityID", identity.id);
    if (storage) {
      const existingIdentity = await storage.get(identity.hash);
      if (!existingIdentity) {
        await storage.put(identity.hash, identity.bytes);
      }
    } else {
      console.warn("Storage is not init,can't storage identity");
    }
    return identity;
  };

  const exportIdentity = async (identity: Identity) => {
    const bytes = await identity.bytes;

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
    initIdentities();
    initStorage();
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
