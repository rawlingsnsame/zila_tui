import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import { theme } from "../ui/theme.js";

interface SubmitReportScreenProps {
  onComplete: () => void;
}

const statuses = ["Draft", "Ready", "Review"] as const;

export const SubmitReportScreen: React.FC<SubmitReportScreenProps> = ({ onComplete }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [activeField, setActiveField] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<typeof statuses[number]>(statuses[0]);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => setCursorOn((v) => !v), 500);
    return () => clearInterval(interval);
  }, [submitted]);

  useInput((char, key) => {
    if (submitted) {
      if (key.escape || char === "q" || key.return) onComplete();
      return;
    }

    if (key.escape) {
      onComplete();
      return;
    }

    if (key.tab) {
      setActiveField((prev) => (prev + 1) % 4);
      return;
    }

    if (key.return) {
      if (activeField < 3) {
        setActiveField((prev) => prev + 1);
      } else if (title.trim().length > 0) {
        setSubmitted(true);
      }
      return;
    }

    if (activeField === 0) {
      if (key.backspace || key.delete) {
        setTitle((prev) => prev.slice(0, -1));
      } else if (char) {
        setTitle((prev) => prev + char);
      }
      return;
    }

    if (activeField === 1) {
      if (key.backspace || key.delete) {
        setSummary((prev) => prev.slice(0, -1));
      } else if (char) {
        setSummary((prev) => prev + char);
      }
      return;
    }

    if (activeField === 2) {
      if (key.backspace || key.delete) {
        setNotes((prev) => prev.slice(0, -1));
      } else if (char) {
        setNotes((prev) => prev + char);
      }
      return;
    }

    if (activeField === 3) {
      if (key.leftArrow || key.upArrow) {
        setStatus((prev) => {
          const index = statuses.indexOf(prev);
          const nextIndex = ((index === -1 ? 0 : index) + statuses.length - 1) % statuses.length;
          return statuses[nextIndex] as typeof statuses[number];
        });
      }
      if (key.rightArrow || key.downArrow) {
        setStatus((prev) => {
          const index = statuses.indexOf(prev);
          const nextIndex = ((index === -1 ? 0 : index) + 1) % statuses.length;
          return statuses[nextIndex] as typeof statuses[number];
        });
      }
    }
  });

  const fieldBox = (label: string, value: string, active: boolean, hint?: string) => (
    <Box flexDirection="column" borderStyle="round" borderColor={active ? theme.colors.primary : theme.colors.border} paddingX={1} paddingY={1} marginBottom={1}>
      <Text color={active ? theme.colors.primary : theme.colors.muted} bold>{label}</Text>
      <Text color={theme.colors.text}>{value || hint}</Text>
      {active && <Text color={theme.colors.dim}>{hint}</Text>}
    </Box>
  );

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text color={theme.colors.primary} bold>ZILA</Text>
        <Text color={theme.colors.muted}>› submit-report</Text>
      </Box>

      {submitted ? (
        <Box flexDirection="column" borderStyle="round" borderColor={theme.colors.success} paddingX={2} paddingY={1}>
          <Text color={theme.colors.success} bold>Report submitted successfully.</Text>
          <Box marginTop={1}>
            <Text color={theme.colors.text}>Summary</Text>
          </Box>
          <Box flexDirection="column" paddingLeft={2} marginTop={1} gap={1}>
            <Text color={theme.colors.white}>Title: {title}</Text>
            <Text color={theme.colors.white}>Status: {status}</Text>
            <Text color={theme.colors.white}>Summary: {summary || "(no summary provided)"}</Text>
            <Text color={theme.colors.white}>Notes: {notes || "(none)"}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color={theme.colors.dim}>Press any key to return to ZILA.</Text>
          </Box>
        </Box>
      ) : (
        <>
          <Box flexDirection="column" width={80} marginBottom={1}>
            {fieldBox("Title", title, activeField === 0, "Enter a one-line report title.")}
            {fieldBox("Summary", summary, activeField === 1, "Describe progress, blockers, and next steps.")}
            {fieldBox("Notes", notes, activeField === 2, "Optional details, links, or attachments.")}
            <Box flexDirection="column" borderStyle="round" borderColor={activeField === 3 ? theme.colors.primary : theme.colors.border} paddingX={1} paddingY={1}>
              <Text color={activeField === 3 ? theme.colors.primary : theme.colors.muted} bold>Status</Text>
              <Text color={theme.colors.text}>{status}</Text>
              {activeField === 3 && <Text color={theme.colors.dim}>Use ←/→ or ↑/↓ to change status.</Text>}
            </Box>
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Text color={theme.colors.secondary} bold>Preview</Text>
            <Box flexDirection="column" borderStyle="single" borderColor={theme.colors.border} paddingX={1} paddingY={1} marginTop={1}>
              <Text color={theme.colors.info}>Title:</Text>
              <Text color={theme.colors.white}>{title || "(waiting for title)"}</Text>
              <Box marginTop={1}>
                <Text color={theme.colors.info}>Summary:</Text>
              </Box>
              <Text color={theme.colors.white}>{summary || "(waiting for summary)"}</Text>
              <Box marginTop={1}>
                <Text color={theme.colors.info}>Notes:</Text>
              </Box>
              <Text color={theme.colors.white}>{notes || "(no notes)"}</Text>
            </Box>
          </Box>

          <Box marginTop={1}>
            <Text color={theme.colors.dim}>Tab</Text><Text color={theme.colors.border}> ↹ </Text><Text color={theme.colors.dim}>switch field · </Text>
            <Text color={theme.colors.dim}>Enter</Text><Text color={theme.colors.border}> ↵ </Text><Text color={theme.colors.dim}>next / submit · </Text>
            <Text color={theme.colors.dim}>Esc</Text><Text color={theme.colors.border}> ⎋ </Text><Text color={theme.colors.dim}>cancel</Text>
          </Box>
        </>
      )}
    </Box>
  );
};
