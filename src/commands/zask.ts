import type { ZilaCommand } from "./registry.js";

export const zaskCommand: ZilaCommand = {
  name: "zask",
  aliases: ["zask-hub", "tasks"],
  description: "Open the Zask task tracking hub",
  usage: "zask",
  category: "zask",
  available: true,
  handler: async (_args, output) => {
    output("Zask is your workspace for reports, task updates, and issue tracking.", "success");
    output("Use submit-report, submit-task, or complain to keep your team aligned.", "info");
  },
};

export const submitReportCommand: ZilaCommand = {
  name: "submit-report",
  aliases: ["report"],
  description: "Open the report submission page",
  usage: "submit-report",
  category: "zask",
  available: true,
  handler: async (_args, _output, shellContext) => {
    shellContext.startSubmitReport();
  },
};

export const submitTaskCommand: ZilaCommand = {
  name: "submit-task",
  aliases: ["task"],
  description: "Open the task update page",
  usage: "submit-task",
  category: "zask",
  available: true,
  handler: async (_args, _output, shellContext) => {
    shellContext.startSubmitTask();
  },
};

export const complainCommand: ZilaCommand = {
  name: "complain",
  aliases: ["issue", "raise"],
  description: "Raise a workplace complaint or issue report",
  usage: "complain <subject> [--details <details>]",
  category: "zask",
  available: true,
  handler: async (args, output) => {
    if (args.length === 0) {
      output("Usage: complain <subject> [--details <details>]", "warning");
      return;
    }

    const subject = args.join(" ");
    output(`Complaint logged: ${subject}`, "warning");
    output("Your concern has been routed for follow-up.", "dim");
  },
};
