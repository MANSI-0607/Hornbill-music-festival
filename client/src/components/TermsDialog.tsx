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
        <span className="text-pink-500 underline cursor-pointer">
          Terms & Conditions
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-black text-white p-6 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-pink-400 text-lg md:text-xl font-bold text-center">
            Ticket to Hornbill – India’s Biggest Band Battle
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-center">
            📅 16-18 October 2025 | 📍 RCEMPA, Jotsoma, Kohima
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed mt-4">
          {/* Terms Sections */}
          <section>
            <h3 className="text-pink-300 font-semibold mb-2">
              Round 1 – Video Submission
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              <li>
                Bands must submit a live performance video/link on or before{" "}
                <strong>30th September 2025</strong>.
              </li>
              <li>A jury will shortlist 30 bands for the final rounds.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-pink-300 font-semibold mb-2">Video Submission</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              <li>
                a) All applicants must upload their audition video link in the designated field of the audition form.
              </li>
              <li>
                b) The video must be hosted on a publicly accessible platform such as YouTube, Vimeo, or any other online video-sharing platform, ensuring that the link can be opened and viewed without restrictions.
              </li>
              <li>
                c) Private or password-protected videos will not be considered unless the access details are provided.
              </li>
              <li>
                d) The organizers are not responsible for broken, invalid, or inaccessible links submitted by applicants.
              </li>
              <li>
                e) Only videos submitted through a valid link in the audition form will be accepted for evaluation.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-pink-300 font-semibold mb-2">
              Round 2 – Selection Announcement & Live Performance
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              <li>
                TaFMA will announce the 30 selected bands on{" "}
                <strong>30th September 2025</strong> via social media and
                website.
              </li>
              <li>Bands must perform live as per the given schedule.</li>
              <li>No rescheduling of slots will be entertained.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-pink-300 font-semibold mb-2">
              Round 3 – Preliminary Live Performance
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              <li>
                <strong>16th October:</strong> 15 bands will perform before a
                live jury.
              </li>
              <li>
                <strong>17th October:</strong> Remaining 15 bands will perform
                before the jury.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-pink-300 font-semibold mb-2">
              Grand Finale Shortlist
            </h3>
            <p className="text-gray-200">
              The Top 8 Finalists will be announced on the evening of 17th
              October.
            </p>
          </section>

          <section>
            <h3 className="text-pink-300 font-semibold mb-2">Grand Finale</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              <li>
                Scheduled for <strong>18th October 2025</strong>, from 4 PM
                onwards.
              </li>
              <li>
                Winners will be crowned and prizes awarded on the same evening.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-pink-300 font-semibold mb-2">
              Performance Guidelines
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              <li>
                Each band must perform 2 songs: One original + one cover (or two
                originals).
              </li>
              <li>Covers must align with the band’s genre.</li>
              <li>All genres are welcome.</li>
              <li>
                Finalists may repeat songs performed in earlier rounds if they
                wish.
              </li>
              <li>
                Backing tracks are allowed but must not include main vocals or
                primary instruments.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-pink-300 font-semibold mb-2">
              Technical Guidelines
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              <li>No on-stage sound check; each band gets 5 minutes for line check.</li>
              <li>In-ear monitors will not be provided.</li>
              <li>
                <strong>Judging Parameters:</strong> Stage presence & delivery,
                Passion & energy, Articulation & precision, Creativity &
                originality.
              </li>
              <li>
                <strong>Copyright Disclaimer:</strong> Bands are responsible for
                securing rights for their content. Organizers are not liable for
                disputes.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-pink-300 font-semibold mb-2">Travel & Stay</h3>
            <p className="text-gray-200">
              Bands must arrange their own travel and accommodation.
            </p>
          </section>

          {/* 🔥 More attractive opportunity & prizes */}
          <section className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 p-4 rounded-lg border border-pink-500/40">
            <h3 className="text-pink-300 font-semibold mb-2">
              🌟 Special Opportunity
            </h3>
            <p className="text-gray-100 font-medium">
              The <strong>Top 3 winning bands</strong> will not only win cash
              prizes but also earn the prestigious chance to{" "}
              <span className="text-pink-400 font-bold">
                perform at the Hornbill Music Festival in December 2025
              </span>{" "}
              — one of India’s most iconic stages, with massive audience reach
              and media exposure.
            </p>
          </section>

          <section className="bg-gradient-to-r from-yellow-600/20 to-pink-600/20 p-4 rounded-lg border border-yellow-500/40">
            <h3 className="text-pink-300 font-semibold mb-2">🏆 Prizes</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-100 font-medium">
              <li>
                🥇 <strong>1st Prize:</strong>{" "}
                <span className="text-yellow-400 font-bold">₹20,00,000</span>
              </li>
              <li>
                🥈 <strong>2nd Prize:</strong>{" "}
                <span className="text-gray-300 font-bold">₹10,00,000</span>
              </li>
              <li>
                🥉 <strong>3rd Prize:</strong>{" "}
                <span className="text-pink-400 font-bold">₹5,00,000</span>
              </li>
            </ul>
            <p className="mt-2 text-gray-400 text-xs">
              💰 *50% of the prize money will be awarded on 18th October 2025.  
              The remaining 50% will be released after the winners’ performance
              at the Hornbill Music Festival.  
              🎶 *Bands are responsible for their own travel and stay.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
