import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-2">
      <span className="inline-block w-1 h-4 rounded-full bg-orange-400/70 shrink-0" />
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5 text-gray-300 text-sm leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400/60 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-orange-400 underline underline-offset-2 cursor-pointer hover:text-orange-300 transition-colors">
          Terms &amp; Conditions
        </span>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto bg-zinc-950 border border-white/10 text-white p-0 rounded-2xl shadow-2xl">

        {/* ── Header Banner ── */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-white/10 px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white leading-snug">
              Ticket to Hornbill
              <span className="block text-orange-400 text-base sm:text-lg font-semibold mt-0.5">
                India's Biggest Band Battle
              </span>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                <span>📅 <strong className="text-gray-300">16–17 October 2026</strong></span>
                <span>📍 <strong className="text-gray-300">Talkatora Stadium, New Delhi</strong></span>
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Day breakdown pill */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
              <p className="text-orange-400 font-semibold">16th October</p>
              <p className="text-gray-400 mt-0.5">Nagaland's Culture Showcase</p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
              <p className="text-orange-400 font-semibold">17th October</p>
              <p className="text-gray-400 mt-0.5">Band Battle</p>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pb-6 mt-5 space-y-6">

          {/* Round 1 */}
          <section>
            <SectionHeading>Round 1 – Video Submission</SectionHeading>
            <BulletList items={[
              <>Bands must submit a live performance video/link on or before <strong className="text-white">25th August 2026</strong>.</>,
              "A jury will shortlist 10 bands for the final rounds.",
            ]} />
          </section>

          {/* Video Guidelines */}
          <section>
            <SectionHeading>Video Submission Guidelines</SectionHeading>
            <BulletList items={[
              "All applicants must upload their audition video link in the designated field of the audition form.",
              "The video must be hosted on a publicly accessible platform such as YouTube, Vimeo, or any other online video-sharing platform, ensuring the link can be opened without restrictions.",
              "Private or password-protected videos will not be considered unless access details are provided.",
              "The organizers are not responsible for broken, invalid, or inaccessible links submitted by applicants.",
              "Only videos submitted through a valid link in the audition form will be accepted for evaluation.",
            ]} />
          </section>

          {/* Round 2 */}
          <section>
            <SectionHeading>Round 2 – Selection Announcement &amp; Live Performance</SectionHeading>
            <BulletList items={[
              <>TaFMA will announce the 10 selected bands on <strong className="text-white">31st August 2026</strong> via social media and its website.</>,
              "Bands must perform live as per the given schedule.",
              "No rescheduling of performance slots will be entertained.",
              <>Once selected, bands must confirm their participation by <strong className="text-white">15th September 2026</strong>.</>,
              "If any band fails to confirm by 15th September, or subsequently cancels, a wild card entry will be selected to take their place.",
            ]} />
          </section>

          {/* Round 3 */}
          <section>
            <SectionHeading>Round 3 – Preliminary Live Performance &amp; Grand Finale</SectionHeading>
            <p className="text-xs text-orange-400/80 mb-2 font-medium">Date: 17th October 2026</p>
            <BulletList items={[
              <>Each band gets <strong className="text-white">10 minutes for Soundcheck</strong> from 9:00 AM to 10:45 AM.</>,
              <><strong className="text-white">11:00 AM onwards</strong> — The 10 bands perform before the jury at the preliminary round.</>,
              <><strong className="text-white">5:00 PM onwards</strong> — The top 5 finalists perform again at the Grand Finale before a live jury.</>,
              "Winners will be crowned and prizes awarded on the same evening.",
            ]} />
          </section>

          {/* Performance Guidelines */}
          <section>
            <SectionHeading>Performance Guidelines</SectionHeading>
            <BulletList items={[
              "Each band must perform 2 songs: one original + one cover, or two original songs.",
              "Cover songs must align with the band's genre.",
              "All musical genres are welcome.",
              "Finalists may repeat songs performed in earlier rounds if they wish.",
              "Backing tracks are permitted but must not include main vocals or primary instruments.",
            ]} />
          </section>

          {/* Technical Guidelines */}
          <section>
            <SectionHeading>Technical Guidelines</SectionHeading>
            <BulletList items={[
              "No on-stage sound check will be provided during the actual performance.",
              "Each band will receive 15 minutes, which includes a line check and the performance.",
              "In-ear monitors will not be provided.",
            ]} />
          </section>

          {/* Judging */}
          <section>
            <SectionHeading>Judging Parameters</SectionHeading>
            <div className="grid grid-cols-2 gap-2">
              {["Stage presence & delivery", "Passion & energy", "Articulation & precision", "Creativity & originality"].map((p) => (
                <div key={p} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-gray-300">
                  {p}
                </div>
              ))}
            </div>
          </section>

          {/* Copyright */}
          <section>
            <SectionHeading>Copyright Disclaimer</SectionHeading>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bands are solely responsible for securing all necessary rights and permissions for the content they perform. The organizers will not be liable for any copyright-related disputes.
            </p>
          </section>

          {/* Travel */}
          <section>
            <SectionHeading>Travel &amp; Accommodation</SectionHeading>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bands must arrange and bear the cost of their own travel and accommodation.
            </p>
          </section>

          {/* Special Opportunity */}
          <section className="rounded-xl bg-gradient-to-br from-orange-500/10 to-blue-600/10 border border-orange-500/25 p-4">
            <p className="text-orange-400 font-semibold text-sm mb-1">✦ Special Opportunity</p>
            <p className="text-gray-200 text-sm leading-relaxed">
              The <strong className="text-white">Top 3 winning bands</strong> will receive cash prizes <em>and</em> earn the opportunity to{" "}
              <span className="text-orange-300 font-semibold">perform at the Hornbill Music Festival in December 2026</span> — one of India's most prestigious music festivals with significant audience reach and media exposure.
            </p>
          </section>

          {/* Prize Money */}
          <section className="rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/25 p-4">
            <p className="text-yellow-400 font-semibold text-sm mb-3">🏆 Prize Money</p>
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="rounded-lg bg-white/5 border border-yellow-400/30 p-3">
                <p className="text-yellow-300 text-lg font-bold">₹10L</p>
                <p className="text-xs text-gray-400 mt-0.5">🥇 1st Prize</p>
              </div>
              <div className="rounded-lg bg-white/5 border border-gray-400/20 p-3">
                <p className="text-gray-300 text-lg font-bold">₹6L</p>
                <p className="text-xs text-gray-400 mt-0.5">🥈 2nd Prize</p>
              </div>
              <div className="rounded-lg bg-white/5 border border-orange-400/20 p-3">
                <p className="text-orange-300 text-lg font-bold">₹4L</p>
                <p className="text-xs text-gray-400 mt-0.5">🥉 3rd Prize</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 space-y-1 border-t border-white/10 pt-3">
              <p> <strong className="text-gray-300">50%</strong> of the prize money will be awarded on 17th October 2026.</p>
              <p>The remaining <strong className="text-gray-300">50%</strong> will be released after the winners perform at the Hornbill Music Festival.</p>
            </div>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  );
}
