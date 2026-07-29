import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

function Rule() {
  return <hr className="border-none h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-5" />;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400/80 mb-2">
      {children}
    </p>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-orange-400/50 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RoundEntry({
  number,
  title,
  children,
  last = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-400 text-xs font-bold">
          {number}
        </div>
        {!last && <div className="mt-1 w-px flex-1 bg-gradient-to-b from-orange-400/20 to-transparent" />}
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <p className="text-white text-sm font-semibold mb-2 leading-snug">{title}</p>
        {children}
      </div>
    </div>
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

      <DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto bg-[#0c0c0e] border border-white/8 text-white p-0 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0c0c0e]/96 backdrop-blur-md px-7 pt-7 pb-5 border-b border-white/8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              Ticket to Hornbill – India's Biggest Band Battle
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-2 space-y-1.5 text-xs text-gray-500">
                <p>
                  <span className="text-gray-400">Event Dates:</span>{" "}
                  <span className="text-gray-300">16–17 October 2026</span>
                </p>
                <p className="text-gray-400 pl-0 sm:pl-1">
                  (16th October – Nagaland's Culture Showcase)
                </p>
                <p className="text-gray-400 pl-0 sm:pl-1">
                  (17th October – Band Battle)
                </p>
                <p className="pt-1">
                  <span className="text-gray-400">Venue:</span>{" "}
                  <span className="text-gray-300">Talkatora Stadium, New Delhi</span>
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-7 pb-8 pt-6">

          {/* Rounds */}
          <div>
            <Label>The Journey</Label>
            <div className="mt-3">

              <RoundEntry number="1" title="Round 1 – Video Submission">
                <BulletList items={[
                  <>Bands must submit a live performance video/link on or before <strong className="text-white/80">25th August 2026</strong>.</>,
                  "A jury will shortlist 10 bands for the final rounds.",
                ]} />
              </RoundEntry>

              <RoundEntry number="2" title="Round 2 – Selection Announcement & Live Performance">
                <BulletList items={[
                  <>TaFMA will announce the 10 selected bands on <strong className="text-white/80">31st August 2026</strong> via social media and its website.</>,
                  "Bands must perform live as per the given schedule.",
                  "No rescheduling of performance slots will be entertained.",
                  <>Once selected, the Bands must confirm their participation by <strong className="text-white/80">15th September 2026</strong>.</>,
                  "If any band fails to confirm their participation by 15th September, or subsequently cancels their participation, a wild card entry will be selected to take their place.",
                ]} />
              </RoundEntry>

              <RoundEntry number="3" title="Round 3 – Preliminary Live Performance and Grand Finale" last>
                <p className="text-xs text-orange-400/80 mb-2 font-medium">Date: 17th October 2026</p>
                <BulletList items={[
                  "Each band will get 10 minutes for Soundcheck starting from 9 a.m. to 10:45 a.m.",
                  "Time: 11:00 AM onwards — The 10 bands will perform before the jury at the preliminary round.",
                  "Time: 5 P.M. onwards — The top 5 finalists will again perform at the Grand Finale before a Live jury.",
                  "Winners will be crowned and prizes will be awarded on the same evening.",
                ]} />
              </RoundEntry>

            </div>
          </div>

          <Rule />

          <section>
            <Label>Video Submission Guidelines</Label>
            <BulletList items={[
              "a) All applicants must upload their audition video link in the designated field of the audition form.",
              "b) The video must be hosted on a publicly accessible platform such as YouTube, Vimeo, or any other online video-sharing platform, ensuring that the link can be opened and viewed without restrictions.",
              "c) Private or password-protected videos will not be considered unless the access details are provided.",
              "d) The organizers are not responsible for broken, invalid, or inaccessible links submitted by applicants.",
              "e) Only videos submitted through a valid link in the audition form will be accepted for evaluation.",
            ]} />
          </section>

          <Rule />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section>
              <Label>Performance Guidelines</Label>
              <BulletList items={[
                <>
                  Each band must perform 2 songs:
                  <ul className="mt-1.5 ml-1 space-y-1 text-gray-500">
                    <li>o One original and one cover, or</li>
                    <li>o Two original songs.</li>
                  </ul>
                </>,
                "Cover songs must align with the band's genre.",
                "All musical genres are welcome.",
                "Finalists may repeat songs performed in earlier rounds if they wish.",
                "Backing tracks are permitted but must not include main vocals or primary instruments.",
              ]} />
            </section>
            <section>
              <Label>Technical Guidelines</Label>
              <BulletList items={[
                "No on-stage sound check will be provided during the actual performance.",
                "Each band will receive 15 minutes, which includes a Line check and the performance.",
                "In-ear monitors will not be provided.",
              ]} />
            </section>
          </div>

          <Rule />

          <section>
            <Label>Judging Parameters</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                "Stage presence and delivery",
                "Passion and energy",
                "Articulation and precision",
                "Creativity and originality",
              ].map((p) => (
                <span key={p} className="text-xs text-gray-400 bg-white/5 rounded-full px-3 py-1">
                  {p}
                </span>
              ))}
            </div>
          </section>

          <Rule />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section>
              <Label>Copyright Disclaimer</Label>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bands are solely responsible for securing all necessary rights and permissions for the content they perform. The organizers will not be liable for any copyright-related disputes.
              </p>
            </section>
            <section>
              <Label>Travel &amp; Accommodation</Label>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bands must arrange and bear the cost of their own travel and accommodation.
              </p>
            </section>
          </div>

          <Rule />

          <section>
            <Label>Special Opportunity</Label>
            <p className="text-gray-300 text-sm leading-relaxed">
              The Top 3 winning bands will not only receive cash prizes but will also earn the opportunity to perform at the Hornbill Music Festival in December 2026, one of India's most prestigious music festivals with significant audience reach and media exposure.
            </p>
          </section>

          <Rule />

          <section>
            <Label>Prize Money</Label>
            <div className="mt-3 space-y-3">
              {[
                { rank: "First Prize", amount: "₹10,00,000", color: "text-yellow-300" },
                { rank: "Second Prize", amount: "₹6,00,000", color: "text-gray-300" },
                { rank: "Third Prize", amount: "₹4,00,000", color: "text-orange-300" },
              ].map(({ rank, amount, color }) => (
                <div key={rank} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{rank}</span>
                  <span className={`text-lg font-bold tracking-tight ${color}`}>{amount}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/8 text-xs text-gray-500 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400/80 mb-2">Prize Disbursement</p>
              <p>50% of the prize money will be awarded on 17th October 2026.</p>
              <p>The remaining 50% will be released after the winners perform at the Hornbill Music Festival.</p>
            </div>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  );
}
