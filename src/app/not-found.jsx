import Link from "next/link";
import { Search, ArrowRight, Home, Phone, Layers, Activity } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-2xl w-full text-center">
        
        {/* Reassuring Medical Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
          <Activity size={14} className="animate-pulse" />
          <span>Human Biomedical LLP &bull; Equipment &amp; Diagnostics Catalog</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Looking for Laboratory or Medical Equipment?
        </h1>

        <p className="text-base text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
          The specific model or page you are looking for may have been updated in our central catalog. Human Biomedical LLP supplies 100+ diagnostic analyzers and medical instruments with warranty and nationwide technical support.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Search size={18} />
            <span>Explore Full Catalog</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm transition-all"
          >
            <Phone size={18} className="text-blue-600" />
            <span>Contact Sales Team</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4 py-3.5 text-sm"
          >
            <Home size={16} />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Quick Discovery Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <Link
            href="/products"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition group"
          >
            <div className="text-xl mb-1">🔬</div>
            <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
              <span>Laboratory Instruments</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Analyzers &amp; Clinical Systems</p>
          </Link>

          <Link
            href="/products"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition group"
          >
            <div className="text-xl mb-1">🏥</div>
            <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
              <span>Hospital Equipment</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">ICU &amp; Diagnostic Solutions</p>
          </Link>

          <Link
            href="/contact"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition group"
          >
            <div className="text-xl mb-1">📋</div>
            <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
              <span>Instant Quotation</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Custom Price Proposals</p>
          </Link>
        </div>

      </div>
    </div>
  );
}