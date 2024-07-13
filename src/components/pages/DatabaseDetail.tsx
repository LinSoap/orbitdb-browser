import { useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";
import {
  DocumentsDatabaseType,
  EventsDatabaseType,
  KeyValueDatabaseType,
} from "../../types/Database";

const DatabaseDetail = () => {
  const { address } = useParams<{ address: string }>();
  const [error, setError] = useState<string | null>(null);
  const { getDatabase } = useOrbitDB();
  const [Database, setDatabase] = useState<
    EventsDatabaseType | DocumentsDatabaseType | KeyValueDatabaseType | null
  >(null);
  useEffect(() => {
    const init = async () => {
      setError(null);
      try {
        if (address) {
          const db = await getDatabase(address);
          setDatabase(db);
        }
      } catch (err: any) {
        setError(`Error fetching data: ${err.message}`);
      }
    };
    init();
  }, [address, getDatabase]);
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
        {Database?.access.write.map((id) => {
          return <div key={id}>{id}</div>;
        })}
      </div>
    </>
  );
};

export default DatabaseDetail;
