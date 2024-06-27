import React, { createContext, useContext, useState, useEffect } from "react";
import { createOrbitDB } from "@orbitdb/core";
import { useIpfs } from "./IpfsProvider";

const OrbitDBContext = createContext({ orbitDB: null });

export const OrbitDBProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orbitDB, setOrbitDB] = useState(null);
  const [error, setError] = useState("");
  const { ipfs } = useIpfs(); // 使用 useIpfs 自定义钩子获取 ipfs 实例

  useEffect(() => {
    const initOrbitdb = async () => {
      if (ipfs) {
        try {
          const orbitdbInstance = await createOrbitDB({ ipfs, id: "LinSoap" });
          console.log("OrbitDB instance:", orbitdbInstance);
          setOrbitDB(orbitdbInstance);
        } catch (error: any) {
          setError(`Error creating OrbitDB: ${error.message}`);
        }
      }
    };

    initOrbitdb();
  }, [ipfs]); // 确保依赖项数组中包含 ipfs，以便在 ipfs 实例准备就绪时触发 useEffect

  if (error) {
    return <div>{error}</div>;
  }

  if (!orbitDB) {
    return <div>Loading OrbitDB...</div>;
  }

  return (
    <OrbitDBContext.Provider value={{ orbitDB }}>
      {children}
    </OrbitDBContext.Provider>
  );
};

export const useOrbitDB = () => {
  return useContext(OrbitDBContext);
};
