import React from 'react'
import MasterLayout from "../masterLayout/MasterLayout";
import BreadCrum from "../components/BreadCrum";


const careerAdviceData = {
  s1: {
    title: "Navigating Job Descriptions Like a Pro",
    tips: [
      "Ignore buzzwords, spot the real needs – highlight recurring verbs (e.g. own, deliver, build) to decode what matters most.",
      "Find the pain point – most jobs exist to solve a problem. Can you identify it?",
      "Use the 'two skills deep' rule – if they ask for X, they also value Y (e.g. if they want 'Excel', they likely want 'data insight').",
      "Flag impossible wishlists – if you meet 60–70%, you're likely a solid candidate."
    ]
  },
  s2: {
    title: "Making the Most of 'Weak Ties'",
    tips: [
      "Reach out to old connections – internships, uni groups, ex-colleagues. These rarely-used links are where referrals happen.",
      "Use the 'tap-in' message – e.g. 'Hey, I'm exploring roles in [sector] and I noticed you're at [company]. Would love to learn more.'",
      "Follow up once – silence doesn't always mean no; timing is everything.",
      "Offer something small in return – an article, a recommendation, or even just good energy."
    ]
  },
  s3: {
    title: "Personal Branding for Early Careers",
    tips: [
      "Create a one-line 'positioning statement' – who you are, what you bring, and what you're looking for.",
      "Comment weekly on industry content – start showing up in feeds with thoughtful, consistent takes.",
      "Be known for something – even if you're just learning, pick a lane (e.g. 'gen Z voice in sustainable marketing').",
      "Link everything back to value – don't just post wins; explain impact."
    ]
  },
  s4: {
    title: "Storytelling Techniques for Interviews",
    tips: [
      "Use emotional shifts – interviews remember moments of challenge, change or surprise.",
      "Name-drop tactfully – mentioning real clients, stakeholders or systems adds weight.",
      "Create 'anchor phrases' – a powerful line that sticks, e.g. 'I'm the kind of person who builds the plane while flying it.'",
      "Reframe failure as fuel – what changed because you failed?"
    ]
  },
  s5: {
    title: "Asking Killer Questions at the End of Interviews",
    tips: [
      "'What does success in this role look like after 6 months?' – shows you think in outcomes.",
      "'How has this role changed since it was last filled?' – reveals team dynamics or churn.",
      "'What are the biggest challenges someone in this role will face?' – exposes the true priorities.",
      "'What's your favourite part about working here?' – builds connection and reads their tone."
    ]
  },
  s6: {
    title: "Managing Rejection Like a Strategist",
    tips: [
      "Turn rejection into recon – ask: 'If I applied again in 6 months, what would strengthen my chances?'",
      "Request 15-min feedback calls – recruiters are more open on the phone than email.",
      "Use AI to reanalyse your own answers – what gaps were there in your STAR stories?",
      "Catalogue objections – build a bank of past rejections and the reasons behind them to future-proof your answers."
    ]
  },
  s7: {
    title: "Spotting Red Flags in Early-Stage Companies",
    tips: [
      "Vague job specs – unclear expectations = future burnout.",
      "Founders who dominate interviews – could mean micromanagement or a lack of process.",
      "Overuse of 'fast-paced' – may signal under-resourced chaos.",
      "Too many perks, not enough purpose – distraction tactic."
    ]
  },
  s8: {
    title: "Salary Negotiation When You Have No Experience",
    tips: [
      "Talk in ranges, not numbers – and always go top of range.",
      "Use value-led framing – 'Given the scope of this role and the impact I'll be making...'",
      "Ask for non-cash perks – L&D budget, flexible hours, early reviews.",
      "Say: 'I'd love to explore how we can make this work for both sides.' – softens the ask but keeps the door open."
    ]
  },
  s9: {
    title: "Getting the Most From Your First 3 Months",
    tips: [
      "Schedule 'intro coffees' with 5 people – learn informal power structures fast.",
      "Ask for feedback after your first task – not just once the probation ends.",
      "Share wins quietly but consistently – updates show value without bragging.",
      "Keep a running list of learnings – turns mistakes into currency."
    ]
  },
  s10: {
    title: "Making a Career Pivot Without Experience",
    tips: [
      "Use a bridge skill – what transfers cleanly? (e.g. research → insight, customer service → stakeholder management).",
      "Reframe your narrative – from 'I don't have experience' to 'I bring a fresh perspective from [X]'.",
      "Do 'learning projects' – a short blog series, mock product review, or self-taught case study.",
      "Find your 3rd door – internships, contract roles, or startup gigs that value attitude over history."
    ]
  }
};

const CareerAdviceSection = ({ sectionId, count }) => {
  const section = careerAdviceData[sectionId];

  if (!section) return null;

  return (
    // <div className="section" id={sectionId}>
    //   <h2 className="mb-2">{section.title}</h2>
    //   <ul className="mb-0">
    //     {section.tips.map((tip, index) => (
    //       <li key={index}>{tip}</li>
    //     ))}
    //   </ul>
    // </div>
    <div className="col-12 col-md-6 col-lg-4">
      <div class="section card h-100" id={sectionId}>
        <div class="card-body p-0">
          <div class="border-translucent">
            <div class="d-flex align-items-start mb-1">
              <div class="d-sm-flex align-items-center">
                <h2 class="text-primary">{`${count}. ${section.title}`}</h2>
              </div>
            </div>
            <ul className="mb-0">
              {section.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CareerAdvice() {
  return (
    <MasterLayout>
      <BreadCrum title='Support' subTitle='MyPathfinder makes the job search simple, personalised, and efficient.' />



      <div className="row g-3">

        <div className="col-12">
          <div className="feature-cards">
            <div className="row g-3">
              {Object.keys(careerAdviceData).map((sectionId, index) => (
                <CareerAdviceSection key={index + 1} sectionId={sectionId} count={index + 1} />
              ))}
            </div>
          </div>

          <div className="d-none">
            <div className="section" id="s1">
              <h2 className="mb-2">1. Navigating Job Descriptions Like a Pro</h2>
              <ul className="mb-0">
                <li>Ignore buzzwords, spot the real needs – highlight recurring verbs (e.g.
                  <em>own</em>, <em>deliver</em>,
                  <em>build</em>) to decode what matters
                  most.</li>
                <li>Find the pain point – most jobs exist to
                  solve a problem. Can you identify it?</li>
                <li>Use the "two skills deep" rule – if they ask
                  for X, they also value Y (e.g. if they want
                  "Excel", they likely want "data
                  insight").</li>
                <li>Flag impossible wishlists – if you meet
                  <strong>60–70%</strong>, you're likely a
                  solid candidate.</li>
              </ul>
            </div>

            <div className="section" id="s2">
              <h2 className="mb-2">2. Making the Most of 'Weak
                Ties'</h2>
              <ul className="mb-0">
                <li>Reach out to old connections – internships,
                  uni groups, ex-colleagues. These rarely-used
                  links are where referrals happen.</li>
                <li>Use the "tap-in" message – e.g. "Hey, I'm
                  exploring roles in [sector] and I noticed
                  you're at [company]. Would love to learn
                  more."</li>
                <li>Follow up once – silence doesn't always mean
                  no; timing is everything.</li>
                <li>Offer something small in return – an
                  article, a recommendation, or even just good
                  energy.</li>
              </ul>
            </div>

            <div className="section" id="s3">
              <h2 className="mb-2">3. Personal Branding for Early
                Careers</h2>
              <ul className="mb-0">
                <li>Create a one-line 'positioning statement' –
                  who you are, what you bring, and what you're
                  looking for.</li>
                <li>Comment weekly on industry content – start
                  showing up in feeds with thoughtful,
                  consistent takes.</li>
                <li>Be known for something – even if you're just
                  learning, pick a lane (e.g. "gen Z voice in
                  sustainable marketing").</li>
                <li>Link everything back to value – don't just
                  post wins; explain impact.</li>
              </ul>
            </div>

            <div className="section" id="s4">
              <h2 className="mb-2">4. Storytelling Techniques for
                Interviews</h2>
              <ul className="mb-0">
                <li>Use emotional shifts – interviews remember
                  moments of challenge, change or
                  surprise.</li>
                <li>Name-drop tactfully – mentioning real
                  clients, stakeholders or systems adds
                  weight.</li>
                <li>Create "anchor phrases" – a powerful line
                  that sticks, e.g. "I'm the kind of person
                  who builds the plane while flying it."</li>
                <li>Reframe failure as fuel – what changed
                  because you failed?</li>
              </ul>
            </div>

            <div className="section" id="s5">
              <h2 className="mb-2">5. Asking Killer Questions at the
                End of Interviews</h2>
              <ul className="mb-0">
                <li>"What does success in this role look like
                  after 6 months?" – shows you think in
                  outcomes.</li>
                <li>"How has this role changed since it was last
                  filled?" – reveals team dynamics or
                  churn.</li>
                <li>"What are the biggest challenges someone in
                  this role will face?" – exposes the true
                  priorities.</li>
                <li>"What's your favourite part about working
                  here?" – builds connection and reads their
                  tone.</li>
              </ul>
            </div>

            <div className="section" id="s6">
              <h2 className="mb-2">6. Managing Rejection Like a
                Strategist</h2>
              <ul className="mb-0">
                <li>Turn rejection into recon – ask: "If I
                  applied again in 6 months, what would
                  strengthen my chances?"</li>
                <li>Request 15-min feedback calls – recruiters
                  are more open on the phone than email.</li>
                <li>Use AI to reanalyse your own answers – what
                  gaps were there in your STAR stories?</li>
                <li>Catalogue objections – build a bank of past
                  rejections and the reasons behind them to
                  future-proof your answers.</li>
              </ul>
            </div>

            <div className="section" id="s7">
              <h2 className="mb-2">7. Spotting Red Flags in
                Early-Stage Companies</h2>
              <ul className="mb-0">
                <li>Vague job specs – unclear expectations =
                  future burnout.</li>
                <li>Founders who dominate interviews – could
                  mean micromanagement or a lack of
                  process.</li>
                <li>Overuse of "fast-paced" – may signal
                  under-resourced chaos.</li>
                <li>Too many perks, not enough purpose –
                  distraction tactic.</li>
              </ul>
            </div>

            <div className="section" id="s8">
              <h2 className="mb-2">8. Salary Negotiation When You Have
                No Experience</h2>
              <ul className="mb-0">
                <li>Talk in ranges, not numbers – and always go
                  top of range.</li>
                <li>Use value-led framing – "Given the scope of
                  this role and the impact I'll be
                  making..."</li>
                <li>Ask for non-cash perks – L&amp;D budget,
                  flexible hours, early reviews.</li>
                <li>Say: "I'd love to explore how we can make
                  this work for both sides." – softens the ask
                  but keeps the door open.</li>
              </ul>
            </div>

            <div className="section" id="s9">
              <h2 className="mb-2">9. Getting the Most From Your First
                3 Months</h2>
              <ul className="mb-0">
                <li>Schedule 'intro coffees' with 5 people –
                  learn informal power structures fast.</li>
                <li>Ask for feedback after your first task – not
                  just once the probation ends.</li>
                <li>Share wins quietly but consistently –
                  updates show value without bragging.</li>
                <li>Keep a running list of learnings – turns
                  mistakes into currency.</li>
              </ul>
            </div>

            <div className="section" id="s10">
              <h2 className="mb-2">10. Making a Career Pivot Without
                Experience</h2>
              <ul className="mb-0">
                <li>Use a bridge skill – what transfers cleanly?
                  (e.g. research → insight, customer service →
                  stakeholder management).</li>
                <li>Reframe your narrative – from "I don't have
                  experience" to "I bring a fresh perspective
                  from [X]".</li>
                <li>Do 'learning projects' – a short blog
                  series, mock product review, or self-taught
                  case study.</li>
                <li>Find your 3rd door – internships, contract
                  roles, or startup gigs that value attitude
                  over history.</li>
              </ul>
            </div>
          </div>

          <div className="mb-6"></div>
        </div>

        <aside className="col-12 col-lg-4 col-xl-3 d-none">
          <div className="toc-card p-3" style={{ position: 'sticky', top: '6rem' }}>
            <div id="pageToc"
              className="list-group list-group-flush small">
              <a className="list-group-item" href="#s1">1. Job
                Descriptions</a>
              <a className="list-group-item" href="#s2">2. Weak
                Ties</a>
              <a className="list-group-item" href="#s3">3.
                Personal Branding</a>
              <a className="list-group-item" href="#s4">4.
                Storytelling</a>
              <a className="list-group-item" href="#s5">5. Killer
                Questions</a>
              <a className="list-group-item" href="#s6">6.
                Rejection Strategy</a>
              <a className="list-group-item" href="#s7">7. Red
                Flags</a>
              <a className="list-group-item" href="#s8">8.
                Negotiation</a>
              <a className="list-group-item" href="#s9">9. First 3
                Months</a>
              <a className="list-group-item" href="#s10">10.
                Career Pivot</a>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .section {
          padding: 1.25rem 1.25rem 1rem;
          border-radius: .75rem;
          border: 1px solid rgba(255,255,255,.06);
          background: rgba(255,255,255,.02);
        }
        .section + .section { 
          margin-top: .75rem; 
        }
        .section h2 {
          font-weight: 700;
          font-size: 1.125rem;
          margin-bottom: .5rem;
        }
        .section ul { 
          margin-bottom: 0; 
        }
        .section li { 
          margin: .4rem 0; 
          font-size: 14px;
        }

        .toc-card {
          border-radius: .75rem;
          border: 1px solid rgba(255,255,255,.06);
          background: rgba(255,255,255,.02);
        }
        #pageToc .list-group-item {
          padding: .5rem .75rem;
          border: 0;
          background: transparent;
          color: var(--phoenix-gray-400, #a1a1aa);
        }

        /* Smooth anchor scroll & spacing with fixed topbar */
        html { 
          scroll-behavior: smooth; 
        }
        .content h2[id] { 
          scroll-margin-top: 90px; 
        }
      `}</style>
    </MasterLayout>
  )
}