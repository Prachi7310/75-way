import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Phone,
  ArrowUpRight,
} from "lucide-react";

const prompts = [
  {
    title: "Internship",
    desc: "Tell me about the internship program",
    icon: BriefcaseBusiness,
  },
  {
    title: "Services",
    desc: "What services does BN Technology offer?",
    icon: Building2,
  },
  {
    title: "Courses",
    desc: "Show available training programs",
    icon: GraduationCap,
  },
  {
    title: "Contact",
    desc: "Company address and contact details",
    icon: Phone,
  },
];

export default function PromptCards({
  onPromptClick,
  disabled = false,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-6">

      {/* Welcome */}

      <div className="text-center mb-8">

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 mb-4">
          <GraduationCap
            size={27}
            className="text-white"
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white">
          How can I help you?
        </h2>

        <p className="text-slate-400 mt-2">
          Ask anything about BN Technology
        </p>

      </div>

      {/* Prompt Cards */}

      <div className="grid sm:grid-cols-2 gap-4">

        {prompts.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.button
              type="button"
              key={item.title}
              disabled={disabled}
              onClick={() =>
                onPromptClick?.(item.desc)
              }
              whileHover={
                disabled
                  ? {}
                  : {
                      y: -5,
                      scale: 1.015,
                    }
              }
              whileTap={
                disabled
                  ? {}
                  : {
                      scale: 0.98,
                    }
              }
              transition={{
                duration: 0.2,
              }}
              className={`group text-left rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-5 transition-all ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5"
              }`}
            >

              <div className="flex items-start justify-between gap-4">

                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center shrink-0">
                  <Icon
                    size={20}
                    className="text-blue-400"
                  />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-600 group-hover:text-blue-400 transition"
                />

              </div>

              <h3 className="text-white font-semibold text-lg mt-5">
                {item.title}
              </h3>

              <p className="text-slate-400 text-sm mt-2 leading-6">
                {item.desc}
              </p>

            </motion.button>
          );
        })}

      </div>

    </div>
  );
}