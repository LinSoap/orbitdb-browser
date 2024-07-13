import { Button, Input } from "@chakra-ui/react";
import { useIdentities } from "../../context/IdentitiesProvider";
import { IdentityType } from "../../types/Identities";
import { useState } from "react";

const IdentityInfo = () => {
  const { identities, identity, setIdentity } = useIdentities();
  const [id, setId] = useState<string>("");

  const createIdentity = async () => {
    const identity: IdentityType = await identities.createIdentity({
      id: id,
    });
    setIdentity(identity);
  };

  return (
    <div>
      <h1>Identity Info</h1>
      <p>id:{identity?.id}</p>
      <p>publickKey:{identity?.publicKey}</p>
      <p>hash:{identity?.hash}</p>
      <p>type:{identity?.type}</p>
      <Input value={id} onChange={(event) => setId(event.target.value)}></Input>
      <Button onClick={createIdentity}>Create Identity</Button>
    </div>
  );
};

export default IdentityInfo;
