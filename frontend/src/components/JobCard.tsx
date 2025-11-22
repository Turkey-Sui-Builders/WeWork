// src/components/JobCard.tsx
import { Briefcase } from "lucide-react";
import {
  formatAddress,
  formatTimestamp,
  getStatusText,
} from "../utils/formatters";

export interface Job {
  id: string;
  employer: string;
  freelancer: string;
  description_url: string;
  price: bigint;
  status: number;
  deadline: bigint;
  // Derived/client-side fields
  company: string; // Assuming this can be fetched or is static for now
  title: string;
}

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const statusInfo = getStatusText(job.status);

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 cursor-pointer transition-all hover:bg-slate-900/60 overflow-hidden"
    >
      <div
        className={`absolute right-0 top-0 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b ${statusInfo.borderColor} ${statusInfo.textColor} ${statusInfo.bgColor}`}
      >
        {statusInfo.text}
      </div>
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-xl font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
            <Briefcase />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
              <span className="font-medium text-slate-300">
                {formatAddress(job.employer)}
              </span>
              <span>•</span>
              <span className="text-slate-500">
                Deadline: {formatTimestamp(job.deadline)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-400">
            {job.price.toString()} SUI
          </div>
          <div className="text-xs text-slate-500 mt-1">Project Based</div>
        </div>
      </div>
    </div>
  );
}
