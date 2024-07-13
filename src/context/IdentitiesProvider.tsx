import React, { createContext, useContext, useState, useEffect } from "react";
import { Identities } from "@orbitdb/core";
import { useIpfs } from "./IpfsProvider";
import { IdentityType } from "../types/Identities";

const IdentitiesContext = createContext<any | undefined>(undefined);

export const IdentitiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [identities, setIdentities] = useState(null);
  const [identity, setIdentity] = useState<IdentityType | null>(null);
  const [error, setError] = useState("");
  const { ipfs } = useIpfs(); // 使用 useIpfs 自定义钩子获取 ipfs 实例

  useEffect(() => {
    const initIdentities = async () => {
      if (ipfs) {
        try {
          const IdentitiesInstance = await Identities({ ipfs });
          // console.log("OrbitDB instance:", orbitdbInstance);
          setIdentities(IdentitiesInstance);
        } catch (error: any) {
          setError(`Error creating Identities: ${error.message}`);
        }
      }
    };

    initIdentities();
  }, [ipfs]); // 确保依赖项数组中包含 ipfs，以便在 ipfs 实例准备就绪时触发 useEffect

  if (error) {
    return <div>{error}</div>;
  }

  if (!Identities) {
    return <div>Loading OrbitDB...</div>;
  }

  return (
    <IdentitiesContext.Provider value={{ identities, identity, setIdentity }}>
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
