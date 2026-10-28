<!--
  Personetics article text, written by the text sync (scope doc §1, contract v2).
  Source: Engage Skeleton Workbench, sections 01–05, locked drafts only.
  Pain map text (section 04): Pain Map Workbench, written by the pain map sync (pain-map.md §2).
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
Data · Ingest · Clean · Categorize — Raw data of each customer’s latest activity is fed from the bank’s core systems, processed and structured.
Logic · Track · Detect · Rank — A learning algorithm follows each customer’s behavior to spot what changed and what’s worth telling.
Insight · Proactive · Real-time · Approachable — A branded experience inside the bank’s app informs customers of what matters most in their own financial lives.

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

## pain-map
headline: headline headline

### tab: spend
number: 47%
label: Spend as much as they earn, or more

#### row
number: ≈17%
title: Can't see the line until they cross it
quote: “Again and again, it’s never the big stuff. Whatever comes last, say $50 of groceries, and I’m in overdraft.”
quote: “With contactless you just tap away. The card went through like normal, and I only realised I was overdrawn afterwards.”
quote: “I don’t keep track as I go. Then the statement came. Oh god, it was so high… six weeks and I’d spent that much. The balance just dropped.”

#### row
number: 14%
title: Stretch to the next paycheck
quote: "My thought process was how close it was to payday… it might have cleared before but it might have cleared after. So I just rolled the dice."
quote: “You focus on your bills, and by the end of the month there’s no pots of money left.”
quote: “Payday comes and I finally get the things I've been putting off. By the end of the month it's getting very close, and I just hope it'll be enough.”

#### row
number: 21%
title: Spend it while it's there
quote: “I'm just really impulsive. I think I've got money, spend it. New shoes, new stuff for the week. I could be dead tomorrow.”
quote: “I'm not good with money. I can have it and spend it on stupid stuff I don't really need while I still haven't paid the electric bill.”

### tab: plan
number: 40%
label: Don't plan ahead financially

#### row
number: 23%
title: Would rather look away
quote: “Even thinking or talking about my finances gets my heart racing.”
quote: “It's all so overwhelming and confusing. I know ignoring it doesn't help, but I just don't want to deal with it.”
quote: “It feels pointless. Life is stressful, so you just have to take each day as it comes. Juggling bills and paying the mortgage are my top priorities.”

#### row
number: 52%
title: Can't stick to a budget
quote: “Budgeting makes me feel guilty and poor, like I've got less money than I thought, especially when I spend it on unnecessary things.”
quote: “I kept a spreadsheet, but I got burned out on it. It's just hard to keep up long-term. It used up a fair bit of my time.”
quote: “Some months we bring home a lot less. You can't plan a budget when you don't know what's coming in.”

### tab: save
number: 45%
label: Can't last three months on savings

#### row
number: 31%
title: Can't hold on to a buffer
quote: “We can't afford to save. Whatever comes in goes out, so in the end there's nothing left to put aside.”
quote: “I try to put money aside, for example before Christmas, but then there's always something we have to pay for.”
quote: "It's the stuff that you don't see coming that absolutely screws me over every single year."

#### row
number: 75%
title: Won't lock their money away
quote: “The word 'automatically' is a bit scary. It sounds like whoa, whoa,  hang on a minute. How do I manage the months I run short if that fixed amount can't bend?”
quote: "the fact that you can get your money out when you needed it made it sound a lot more appealing"
quote: “Those accounts that earn interest aren't really for people like me. They're for people with more money.”

#### row
number: 62%
title: Won't save without a goal
quote: “I'm only saving now because I'm trying to get a car. So if I didn't have to save for that, I wouldn't.”
quote: "I've never set goals in my life. It's like this is where I am now. What lily pad do I jump to now to keep the boat afloat?"
quote: “I'm good at saving for a goal. But once I get there, I love spending on stuff, and then it's like, where do I go from here?”

# 05
header: The yet to come
title: Product Strategy

Moving towards a healthier financial position was now framed as a journey, where each step shaped readiness for the next by training a specific financial muscle, with tools and capabilities mapped to each and offered in the right, digestible context: a financial forecast covered the predictable, short-term savings absorbed the unexpected, and budgets, together with a view of what was safe to spend after upcoming commitments, kept day-to-day cash flow healthy, leaving room for long-term savings goals.

Engage was already analyzing transactions and using event-based triggers to surface what had happened. Now a second layer of models examined why, classifying each customer’s financial situation by their cash flow and predicting where it was heading, then matching the capability that fit. As their cash flow changed, so did the next best action.

[[VISUAL:path]]
