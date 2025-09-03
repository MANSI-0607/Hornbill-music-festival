import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export default function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-pink-500 underline cursor-pointer">
          Terms & Privacy
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-pink-400">Ticket to Hornbill – Battle of the Bands 2025</DialogTitle>
          <DialogDescription className="text-white">
            Terms & Conditions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed">
          <p><strong>1. Entry & Tickets</strong><br/>
            Submission: Bands must email completed forms and required materials to hmfofficial@gmail.com by the deadline.<br/>
            Entry Confirmation: Only entries confirmed by email reply are valid.
          </p>
          <p><strong>2. Eligibility & Rights</strong><br/>
            Originality: Submissions must not infringe on third-party rights.<br/>
            Rights: You retain ownership but grant organizers a non-exclusive license for event promotion.<br/>
            Model Releases: If people appear in your content, you must have their consent.
          </p>
          <p><strong>3. Privacy & Publicity</strong><br/>
            Your personal data will be used to administer the competition and promote the event under applicable privacy laws.<br/>
            Participants agree to use of their images or performance content without additional compensation.
          </p>
          <p><strong>4. Selection & Conduct</strong><br/>
            Organizers may shortlist entries; jury decisions are final.<br/>
            Bands must follow event rules and provide accurate information.
          </p>
          <p><strong>5. Liability & Governing Law</strong><br/>
            Organizers are not responsible for technical issues.<br/>
            Participation is at your own risk.<br/>
            Governed by Nagaland law, jurisdiction at Kohima courts.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
