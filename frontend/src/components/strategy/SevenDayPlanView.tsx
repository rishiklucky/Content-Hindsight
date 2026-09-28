import React from 'react';
import { Calendar, CheckCircle2, Bookmark, Share2, Sparkles, Brain, ArrowUpRight } from 'lucide-react';
import { DayPlanItem } from '../../types';

interface SevenDayPlanViewProps {
  plan: DayPlanItem[];
}

export const SevenDayPlanView: React.FC<SevenDayPlanViewProps> = ({ plan }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-400" />
          7-Day Content Execution Roadmap
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Sequenced by developer engagement cadence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0d1322] p-4 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/5 group"
          >
            <div className="space-y-3">
              {/* Day header & platform badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 font-mono tracking-tight">
                  {item.day}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.platform}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {item.contentType}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors leading-snug">
                {item.topicTitle}
              </h4>

              {/* Hook */}
              <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Opening Hook:
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{item.hook}"
                </p>
              </div>

              {/* Outline Points */}
              {item.outline && item.outline.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Key Sections:
                  </span>
                  <ul className="text-xs text-slate-400 space-y-1 pl-1">
                    {item.outline.map((pt, i) => (
                      <li key={i} className="truncate">
                        • {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom memory influence badge */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-start gap-1.5 text-[11px] text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                <Brain className="h-3.5 w-3.5 shrink-0 mt-0.5 text-purple-400" />
                <span className="leading-snug">{item.memoryInfluence}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
