import { useState, useEffect, useCallback } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import {
  Briefcase,
  Search,
  ShieldCheck,
  FileLock2,
  Coins,
} from "lucide-react";
import { Job, JobCard } from "../components/JobCard";
import { CreateJobModal } from "../components/CreateJobModal";
import { useSui } from "../hooks/useSui";

export default function LandingPage() {
  const [view, setView] = useState<"HOME" | "JOBS">("HOME");
  const { getJobs, createJob, isFetching, isCreating, connectedAddress } =
    useSui();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const navigateTo = (v: typeof view) => setView(v);

  const handleCreateJob = async (data: {
    freelancer: string;
    description: string;
    price: string;
    duration: string;
  }) => {
    try {
      await createJob(
        data.freelancer,
        data.description,
        data.price,
        data.duration
      );
      setCreateModalOpen(false);
      // Refresh jobs list
      fetchJobs();
    } catch (error) {
      alert(`Error creating job: ${error}`);
    }
  };

  const fetchJobs = useCallback(async () => {
    if (connectedAddress) {
      const fetchedJobs = await getJobs();
      setJobs(fetchedJobs);
    } else {
      setJobs([]);
    }
  }, [getJobs, connectedAddress]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B0E14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigateTo("HOME")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <Briefcase className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              WeWork
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button
              onClick={() => navigateTo("JOBS")}
              className={`hover:text-cyan-400 transition-colors ${
                view === "JOBS" ? "text-cyan-400" : ""
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Post a Job
            </button>
          </div>

          <div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === "HOME" && <HeroSection navigateTo={navigateTo} setCreateModalOpen={setCreateModalOpen} />}
        {view === "JOBS" && (
          <JobBoard
            jobs={jobs}
            onJobClick={(job) => alert(`Selected job: ${job.id}`)}
            isLoading={isFetching}
            onRefresh={fetchJobs}
            isConnected={!!connectedAddress}
          />
        )}
      </main>

      <CreateJobModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateJob}
        isCreating={isCreating}
      />
    </div>
  );
}

// --- Sub-Components ---

function HeroSection({ navigateTo, setCreateModalOpen }: { navigateTo: (v: any) => void, setCreateModalOpen: (open: boolean) => void }) {
  return (
    <div className="relative py-20 text-center animate-in fade-in duration-700">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-cyan-400 text-sm font-medium mb-8 animate-fade-in-up">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        Live on Sui Network
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        Build the Future of <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Web3 Work
        </span>
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        WeWork is a decentralized, secure, and transparent job platform running
        on the Sui blockchain.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => navigateTo("JOBS")}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.02]"
        >
          Explore Jobs
        </button>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-all"
        >
          Post a Job
        </button>
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: "Smart Contract Secured",
            desc: "Payments are locked in a Sui Move escrow vault.",
          },
          {
            icon: FileLock2,
            title: "Walrus & Seal Integration",
            desc: "Files are encrypted and stored on a decentralized network.",
          },
          {
            icon: Coins,
            title: "0% Commission",
            desc: "No platform fees, only standard network gas.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl text-left hover:border-cyan-500/30 transition-colors group"
          >
            <item.icon className="w-10 h-10 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobBoard({
  jobs,
  onJobClick,
  isLoading,
  onRefresh,
  isConnected,
}: {
  jobs: Job[];
  onJobClick: (j: Job) => void;
  isLoading: boolean;
  onRefresh: () => void;
  isConnected: boolean;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Open Positions</h2>
          <p className="text-slate-400">
            The latest opportunities in the Sui ecosystem.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search position or tag..."
            className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
          >
            {isLoading ? "..." : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-xl">
          <h3 className="text-xl font-bold text-white">Connect Your Wallet</h3>
          <p className="text-slate-400 mt-2">
            Please connect your wallet to view and manage jobs.
          </p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-16 text-slate-400">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-xl">
          <h3 className="text-xl font-bold text-white">No Jobs Found</h3>
          <p className="text-slate-400 mt-2">
            No jobs were found for the connected address.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
          ))}
        </div>
      )}
    </div>
  );
}
