import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-pink-500 underline cursor-pointer font-semibold">
          Terms & Conditions
        </span>
      </DialogTrigger>
      <DialogContent
        className="w-[80vw] max-w-5xl h-[80vh] overflow-y-auto bg-gradient-to-b from-[#002147] to-[#041e42] text-white rounded-2xl shadow-lg p-6"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-pink-400 text-center">
            🎶 Ticket to Hornbill – India’s Biggest Band Battle 🎶
          </DialogTitle>
          <DialogDescription className="text-center text-blue-200 mt-1 text-lg">
            📅 16–18 October 2025 | 📍 RCEMPA, Jotsoma, Kohima
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed mt-4">
          {/* Round 1 */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Round 1 – Video Submission</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-200">
              <li>Bands must submit a live performance video/link on or before <span className="text-pink-300 font-semibold">25th September 2025</span>.</li>
              <li>A jury will shortlist <span className="text-green-300 font-semibold">30 bands</span> for the final rounds.</li>
            </ul>
          </section>

          {/* Round 2 */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Round 2 – Selection & Live Performance</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-200">
              <li>Selected 30 bands will be announced on <span className="text-pink-300 font-semibold">25th September 2025</span> via social media & website.</li>
              <li>Bands must perform live as per the given schedule.</li>
              <li>No rescheduling of slots will be entertained.</li>
            </ul>
          </section>

          {/* Round 3 */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Round 3 – Preliminary Live Performance</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-200">
              <li><span className="text-green-300 font-semibold">16th October</span>: 15 bands perform before a jury.</li>
              <li><span className="text-green-300 font-semibold">17th October</span>: Remaining 15 bands perform before the jury.</li>
            </ul>
          </section>

          {/* Grand Finale */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Grand Finale</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-200">
              <li>Top 8 Finalists announced on <span className="text-pink-300 font-semibold">17th October</span>.</li>
              <li>Finale: <span className="text-green-300 font-semibold">18th October 2025, 4 PM onwards</span>.</li>
              <li>Winners announced and prizes awarded same evening.</li>
            </ul>
          </section>

          {/* Performance Guidelines */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Performance Guidelines</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-200">
              <li>Each band must perform <span className="text-pink-300">2 songs</span> (1 original + 1 cover OR 2 originals).</li>
              <li>Covers must align with the band’s genre.</li>
              <li>Backing tracks allowed, but cannot include main vocals or primary instruments.</li>
              <li>All genres are welcomed 🎸🥁🎤.</li>
            </ul>
          </section>

          {/* Technical Guidelines */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Technical Guidelines</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-200">
              <li>No on-stage sound check; 5 mins line check per band.</li>
              <li>In-ear monitors will not be provided.</li>
              <li>Judging Parameters: <span className="text-pink-300">Stage presence</span>, Passion, Technical Precision, Creativity.</li>
              <li>Copyright Disclaimer: Bands are responsible for permissions of content performed.</li>
            </ul>
          </section>

          {/* Travel & Stay */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Travel & Stay</h3>
            <p>Bands must arrange their own travel & accommodation.</p>
          </section>

          {/* Special Opportunity */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Special Opportunity</h3>
            <p className="text-pink-300 font-semibold">Top 3 winners 🎉 will perform at the Hornbill Music Festival in December 2025!</p>
          </section>

          {/* Prizes */}
          <section>
            <h3 className="text-lg font-semibold text-yellow-400">⸻ Prizes</h3>
            <ul className="space-y-1 ml-2">
              <li>🏆 <span className="text-green-300 font-bold">1st Prize</span> – ₹20,00,000</li>
              <li>🥈 <span className="text-green-300 font-bold">2nd Prize</span> – ₹10,00,000</li>
              <li>🥉 <span className="text-green-300 font-bold">3rd Prize</span> – ₹5,00,000</li>
            </ul>
            <p className="mt-2 text-gray-300 text-xs">
              (50% awarded on 18th Oct, remaining 50% after Hornbill Festival performance. Travel & stay not included.)
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
