import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ListBotsResponse, BotState } from "@shared/schema";
import { useTheme } from "@/components/theme-provider"; // asumsi ThemeProvider sudah ada

export default function BotListPage() {
  const queryClient = useQueryClient();
  const { theme } = useTheme(); // 'light' | 'dark'

  // Fetch daftar bot
  const { data, isLoading } = useQuery<ListBotsResponse>({
    queryKey: ["/api/list"],
    refetchInterval: 5000,
  });

  // Stop bot
  const stopBotMutation = useMutation({
    mutationFn: (username: string) =>
      fetch(`/api/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/list"] }),
  });

  // Start bot
  const startBotMutation = useMutation({
    mutationFn: (username: string) =>
      fetch(`/api/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/list"] }),
  });

  if (isLoading) return <p>Loading bots...</p>;

  // Theme-aware classes
  const tableBorder = theme === "light" ? "border-gray-300" : "border-gray-700";
  const headerBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const textColor = theme === "light" ? "text-black" : "text-white";

  return (
    <div className={`p-6 ${textColor}`}>
      <h1 className="text-2xl font-bold mb-6">Bot List</h1>
      <table className={`table-auto w-full border-collapse border ${tableBorder}`}>
        <thead>
          <tr className={headerBg}>
            <th className={`border px-4 py-2 ${tableBorder}`}>Username</th>
            <th className={`border px-4 py-2 ${tableBorder}`}>Status</th>
            <th className={`border px-4 py-2 ${tableBorder}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.bots.map((bot: BotState) => (
            <tr key={bot.username}>
              <td className={`border px-4 py-2 ${tableBorder}`}>{bot.username}</td>
              <td className={`border px-4 py-2 ${tableBorder}`}>
                {bot.status === "connected" ? (
                  <span className="text-emerald-600 font-semibold">{bot.status}</span>
                ) : bot.status === "reconnecting" ? (
                  <span className="text-amber-500 font-semibold">{bot.status}</span>
                ) : (
                  <span className="text-rose-600 font-semibold">{bot.status}</span>
                )}
              </td>
              <td className={`border px-4 py-2 ${tableBorder} space-x-2`}>
                {bot.status === "connected" ? (
                  <button
                    className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded"
                    onClick={() => stopBotMutation.mutate(bot.username)}
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
                    onClick={() => startBotMutation.mutate(bot.username)}
                  >
                    Start
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
