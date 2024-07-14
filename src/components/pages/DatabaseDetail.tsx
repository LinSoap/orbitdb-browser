import { useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";
import {
  DocumentsDatabaseType,
  EventsDatabaseType,
  KeyValueDatabaseType,
} from "../../types/Database";
import OrbitDBController from "../common/OrbitDBController";
import { OrbitDBAccessControllerType } from "../../types/Access";

const DatabaseDetail = () => {
  const { address } = useParams<{ address: string }>();
  const [error, setError] = useState<string | null>(null);
  const { getDatabase } = useOrbitDB();
  const [orbitDBWriters, setorbitDBWriters] = useState<Set<string>>(
    new Set<string>()
  );
  const [Database, setDatabase] = useState<
    EventsDatabaseType | DocumentsDatabaseType | KeyValueDatabaseType | null
  >(null);

  const init = async () => {
    setError(null);
    try {
      if (address) {
        const db = await getDatabase(address);
        setDatabase(db);
        if (Database?.access.type === "orbitdb") {
          const orbitDBWriters = await (
            Database?.access as OrbitDBAccessControllerType
          ).get("write");

          setorbitDBWriters(orbitDBWriters);
          console.log("get orbitDBWriters");
        }
      }
    } catch (err: any) {
      setError(`Error fetching data: ${err.message}`);
    }
  };
  const grantID = async (ID: string) => {
    if (Database?.access) {
      await (Database?.access as OrbitDBAccessControllerType).grant(
        "write",
        ID
      );
      await init(); // 确保在授予权限后重新初始化数据
    }
  };

  const revokeID = async (ID: string) => {
    if (Database?.access) {
      await (Database?.access as OrbitDBAccessControllerType).revoke(
        "write",
        ID
      );
      await init(); // 确保在撤销权限后重新初始化数据
    }
  };
  useEffect(() => {
    init();
  }, [address, getDatabase, Database]);

  return (
    <>
      {error && <div>{error}</div>}
      <h1>Address : {Database?.address}</h1>
      <h1>name : {Database?.name}</h1>

      <h1>Address : {JSON.stringify(Database?.meta)}</h1>

      <h1>Access Info</h1>
      <div>Access address:{Database?.access.address}</div>
      <div>Access type:{Database?.access.type}</div>

      <h1>
        Peers:
        {Array.from(Database?.peers || []).map((peer: string) => (
          <div key={peer}>{peer}</div>
        ))}
      </h1>
      <div>
        Access writable
        {Database?.access.write.map((id: string) => {
          return <div key={id}>{id}</div>;
        })}
      </div>
      {Database?.access.type === "orbitdb" ? (
        <OrbitDBController
          writers={orbitDBWriters}
          setWriters={setorbitDBWriters}
          grantID={grantID}
          revokeID={revokeID}
        />
      ) : null}
    </>
  );
};

export default DatabaseDetail;
