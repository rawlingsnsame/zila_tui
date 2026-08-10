import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { theme } from "../ui/theme.js";
import { Cursor } from "../ui/Cursor.js";

interface InputPromptProps {
  running: boolean;
  onSubmit: (input: string) => void;
}

export const InputPrompt: React.FC<InputPromptProps> = ({ running, onSubmit }) => {
  const [input, setInput] = useState("");
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    if (running) return;
    setCursorOn(true);
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, [running]);

  useInput((char, key) => {
    if (running) return;
    if (key.return) {
      const trimmed = input.trim();
      setInput("");
      onSubmit(trimmed);
      return;
    }
    if (key.backspace || key.delete) {
      setInput((p) => p.slice(0, -1));
      return;
    }
    if (key.ctrl || key.meta) return;
    if (char) {
      setInput((p) => p + char);
      setCursorOn(true);
    }
  });

  if (running) return null;

  return (
    <Box flexDirection="row" gap={1}>
      <Text color={theme.colors.muted} bold>zila</Text>
      <Text color={theme.colors.primary} bold>{theme.symbols.pointer}</Text>
      <Text color={theme.colors.white}>{input}</Text>
      <Cursor on={cursorOn} />
    </Box>
  );
};
