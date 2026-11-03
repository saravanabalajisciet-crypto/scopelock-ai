type StatusBadgeProps = {
  status: "PASS" | "REVIEW" | "BLOCK" | "operational";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "operational") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
        style={{ backgroundColor: "#DCEDDF", color: "#4D7958" }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "#4D7958" }}
        />
        Operational
      </span>
    );
  }

  const config = {
    PASS: {
      bg: "#DCEDDF",
      text: "#4D7958",
      border: "#B8D9BE",
      label: "PASS",
    },
    REVIEW: {
      bg: "#FFF3D6",
      text: "#B7791F",
      border: "#EDD898",
      label: "REVIEW",
    },
    BLOCK: {
      bg: "#FDE8EA",
      text: "#C34E5A",
      border: "#F9C5CA",
      label: "BLOCK",
    },
  } as const;

  const c = config[status];

  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {c.label}
    </span>
  );
}
