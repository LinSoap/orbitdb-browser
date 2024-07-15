import { Button, Input } from "@chakra-ui/react";
import { useIdentities } from "../../context/IdentitiesProvider";
import { useState } from "react";

const IdentityInfo = () => {
  const { identity, createIdentity, removeIdentity } = useIdentities();
  const [id, setId] = useState<string>("");

  return (
    <div>
      <h1>Identity Info</h1>
      <p>id:{identity?.id}</p>
      <p>publickKey:{identity?.publicKey}</p>
      <p>hash:{identity?.hash}</p>
      <p>type:{identity?.type}</p>
      <Input value={id} onChange={(event) => setId(event.target.value)}></Input>
      <Button onClick={() => createIdentity(id)}>Create Identity</Button>
      <Button onClick={() => removeIdentity()}>Remove Identity</Button>
    </div>
  );
};

export default IdentityInfo;
