"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppFrame, PlannerResult, TaskForm } from "@/components/study-ui";

export default function PlannerPage() {
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState("");
  const refresh = () => { setVersion((current) => current + 1); setNotice("Plan refreshed with your latest tasks."); window.setTimeout(() => setNotice(""), 2600); };
  return <AppFrame><div className="planner-header"><Link className="text-link" href="/dashboard"><ArrowLeft size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />Back to dashboard</Link><p className="eyebrow" style={{ marginTop: 24 }}>Smart Study Plan · Prototype</p><h1>Turn busy into doable.</h1><p>Turn your assignments into a clear, manageable study plan.</p></div><div className="planner-grid"><TaskForm onGenerated={refresh} /><div key={version}><PlannerResult onRegenerate={refresh} /></div></div>{notice && <div className="toast"><Sparkles size={15} style={{ verticalAlign: "middle", marginRight: 7 }} />{notice}</div>}</AppFrame>;
}
