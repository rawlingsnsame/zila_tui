import React, { useState, useMemo } from "react";
import { Box, Text, useInput } from "ink";
import { theme } from "../ui/theme.js";
import { Divider } from "../ui/Divider.js";
import { getRegisteredCommands, type ZilaCommand } from "../commands/registry.js";

const CATEGORIES: Array<{ key: ZilaCommand["category"]; label: string }> = [
  { key: "zask", label: "Zask" },
  { key: "workflow", label: "Workflow" },
  { key: "search", label: "Search" },
  { key: "agent", label: "Agent" },
  { key: "setup", label: "Setup" },
  { key: "info", label: "Info" },
];

interface HelpScreenProps {
  onClose: () => void;
  onSelect: (commandName: string) => void;
  clearHistory?: () => void;
}

export const HelpScreen: React.FC<HelpScreenProps> = ({ onClose, onSelect }) => {
  const allCommands = useMemo(() => getRegisteredCommands(), []);
  const selectableCmds = useMemo(() => allCommands.filter((c) => c.available), [allCommands]);
  const [activeIdx, setActiveIdx] = useState(0);

  useInput((char, key) => {
    if (key.escape || char === "q") {
      onClose();
      return;
    }

    if (key.return) {
      const cmd = selectableCmds[activeIdx];
      if (cmd) onSelect(cmd.name);
      return;
    }

    if (key.upArrow) {
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : selectableCmds.length - 1));
      return;
    }

    if (key.downArrow) {
      setActiveIdx((prev) => (prev < selectableCmds.length - 1 ? prev + 1 : 0));
      return;
    }
  });

  const activeCommand = selectableCmds[activeIdx];

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} borderStyle="round" borderColor={theme.colors.border} marginTop={1}>
      <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
        <Box flexDirection="column" gap={0}>
          <Text color={theme.colors.primary} bold>ZILA</Text>
          <Text color={theme.colors.muted}>Interactive command reference</Text>
        </Box>

        <Box flexDirection="column" borderStyle="single" borderColor={theme.colors.accent} paddingX={1} paddingY={1}>
          <Text color={theme.colors.secondary} bold>Zask Task Hub</Text>
          <Text color={theme.colors.text}>Submit reports, update tasks, and log issues.</Text>
        </Box>
      </Box>

      <Divider width={64} />

      <Box flexDirection="column" paddingX={1} paddingY={1} borderStyle="single" borderColor={theme.colors.accent} marginY={1}>
        <Text bold color={theme.colors.secondary}>Zask quick start</Text>
        <Box flexDirection="column" marginTop={1} gap={1}>
          <Text color={theme.colors.text}>• Run <Text bold>zask</Text> to open the task hub.</Text>
          <Text color={theme.colors.text}>• Use <Text bold>submit-report</Text> to send daily updates.</Text>
          <Text color={theme.colors.text}>• Use <Text bold>submit-task</Text> to update a task state.</Text>
          <Text color={theme.colors.text}>• Use <Text bold>complain</Text> to file an incident note.</Text>
        </Box>
      </Box>

      {CATEGORIES.map(({ key, label }) => {
        const cmds = allCommands.filter((c) => c.category === key);
        if (cmds.length === 0) return null;

        return (
          <Box flexDirection="column" marginTop={1} key={key}>
            <Text bold color={theme.colors.muted}>{label.toUpperCase()}</Text>
            <Box flexDirection="column" gap={1} marginTop={1}>
              {cmds.map((cmd) => {
                const isSelected = cmd.available && selectableCmds[activeIdx]?.name === cmd.name;

                return (
                  <Box key={cmd.name} flexDirection="row" alignItems="center" gap={1}>
                    <Text color={cmd.available ? (isSelected ? theme.colors.primary : theme.colors.dim) : theme.colors.border}>
                      {cmd.available ? (isSelected ? theme.symbols.pointer : " ") : "·"}
                    </Text>
                    <Box flexDirection="column" width={22}>
                      <Text color={!cmd.available ? theme.colors.dim : isSelected ? theme.colors.white : theme.colors.info} bold={isSelected}>
                        {cmd.name}
                      </Text>
                      <Text color={cmd.available ? theme.colors.muted : theme.colors.border}>{cmd.usage}</Text>
                    </Box>
                    <Text color={cmd.available ? (isSelected ? theme.colors.text : theme.colors.muted) : theme.colors.border}>
                      {cmd.description}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}

      {activeCommand && (
        <Box flexDirection="column" marginTop={1} borderStyle="single" borderColor={theme.colors.border} paddingX={1} paddingY={1}>
          <Text color={theme.colors.secondary} bold>Selected</Text>
          <Text color={theme.colors.text}>{activeCommand.description}</Text>
          <Box flexDirection="row" gap={1} marginTop={1}>
            <Text color={theme.colors.info}>Usage:</Text>
            <Text color={theme.colors.white}>{activeCommand.usage}</Text>
          </Box>
        </Box>
      )}

      <Box marginTop={2} paddingTop={1} borderStyle="single" borderTop borderColor={theme.colors.border} borderBottom={false} borderLeft={false} borderRight={false}>
        <Text color={theme.colors.dim}>
          <Text color={theme.colors.text}>↑/↓</Text> move · <Text color={theme.colors.text}>Enter</Text> open · <Text color={theme.colors.text}>Esc/Q</Text> close
        </Text>
      </Box>
    </Box>
  );
};
