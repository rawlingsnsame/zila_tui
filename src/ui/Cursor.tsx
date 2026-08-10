import React from "react";
import { Text } from "ink";
import { theme } from "./theme.js";

export const Cursor: React.FC<{ on: boolean }> = ({ on }) => (
  <Text color={theme.colors.primary}>{on ? "▊" : " "}</Text>
);
