/**
 * Format a timestamp into a human-readable date string
 * @param timestamp - The timestamp to format (string or number)
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: string | number | bigint): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a Sui address to show only the beginning and end
 * @param address - The full Sui address
 * @returns Formatted address string
 */
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Gets a display-friendly text and color for a job status
 * @param status The status code from the smart contract
 */
export function getStatusText(status: number): {
  text: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  switch (status) {
    case 1: // STATUS_IN_PROGRESS
      return {
        text: "IN PROGRESS",
        textColor: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
      };
    case 2: // STATUS_SUBMITTED
      return {
        text: "SUBMITTED",
        textColor: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
      };
    case 3: // STATUS_COMPLETED
      return {
        text: "COMPLETED",
        textColor: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
      };
    case 4: // STATUS_CANCELLED
      return {
        text: "CANCELLED",
        textColor: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
      };
    default:
      return {
        text: "UNKNOWN",
        textColor: "text-gray-500",
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/20",
      };
  }
}

/**
 * Convert a MIST amount to a SUI string
 * @param mist - The amount in MIST
 */
export function fromMIST(mist: bigint): string {
  return (Number(mist) / 1_000_000_000).toFixed(2);
}