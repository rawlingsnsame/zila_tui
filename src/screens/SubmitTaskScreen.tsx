import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import { theme } from "../ui/theme.js";

interface SubmitTaskScreenProps {
  onComplete: () => void;
}

const taskStates = ["Pending", "In Progress", "Done"] as const;

export const SubmitTaskScreen: React.FC<SubmitTaskScreenProps> = ({ onComplete }) => {
  const [taskId, setTaskId] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<typeof taskStates[number]>(taskStates[0]);
  const [activeField, setActiveField] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setCursorOn((v) => !v), 500);
    return () => clearInterval(interval);
  }, [completed]);

  useInput((char, key) => {
    if (completed) {
      if (key.escape || char === "q" || key.return) onComplete();
      return;
    }

    if (key.escape) {
      onComplete();
      return;
    }

    if (key.tab) {
      setActiveField((prev) => (prev + 1) % 3);
      return;
    }

    if (key.return) {
      if (activeField < 2) {
        setActiveField((prev) => prev + 1);
      } else if (taskId.trim().length > 0) {
        setCompleted(true);
      }
      return;
    }

    if (activeField === 0) {
      if (key.backspace || key.delete) setTaskId((prev) => prev.slice(0, -1));
      else if (char) setTaskId((prev) => prev + char);
      return;
    }

    if (activeField === 1) {
      if (key.backspace || key.delete) setDescription((prev) => prev.slice(0, -1));
      else if (char) setDescription((prev) => prev + char);
      return;
    }

    if (activeField === 2) {
      if (key.leftArrow || key.upArrow) {
        setState((prev) => {
          const index = taskStates.indexOf(prev);
          const nextIndex = ((index === -1 ? 0 : index) + taskStates.length - 1) % taskStates.length;
          return taskStates[nextIndex] as typeof taskStates[number];
        });
      }
      if (key.rightArrow || key.downArrow) {
        setState((prev) => {
          const index = taskStates.indexOf(prev);
          const nextIndex = ((index === -1 ? 0 : index) + 1) % taskStates.length;
          return taskStates[nextIndex] as typeof taskStates[number];
        });
      }
    }
  });

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={theme.colors.primary} bold>ZILA</Text>
        <Text color={theme.colors.muted}>› submit-task</Text>
      </Box>

      {completed ? (
        <Box flexDirection="column" borderStyle="round" borderColor={theme.colors.success} paddingX={2} paddingY={1}>
          <Text color={theme.colors.success} bold>Task update recorded.</Text>
          <Box marginTop={1}>
            <Text color={theme.colors.text}>Task {taskId} is now <Text color={theme.colors.white} bold>{state}</Text>.</Text>
          </Box>
          <Box marginTop={1}>
            <Text color={theme.colors.text}>{description || "No further details provided."}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color={theme.colors.dim}>Press any key to return.</Text>
          </Box>
        </Box>
      ) : (
        <>
          <Box flexDirection="column" width={80} marginBottom={1}>
            <Box flexDirection="column" borderStyle="round" borderColor={activeField === 0 ? theme.colors.primary : theme.colors.border} paddingX={1} paddingY={1} marginBottom={1}>
              <Text color={activeField === 0 ? theme.colors.primary : theme.colors.muted} bold>Task ID</Text>
              <Text color={theme.colors.text}>{taskId || "Add the task identifier."}</Text>
            </Box>
            <Box flexDirection="column" borderStyle="round" borderColor={activeField === 1 ? theme.colors.primary : theme.colors.border} paddingX={1} paddingY={1} marginBottom={1}>
              <Text color={activeField === 1 ? theme.colors.primary : theme.colors.muted} bold>Description</Text>
              <Text color={theme.colors.text}>{description || "Describe the task work or update."}</Text>
            </Box>
            <Box flexDirection="column" borderStyle="round" borderColor={activeField === 2 ? theme.colors.primary : theme.colors.border} paddingX={1} paddingY={1}>
              <Text color={activeField === 2 ? theme.colors.primary : theme.colors.muted} bold>Status</Text>
              <Text color={theme.colors.text}>{state}</Text>
              {activeField === 2 && <Text color={theme.colors.dim}>Use arrow keys to choose state.</Text>}
            </Box>
          </Box>

          <Box flexDirection="column" borderStyle="single" borderColor={theme.colors.border} paddingX={1} paddingY={1}>
            <Text color={theme.colors.secondary} bold>Live Task Preview</Text>
            <Box marginTop={1}>
              <Text color={theme.colors.info}>Task</Text> <Text color={theme.colors.white}>{taskId || "<empty>"}</Text>
            </Box>
            <Box marginTop={1}>
              <Text color={theme.colors.info}>State</Text> <Text color={theme.colors.white}>{state}</Text>
            </Box>
            <Box marginTop={1}>
              <Text color={theme.colors.info}>Details</Text> <Text color={theme.colors.white}>{description || "No description yet."}</Text>
            </Box>
          </Box>

          <Box marginTop={1}>
            <Text color={theme.colors.dim}>Tab</Text><Text color={theme.colors.border}> ↹ </Text><Text color={theme.colors.dim}>switch · </Text>
            <Text color={theme.colors.dim}>Enter</Text><Text color={theme.colors.border}> ↵ </Text><Text color={theme.colors.dim}>next / submit · </Text>
            <Text color={theme.colors.dim}>Esc</Text><Text color={theme.colors.border}> ⎋ </Text><Text color={theme.colors.dim}>cancel</Text>
          </Box>
        </>
      )}
    </Box>
  );
};
