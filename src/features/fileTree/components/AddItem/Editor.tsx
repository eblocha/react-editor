import { AppDispatch } from "@/stores";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { abortCreate } from "../../store";

type IProps = {
  onSubmit: (name: string) => void;
};

export const Editor = ({ onSubmit }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setName(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      if (name) onSubmit(name);
    },
    [name, onSubmit]
  );

  const handleBlur = useCallback(() => {
    dispatch(abortCreate());
  }, [dispatch]);

  return (
    <form className="h-full w-full relative" onSubmit={handleSubmit}>
      <input
        className="h-full w-full ring-1 ring-blue-400 ring-inset"
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    </form>
  );
};
