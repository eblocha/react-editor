import { useCallback, useLayoutEffect, useRef, useState } from "react";

type IProps = {
  onSubmit: (name: string) => void;
  onAbort: () => void;
  initialName?: string;
};

export const Editor = ({ onSubmit, onAbort, initialName = "" }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialName);

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
    onAbort();
  }, [onAbort]);

  useLayoutEffect(() => {
    // Highlight name on mount
    inputRef.current?.select();
  }, []);

  return (
    <form className="h-full w-full relative" onSubmit={handleSubmit}>
      <input
        className="h-full w-full ring-1 ring-blue-400 ring-inset"
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        ref={inputRef}
      />
    </form>
  );
};
