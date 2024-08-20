import { Box } from "@chakra-ui/react";

import { useNavigate, useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";
import { useEffect, useState } from "react";
import EventDataForm from "../common/form/EventForm";
import DocumentDataForm from "../common/form/DocumentForm";
import KeyValueForm from "../common/form/KeyValueForm";
import DatabaseInfoHeader from "../common/DatabaseInfoHeader";
import {
  EventsType,
  DocumentsType,
  KeyValueType,
  OrbitDBAccessControllerType,
} from "@orbitdb/core";
import { useIdentities } from "../../context/IdentitiesProvider";
import { useError } from "../../context/ErrorProvider";

const DatabaseInfo = () => {
  let { address } = useParams<{ address: string }>();

  const navigate = useNavigate();
  const { identity } = useIdentities();
  const [writerble, setWriteable] = useState<boolean>(false);
  const { addError } = useError();
  const { getDatabase } = useOrbitDB();
  const [Database, setDatabase] = useState<
    EventsType | DocumentsType | KeyValueType
  >();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (address) {
          const db = await getDatabase(address);
          if (db) {
            setDatabase(db);
          } else {
            navigate("/");
          }
        }
      } catch (err: any) {
        addError(`Error getting database: ${err.message}`);
      }
    };
    fetchData();
  }, [address, getDatabase]);

  const hasWriteable = async () => {
    if (!Database) {
      return false;
    }
    const access = Database.access;
    if (!identity) {
      addError("Identity is unavailable,Please set identity first");
      return false;
    }
    const orbitdbWriterSet = new Set(
      access?.type === "orbitdb"
        ? await (access as OrbitDBAccessControllerType).get("write")
        : []
    );
    const writerSet = new Set([...orbitdbWriterSet, ...(access?.write || [])]);
    return writerSet.has(identity.id) || writerSet.has("*");
  };

  useEffect(() => {
    hasWriteable().then((result) => {
      setWriteable(result);
    });
  }, [Database, identity]);

  const renderDataForm = () => {
    switch (Database?.type) {
      case "events":
        return (
          <EventDataForm
            Database={Database as EventsType}
            writerble={writerble}
          />
        );
      case "documents":
        return (
          <DocumentDataForm
            Database={Database as DocumentsType}
            writerble={writerble}
          />
        );
      case "keyvalue":
        return (
          <KeyValueForm
            Database={Database as KeyValueType}
            writerble={writerble}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Box p={4} minH={"101%"}>
      {Database ? (
        <DatabaseInfoHeader Database={Database} writerble={writerble} />
      ) : (
        <p>Database not init,Please from home open it again</p>
      )}
      {renderDataForm()}
    </Box>
  );
};

export default DatabaseInfo;
