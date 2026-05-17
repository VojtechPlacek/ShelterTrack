import Icon from "@mdi/react";
import { mdiAlertCircle } from "@mdi/js";

const Error = ({ message }) => {
  return (
    <div className="d-flex align-items-center gap-2 text-danger">
      <Icon path={mdiAlertCircle} size={1} color={"red"} />
      <span>{message}</span>
    </div>
  );
};

export default Error;
