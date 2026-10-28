<!--
  Personetics article text, written by the text sync (scope doc §1, contract v1).
  Source: Engage Skeleton Workbench, sections 01–05, locked drafts only.
  Replaced in full on every sync. Never edit by hand.
-->

# 01
header: Sleeping giants
title: Context

Once upon a time, many years ago, in the hype days of digital wallets, the mindset of traditional banks was gradually shifting from dismissal to panic over their customers’ growing expectations for a richer digital experience, one that went beyond accessing data.

A young, ambitious startup called Personetics was out to solve this exact problem. It offered banks a way to boost engagement in their digital channels by turning a pile of overwhelming, greyish transaction lists into personalized insights that told customers, in the simplest and most straightforward language, what was happening in their financial lives. They called it Engage, a cognitive banking solution.

[[VISUAL:diagram]]

At the time, I was a young designer at a UX agency, assigned to the Personetics account. For roughly a year, I worked on cracking what this experience could look like, exploring interaction models and building demos for design partners and sales road trips, until the work landed on a feed widget. Once banks started signing, I came in-house as founding designer, turning Engage into a white-label product built for rapid growth and orchestrating the design ops between the banks' design teams and Personetics developers.

[[VISUAL:phone]]

## visual: diagram
DATA · Ingest · Clean · Categorize — Raw data of each customer’s latest activity is fed from the bank’s core systems, then processed and structured.
LOGIC · Track · Detect · Rank — A learning algorithm follows each customer’s behavior and spots what changed and what’s worth telling.
INSIGHT · Proactive · Real-time · Approachable — A branded experience inside the bank’s app informs customers of what matters most in their own financial lives.

# 02
header: Growing pains
title: Measuring Success

Our customer base was growing fast, going from four to twelve banks within a few months, with more signing every week. Success came down to two numbers, time to production and implementation quality, and by both, everything ran smoothly, until a routine post-launch meeting with one of the banks' UX teams raised a question neither I nor our spreadsheets could answer: "How do we know this experience is successful?"

Technically, we had a rating mechanism at the end of each insight, but at that point so few customers used it that the data was statistically insignificant. Plugging in event tracking meant pushing behavioral data through each bank's security reviews, a bottleneck working against the very numbers we were optimizing for, so it was the last thing anyone at the company wanted to hear about.

It was a wall I felt strongly about breaking.
Working alongside the banks' mature, top-tier UX organizations had been a huge learning opportunity for me, and by then, what I felt was the pain of outgrowing a role of reskinning, over and over, an experience I couldn't vouch for.

So I went to Danny, our CTO, hoping to escalate my way out of this mess. Instead, he reframed the question.

[[VISUAL:quote]]

## visual: quote
Counting clicks won't tell you how well the experience you've built delivers.
Knowing whether customers acted on it will.

# 03
header: How useful was this insight?
title: Inflection Point

And there it was, a readout from our own database, slicing the types of insights we were triggering, with a clear pattern: customers who returned less often kept triggering the same insights over and over, while those who kept coming back to Engage were more likely to stop triggering certain types, like spending-increase alerts.

It was exactly the kind of signal I needed to bring back to my design peers on the bank’s side, but it also raised a question about the ones it didn’t reach. Surprisingly, I wasn’t the only one experiencing an aha moment there.

For a while now, leadership had been debating where Engage should go next. Banks were pushing to sell financial products through it, while Personetics was trying to figure out how to align with a strategy true to Engage as a personal advisor, without turning it into a promotional channel.

Until then, I hadn’t been part of those conversations. Now, with that signal of where Engage was driving behavioral change and where it wasn’t, identifying and scoping the user problems we were best positioned to solve became critical. The banks wanted Engage to move from “here’s what happened” to “commit your money,” but getting there required a strong user lens in the room.

# 04
header: Mind the gap
title: Discovery & Problem Definition

Our customers, the banks, now acting as design partners, were heavily invested in research at an institutional scale, giving us a far wider and deeper view than any study we could have run ourselves. JPMorgan Chase, for one, had launched a research lab with the Financial Health Network. Their research segmented customers by financial resilience and tracked their financial habits, helping us understand the mindsets and pain points across segments.

[[VISUAL:painmap]]

People fall into financial trouble for countless reasons, but the difference between financial vulnerability and resilience comes down to three abilities: looking and planning ahead, spending within their means, and setting money aside for future needs or a rainy day.

The research showed that those in the most vulnerable tier, stretching to next payday or struggling with negative cash flow, had no bandwidth to even consider a savings account. They were also hit hardest by bank fees, which deepened their distrust of mainstream banks and made them less likely to sign up for more products and services. That cognitive state was a vicious cycle. Customers who needed the bank’s help most were the least willing to take it. That was the user problem we set out to solve.

[[VISUAL:persona]]

## visual: persona
I am a person living paycheck to paycheck, one bill away from overdraft.
I’m trying to build a cushion, so one bad month doesn’t knock me down.
But I can’t think past payday, and I don’t trust my bank.
Because they’re only good at charging fees, and my headspace is taken up by reaching the end of the month without falling short.
Which makes me feel anxious, ashamed, and on my own.
In an ideal world I’d see the hard days coming, stay in control without the guilt, and know my bank is on my side, so saving finally feels possible.

# 05
header: The yet to come
title: Product Strategy

Moving towards a healthier financial position was now framed as a journey, where each step shaped readiness for the next by training a specific financial muscle, with tools and capabilities mapped to each and offered in the right, digestible context: a financial forecast covered the predictable, short-term savings absorbed the unexpected, and budgets, together with a view of what was safe to spend after upcoming commitments, kept day-to-day cash flow healthy, leaving room for long-term savings goals.

Engage was already analyzing transactions and using event-based triggers to surface what had happened. Now a second layer of models examined why, classifying each customer’s financial situation by their cash flow and predicting where it was heading, then matching the capability that fit. As their cash flow changed, so did the next best action.

[[VISUAL:path]]
