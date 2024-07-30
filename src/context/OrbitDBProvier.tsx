import React, { createContext, useContext, useState, useEffect } from "react";
import { createOrbitDB } from "@orbitdb/core";
import { useIpfs } from "./IpfsProvider";
import { useIdentities } from "./IdentitiesProvider";
import { useCookies } from "react-cookie";
import {
  DocumentsDatabaseType,
  EventsDatabaseType,
  KeyValueDatabaseType,
} from "../types/Database";
import { RecentDatabaseType } from "../types/Orbitdb";

const OrbitDBContext = createContext<any | undefined>(undefined);

export const OrbitDBProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cookies, setCookie] = useCookies(["recentDatabase"]);
  const [recentDatabase, setRecentDatabase] = useState<RecentDatabaseType[]>(
    cookies.recentDatabase || []
  );
  const [orbitDB, setOrbitDB] = useState(null);
  const [databases, setDatabases] = useState<any[]>([]);
  const [error, setError] = useState("");
  const { ipfs } = useIpfs();
  const { identity } = useIdentities();

  useEffect(() => {
    const initOrbitdb = async () => {
      if (ipfs && identity) {
        try {
          const orbitdbInstance = await createOrbitDB({
            ipfs,
            identity,
          });
          setOrbitDB(orbitdbInstance);
        } catch (error: any) {
          setError(`Error creating OrbitDB: ${error.message}`);
        }
      }
    };

    initOrbitdb();
  }, [ipfs, identity]); // 确保依赖项数组中包含 ipfs，以便在 ipfs 实例准备就绪时触发 useEffect
  const getDatabase = (address: string) => {
    const db = databases.find(
      (db) => db.address.toString() === "/orbitdb/" + address
    );
    console.log("find db!!!" + db);
    return db ? db : null;
  };

  const addDatabase = async (
    database: EventsDatabaseType | DocumentsDatabaseType | KeyValueDatabaseType
  ) => {
    try {
      const currentTime = new Date().toISOString();

      console.log("addDatabase!!!" + database.type);
      const newRecentDatabase: RecentDatabaseType = {
        name: database.name,
        address: database.address,
        type: database.type,
        latestOpened: currentTime,
      };

      setDatabases((prevDatabases) => [...prevDatabases, database]);
      setRecentDatabase((prevRecentDatabase) => [
        newRecentDatabase,
        ...prevRecentDatabase.filter((db) => db.address !== database.address),
      ]);

      setCookie("recentDatabase", [
        newRecentDatabase,
        ...recentDatabase.filter((db) => db.address !== database.address),
      ]);
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

  return (
    <OrbitDBContext.Provider
      value={{
        orbitDB,
        databases,
        getDatabase,
        addDatabase,
        closeDatabase,
        recentDatabase,
      }}
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
