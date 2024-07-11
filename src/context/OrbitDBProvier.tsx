import React, { createContext, useContext, useState, useEffect } from "react";
import { createOrbitDB } from "@orbitdb/core";
import { useIpfs } from "./IpfsProvider";
import { OrbitDBContextType } from "../types/Orbitdb";

const OrbitDBContext = createContext<OrbitDBContextType | undefined>(undefined);

export const OrbitDBProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orbitDB, setOrbitDB] = useState(null);
  const [databases, setDatabases] = useState<any[]>([]);
  const [error, setError] = useState("");
  const { ipfs } = useIpfs(); // 使用 useIpfs 自定义钩子获取 ipfs 实例

  useEffect(() => {
    const initOrbitdb = async () => {
      if (ipfs) {
        try {
          const orbitdbInstance = await createOrbitDB({ ipfs, id: "LinSoap" });
          // console.log("OrbitDB instance:", orbitdbInstance);
          setOrbitDB(orbitdbInstance);
        } catch (error: any) {
          setError(`Error creating OrbitDB: ${error.message}`);
        }
      }
    };

    initOrbitdb();
  }, [ipfs]); // 确保依赖项数组中包含 ipfs，以便在 ipfs 实例准备就绪时触发 useEffect
  const getDatabase = (address: string) => {
    const db = databases.find(
      (db) => db.address.toString() === "/orbitdb/" + address
    );
    console.log("find db!!!" + db);
    return db ? db : null;
  };

  const addDatabase = async (database: any) => {
    try {
      setDatabases((prevDatabases) => [...prevDatabases, database]);
      console.log(databases);
    } catch (error: any) {
      setError(`Error opening database: ${error.message}`);
      throw error;
    }
  };

  const closeDatabase = async (database: any) => {
    await database.close();
    setDatabases((prevDatabases) =>
      prevDatabases.filter((db) => db !== database)
    );
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!orbitDB) {
    return <div>Loading OrbitDB...</div>;
  }

  return (
    <OrbitDBContext.Provider
      value={{ orbitDB, databases, getDatabase, addDatabase, closeDatabase }}
    >
      {children}
    </OrbitDBContext.Provider>
  );
};

export const useOrbitDB = () => {
  const context = useContext(OrbitDBContext);
  if (context === undefined) {
    throw new Error("useOrbitDB must be used within an OrbitDBProvider");
  }
  return context;
};
