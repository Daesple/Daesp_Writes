---
title: Bayesian Thinking
description: "Given what i already know and what i have just observed, how much should i adjust my degree of confidence now?"
status: done
tags:
  - resource
---
**tags:** [[Mini-essay]], [[Learning]],
### references:
- [A visual guide to Bayesian thinking](https://youtu.be/BrK7X_XlGB8)
- [The Bayesian Trap](https://youtu.be/R13BD8qKeTg)
- [Bayes theorem, the geometry of changing beliefs](https://www.youtube.com/watch?v=HZGCoVF3YvM)
- [How to systematically approach truth - Bayes' rule](https://www.youtube.com/watch?v=4hHA-oqpNig)
- [Is Bayesian thinking a sham?](https://www.youtube.com/watch?v=55L7w2Vwkuk)

---
## Let's take a look at the logic chain

![[Animation 1.webp]]

---
## Section 1 - Foundations

### 1.1 The Big Picture

Bayesian thinking is a framework for reasoning about uncertainty. Rather than treating knowledge as a binary choice between absolute truth and absolute falsehood, The Bayesian approach models beliefs as **degrees of confidence** - represented mathematically as probabilities between 0 (0% certainty) and 1 (100% certainty)

Whenever we encounter new information, we do not evaluate it in an isolated vacuum or discard what we previously knew. Instead, we use new observations to update our preexisting convictions. The fundamental question driving this mindset is:

> Given what i already know (my prior belief) and what i have just observed (my new evidence), how much should i adjust my degree of confidence now?

#### A Cross-Disciplinary Framework
Bayesian reasoning sits at the intersection of several distinct fields, bridging abstract mathematics with practical decision-making

```
Mathematics / Statistics
   ↓ provides the tools (Bayes' Theorem & conditional probability)
Epistemology (Philosophy of knowledge)
   ↓ interpreted probability as quantifiable "degrees of belief"
Cognitive Science & Psychology
   ↓ studied how human intuition naturally updates (or fails to update) beliefs
Applied Fields
   ↓ Deploys Bayesian models in AI, medical diagnostics, spam filtering, law, daily rationally
```

1. **Mathematics & Statistics:** Provides the exact formula (Bayes' Theorem) and conditional probability rules required to calculate how evidence numerically shifts probability or odds.
2. **Epistemology:** Establishes a philosophy of knowledge where beliefs are flexible, non-dogmatic, and subject to continuous revision as evidence accumulates.
3. **Cognitive Sciences & Psychology:** Investigates human judgement, highlighting cognitive traps like *Base rate neglect* and demonstrating how geometric models (such as area diagrams or natural frequencies) can align human intuition with rational probability
4. **Applied Sciences:** Drives real-world problem solving - from training machine learning algorithms and filtering email spam to evaluating medical test accuracy and validating scientific hypotheses.

#### Historical Context in Brief

- **Origins (1763):** Thomas Bayes formulated the initial thought experiment on "inverse probability", which was discovered and published posthumously by his friend Richard Price in 1763.
- **Mathematical Formalize:** Pierre-Simon Laplace independently derived the mathematical formula and applied it to real-world data in astronomy, demography, and jurisprudence.
- **Today:** Bayesian inference declined relative to frequentist statistics before experiencing a major revival in the late 20th century, driven by modern statistics, computing, and machine learning.

---
### 1.2 Key Concepts

#### Leibniz's Dream
Gottfried Wilhelm Leibniz (1646-1716) was a brilliant philosopher and mathematician who dreamed of a precise, systematic recipe to determine truth and eliminate ideological disputes. In 1685, He wrote:

> "The only way to rectify out reasonings is to make them as tangible as those of the mathematicians so that we can find our error at a glance and when there are disputes among persons we can simply say let us calculate without further ado to see who is right."

Bayesian philosophy fulfills part of Leibniz's dream by representing beliefs as probabilities, and using formal mathematical rules like bayes' rule to update those beliefs quantitatively when new evidence arrives.

#### The Full Formula for Baye's Theorem (Pls Don't worry, you don't have to remember all this)

The general form of Bayes' Theorem calculates the updated probability of a hypothesis $(H)$ given observed evidence $(E)$:
$$
P(H \mid E) = \frac{P(E \mid H) \cdot P(H)}{P(E)}
$$
Because the total probability of observing the evidence $P(E)$ consists of two mutually exclusive cases - observing evidence when the hypothesis is true $(H)$ plus observing evidence when the hypothesis is false $(\neg H)$ - the full expanded formula is:
$$
P(H \mid E) = \frac{P(E \mid H) \cdot P(H)}{P(E \mid H) \cdot P(H) + P(E \mid \neg H) \cdot P(\neg H)}
$$
*(@@... trust me we will got to the fun part later)*

Where:
- **$P(H)$ (Prior Probability)**: The baseline probability of the hypothesis befor observing new evidence.
- **$P(\neg H)$:** The baseline probability that the hypothesis is false $(1 - P(H))$.
- **$P (E \mid H)$ (Likelihood):** The probability of observing the evidence if the hypothesis is true.
- **$P (E \mid \neg H)$ (False Positive Rate):** The probability of observing the evidence even if the hypothesis is false.
- **$P (H \mid E)$ (Posterior Probability):** The revised probability of the hypothesis after incorporating the evidence.

Now, let's see an example to make sense all of that.
#### Example: Medical Diagnostic Testing
let's say a rare medical condition that affects **0.1% of the population**. A diagnostic test for this condition has an accuracy rate of **99%** (meaning a 99% true-positive rate for infected individuals, and a 1% false-positive rate for healthy individuals)

If a patient receives a positive test result, what is the actually probability that they have the disease?

Intuitively, a lot will say that 99% the patient actually have the disease. Because the test have 99% true-positive rate. But is it?

Let's use Baye's theorem to calculate this

**1: define the variables**
- $H$ (hypothesis): The patient has the disease.
- $E$ (evidence): The test result is positive.
- $P(H)$ (Probability of a true hypothesis) = 0.001 (0.1% prevalence rate).
- $P(\neg H)$ (Probability of false hypothesis) = 1 - 0.001 = 0.999 (99.9% healthy population)
- $P(E \mid H)$ (Probability of an evidence given true hypothesis) = 0.99 (99% true-positive rate)
- $P(E \mid \neg H)$ (Probability of an evidence given false hypotheis) = 0.01 (1% false-positive rate) 

**2: plug the number into the full Bayes' formula
$$
P (H \mid E) = \frac{0.99 \times 0.001}{(0.99 \times 0.001) + (0.01 \times 0.999)}
$$

**3: Compute numerator and denominator**
- Numerator (sick and tests positive): $0.99 \times 0.001 = 0.00099$
- Denominator Part 1 (sick and test positive): $0.99 \times 0.001 = 0.00099$
- Denominator part 2 (Healthy but receives false positive): $0.01 \times 0.999 = 0.00999$
- Total Denominator $P(E)$: $0.00099 + 0.00999 = 0.01098$

**4: Calculate the final posterior probability**
$$
P(H \mid E) = \frac{0.00099}{0.01098} \approx 0.09016 \quad (\approx 9.02 \%)
$$

So in reallity, the chance that patient actually has the disease (9.02%) is much lower than what people think (99%).

To see why, consider the example this way. let's say we have **1000 people:**
1. **1 person** actually has the disease (0.1% prevalence rate) and receives a positive test result.
2. **999** people are healthy. With a 1% false-positive rate, approximately **10 people** $(999 \times 0.01 = 9.99)$ receive false-positive results.
3. Out of **11 total positive results**, only **1 person** actually has the condition. 
![[Animation2.webp]]
Consequently, a single positive test result updates the risk from 0.1% to roughly 9% *(only $\frac{1}{11}$ test result was true).*

Now, we don't have to use all that formulas. Probabilities can be represented visually.

#### Example 2: Tom (Mathematics PhD Student or Business School Student?)

Suppose you meet a student named Tom on a University campus. You noitice that Tom is shy, "Introvert" guy, and reserved. Is Tom more likely to be a **Math PhD student** or **Business School student**?

a lot say Tom is a Math PhD bacause shyness align with mathematicians stereotype. However, let's visualize the situation with an diagram and see if Tom is a Math Phd Student.

in the general student body, Business students outnumber Math PhD students by approximately **10 to 1** 
![[Animation3.webp]]

Suppose that 75% of Mathematics PhD students are introverted, shy, whereas for Business student, it's estimated to be around 15%.
![[Animation4.webp]]
To determine where tom is more likely to belong, we compare the **relative physical areas** of the two red regions:
$$
Shy Math Area = Width \times Height = 1 \times 0.75 = 0.75 \\
Shy Business Area = Width \times Height = 10 \times 0.15 = 1.5
$$
Comparing the two:
$$
\frac {Shy Business Area}{Shy Math Area} = \frac {1.5}{0.75} = \frac {2}{1}
$$
So this mean Tom is **twice as likely** to be a Business student.
This geometric model also reveals the mechanics of bayes' rule (But I too lazy to demo that, you get the idea. watch these 2 videos if you want to know more about that: [Bayes theorem, the geometry of changing beliefs](https://www.youtube.com/watch?v=HZGCoVF3YvM), [A visual guide to Bayesian thinking](https://www.youtube.com/watch?v=BrK7X_XlGB8))

#### Extra: The Odds Form of Bayes' Theorem

While Bayes' Theorem is commonly expressed in terms of probabilities, it can also be formulated in terms of **Odds**. Probability measure the ratio of favorable outcomes to all total outcomes, wheres **Odds** compare favorable outcomes directly against unfavorable ones:
$$\text{Odds} = \frac{P(H)}{P(\neg H)}$$
*(Note: In probability terminology, "favorable outcomes" refers to cases that satisfy the specific hypothesis $H$ under evaluation. in this context, having the disease - rather than a desirable real-world outcome).*

For instance, a disease prevalence probability of $P(H) = 0.001$ (0.1%) corresponds to baseline odds of $1 : 999$ (1 infected person versus 999 healthy individuals).

When expressed in Odds Form, Bayes' Theorem simplifies into a clean multiplicative relationship:
$$\text{Posterior Odds} = \text{Prior Odds} \times \text{Likelihood Ratio}$$ $$\frac{P(H \mid E)}{P(\neg H \mid E)} = \frac{P(H)}{P(\neg H)} \times \frac{P(E \mid H)}{P(E \mid \neg H)}$$
This formulation is useful when updating beliefs across multiple independent Evidences ($E_1, E_2, \dots, E_n$). Instead of recalculating complex probability denominators at every step, a Bayesian simply multiplies the baseline prior odds by each successive likelihood ratio: 
$$\text{Posterior Odds} = \text{Prior Odds} \times LR_1 \times LR_2 \times \dots \times LR_n$$
Revisiting the medical test example:
- **Prior Odds (Infected : Healthy)** = $1 : 999$ (0.1% prevalence rate).
- **Likelihood Ratio ($LR_1$)** = $\frac{P(\text{Positive} \mid \text{Sick})}{P(\text{Positive} \mid \text{Healthy})} = \frac{0.99}{0.01} = 99$.

**First Positive Test:**
$$\text{Posterior Odds}_1 = \text{Prior Odds} \times LR_1 = \frac{1}{999} \times 99 = \frac{99}{999} \approx 1 : 10.09 \quad $$
*meaning that out of roughly 11 people (10.09 + 1) who receive a positive result, only 1 person actually has the disease.*

**Second Independent Positive Test:** 
If the patient undergoes a second, independent test and receives another positive result ($LR_2 = 99$), we simply multiply the current odds by $LR_2$:
$$\text{Posterior Odds}_2 = \text{Posterior Odds}_1 \times LR_2 = \frac{1}{10.09} \times 99 \approx 9.81 : 1$$
*Meaning that out of roughly 11 people who **test positive twice in a row**, nearly 10 actually have the disease while only 1 is healthy person receiving two consecutive false positive.* 

If you are among those 11 people, the probability that you actually have the disease rises to $\frac {9.81}{9.81 + 1} \approx 90.75\%$

The Odds Form shows how two consecutive tests turn a rare suspicion ($1 : 999$) into strong confidence ($9.8 : 1$) without recomputing complex denominators.

---
### 1.3 Living with Uncertainty

Don't see Bayesian as a mathematical formula or random area diagrams. it's a reasoning tool. 

This tool replaces rigid binary assertions ("X is 100% true" or "Y is completely false") with flexible, probabilistic degrees of confidence. It is based on two fundamental principles:
#### 1. Cromwell's Rule and the Necessity of Open-Mindedness
Named after Oliver Cromwell's historical plea *("I beseech you... think it possible you may be mistaken")*. **Cromwell's Rule** states that one should never assign a prior probability of exactly **0** or **1** to any real-world proposition, no matter how unlikely it appears.

Mathematically, if a prior probability is set to **0**, Bayes' Formula multiplies the numerator to **Zero** regardless of how overwhelming the new evidence is.

As statistician Dennis Lindley illustrated, one should always reserve a minute probability, even one in a million for the hypothesis that **"The moon is made of green cheese."** If we set that probability to absolute zero, then even an army of astronauts returning from the moon with physical samples of green cheese, our mind would remain completely unmoved. In mathematical terms, absolute certainty renders a system blind to reality.

#### 2. Beliefs as "Leaves in the Wind"
Rather than treating beliefs as fixed, defining markers, a Bayesian views convictions as dynamic, adjustable models of reality. In this framework, a rational belief should **"dance like a leaf in the wind"**, drifting precisely in the direction and to the degree indicated by the evidence.

At it core, Bayesian thinking is learning to live comfortable with uncertainty: countinously refining one's degrees of confidence across all subjects, remaining open to being proven wrong, and recognizing that updating one's mind is a strength rather than a defeat.

---
## Section 2 - Spotting Bayes in the Wild
### 2.1 Bayesian Thinking in Literature

Literature is a useful space for observing Bayesian thinking because characters and readers constantly speculate, doubt, get deceived, or revise their understanding as the story unfolds.

*Note that These are **interpretive reading**. The authors were not thinking about Bayes. I borrow his rules as a lens to name what characters do with evidence.

#### 1. Thầy bói xem voi

Several blind fortune-tellers touch an elephant for the first time. Each touches only one part and announces what an elephant "is": the leg is a pillar, the ear is a fan, and so on. They argue, and none gives away.

Each man's reasoning is not wrong: a leg really does feel like a pillar. But the problem is:
- **False positive rate is high** let $H =$ "an elephant is like a pillar" and $E =$ "this thing i touch feels like a pillar". If the elephant were not pillar-shaped, He would still feel a pillar when touch a leg, so $P(E \mid \neg H)$ is high. the likelihood ratio is close to 1, and the evidence should barely move his belief, Instread he jumps to near-certainty.
- **A missing hypothesis** None of them asks "What if i'm only touching part of something bigger?". We could only reasoning for what we had thinking about.
- **Cromwell's rule** Each man sits at about 100%, so other men's reports are treated as errors instead of new evidence.
- **Pooling evidence.** Independent observations should multiply, not compete:
$$\text{Posterior Odds} = \text{Prior Odds} \times LR_1 \times LR_2 \times \dots \times LR_n$$
Five partial reports combined would give a far better picture than any one of them.

#### 2. Ông giáo (Lão Hạc - Nam Cao)

Lão Hạc, a poor old farmer, sells his beloved dog and entrusts his savings and his land to Ông giáo, the narrator. Later he asks Bình Tư for dog poson, saying he want to kill a stray dog. Binh Tư tells Ông Giáo, who is disappointed: He had thought Lão Hạc was a decent man. Then Lão Hạc dies by eating the poison himself, and Ông giáo revises his view of Lão Hạc.

**Prior:** Lão Hạc is a decent, pitiable man.

**Why the update went wrong at first:** The teacher read the poison request as evidence for $H_A$: “Lão is turning dishonest.” But look at both pieces of evidence against two hypotheses:

| Evidence                                                 | $H_A$: Lão Hạc is turning dishonest       | $H_B$: Lão Hạc plans to end his life |
| -------------------------------------------------------- | ----------------------------------------- | ------------------------------------ |
| $E_1$: sold dog, left funeral money + land with Ông giáo | **Low** (It's not a bad person behavior ) | **High**                             |
| $E_2$: asked for dog poison                              | High                                      | **High** (with a fake excuse)        |

- **$E_2$ alone is weak evidence for $H_A$.** Its false positive rate $P(E_2 \mid \neg H_A)$ is high, because the same request also fits $H_B$. Ông giáo treated it as strong.
- **The same evidence changes meaning with the hypothesis.** Once $H_B$ is on the table, $E_1$ and $E_2$ together point to it clearly.
- **He never considered $H_B$.** Bayes’ rule can only shift belief among hypotheses you have actually put on the table.
- **Source reliability.** The news comes from Binh Tư, a man described as a dog thief, who reads Lão Hạc through his own world. Lão Hạc also supplied a fake excuse.

**Posterior**: After Lão Hạc death, Ông giáo moves in two directions: belief about Lão goes down, then up, and his general view of people shifts too.

#### 3. Ông Hai (Làng - Kim Lân)

Ông Hai, evacuated from his beloved village Chợ Dầu during the war against the French, hearing that the village has sided with the enemy. He is shaked and ashamed. Later the news is corrected, and he proundly tells people that the French burned his house.

**Prior:** Chợ Dầu is a loyal, patrictic village. The prior is strong but not 100% (Cromwell's rule). Ông Hai still questions the information, so his mind is not closed.

Ông Hai does not believe the information right away. He asks again, then runs through the people he knows in village and finds none who would side with the enemy. This is likelihood check: If the village had truly betrayed the resistance, he would expect to remember some traitors.

**An thought experiment:** imagine there are 1000 villages known to be loyal during wartime:
1. 20 have actually sided with the enemy (a prior probability of 2%). If we assume there is a 90% chance that such information would reach Ông Hai, then **18** of these villages would spread such rumor.
2. 980 villages remain loyal. In wartime, false rumors can still spread (let's assume at a rate of 10%), meaning that approximately **98** villages in this group would also spread such a rumor.
3. Out of total **116** rumors, only 18 are true:
$$
P(H \mid E) = \frac{P(E \mid H) \cdot P(H)}{P(E \mid H) \cdot P(H) + P(E \mid \neg H) \cdot P(\neg H)} = \frac{0.9 \times 0.02}{0.9 \times 0.02 + 0.1 \times 0.98} \approx 0.155 \quad (15.5 \%)
$$
One rumer moves his belief from 2% to roughly 16%. This explains why Ông Hai is deeply shaken yet initially doubtful. As the bad news keeps coming and he can't refure it, his confidence in his village cracking.

When the correction comes. The news of Ông Hai house being burned acts as new evidence that fits "the village is loyal" far better than "the village collaborates". Because why would the French burn a collaborating village? His beliefs swing back up. His level of belief is the "leaf in the wind" of the previous section.

**Limits** Ông Hai reasoning is mixed with love for his village, so it is motivated reasoning.  The story is mainly about psychology and patriotism, not logic.

Together the three show a progression: failing to update, updating on the wrong hypothesis, and updating in a healthy way.

### 2.2 Extra: Bayesian Thinking in Proverbs, Folk Songs, and Vietnamese Folk Culture

Before Thomas Bayes formalized his theorem, folk wisdom across cultures had already developed intuitive methods of reasoning, tools that help people navigate uncertainty, evaluate evidence, and avoid being deceived. 

- **“Trăm nghe không bằng một thấy”**: prioritizes direct evidence over hearsay; close to giving more weight to firsthand observation.
- **“Chưa thấy quan tài chưa đổ lệ”**: describes an overly rigid prior; people only update beliefs when evidence is overwhelming.
- **“Đi một ngày đàng, học một sàng khôn”**: new experience changes your posterior about the world.
- **“Khẩu phật tâm xà”**: warns that surface signals have low likelihood for the hypothesis “this person is truly good.”

## Section 3 - Conclusion: Does Bayes Actually Work? (And When It Doesn't)
### 3.1 Is Bayesian thinking just fancy intuition?
[![](https://www.smbc-comics.com/comics/1604852216-20201108.png "Oh God, is this the one that finally delivers the hatemail?")](https://www.smbc-comics.com/comic/easter-bunny)

A common objection to bayesian thinking is that those who employ it are not doing anything mathematically special, they are simply relying on human intuition - which is messy and inconsistent while dressing up their conclusions a pretentious mathematical label to sound **"cool"**. Critics argue that claiming to "Adjust prioirs" is often just default reasoning disguised as mathematical rigorous form.

However, this critique misunderstands the purpose of practical Bayesianism. Bayesian thinking was never intended to mean constantly plugging number into algebraic formulas for every daily decision. Instead, it represents a disciplined mental habit that differ from our default human cognitive patterns in two ways:

1. **Doubt applies to everything:** While people naturally acknowledge uncertainty in neutral domains, they struggle to do so when it come to political opinions, how the world works, social or personal convictions. A Bayesian holds *every* belief with some confidence levels, even without numbers: "I'd guess X, but i wouldn't be surprised if I'm wrong"
2.  **Compare two worlds:** Our default question is: "Can i find a way to make this fit what i already believe?" That question always yields a "Yes" and reinforces confirmation bias. In contrast, a Bayesian ask *"Suppose my belief were false, how likely would i be to observer this evidence in that alternative world?"*. This help prevent weak or ambigous evidence from being mistaken for solid, strong proof.

### 3.2 The Bayesian Trap

Bayes' rule set a framework to **Updating beliefs**, it cannot determine our **initial prior beliefs.** We may be too good at updating.

When Richard Price introduced Bayes' Theorem, he made an analogy to a man who steps out of a cave and see the sun rise for the first time. He thought to himself is that a magic, a one-off, or does the Sun always do that? As the sun keep rising again and again, the man used to it and he get a little bit more confident that that was the way the world works. *Life can work the same way.* Repeat rejection failure, or low pay can pile up until we see them as the way the world is, and the prior on "things could be different" sinks toward zero. 

Then comes the Self-fulfilling loop: you believe nothing can change, so you stop trying; they stop trying, so you keep getting the same results, and the results seem to confirm your belief.

Assigning an absolute prior probability of $0\%$ or $100\%$ certainty mathematically locks the equation, ensuring that no amount of real-world evidence, no matter how overwhelming, can ever alter one's mind.

### 3.3 The way out

The missing ingredient in the cave story is **Action**. Our action help determine outcomes, so they also create new evidence. As Nelson Mandela quote: *"Everything is impossible until it's done"*. A prior can sit near zero simply because nobody has tried yet.

Therefore, a complete understanding of Bayesian rationality demands continous **active experimentation**. Experimentation is part of being Bayesian, not an extra. When sticking to the same routine perpetually produces unsatisfactory results, one mustintentionally change their actions to sample new, uncorrupted evidence from the world.

Bayesian thinking is neither a magic wand for absolute truth nor a mere mathematical veneer for intuition. It is an ongoing, habit of staying humble, practice a mental operating system that keeps our convictions flexible, letting our beliefs **dance like a leaf in the wind** as we actively test and explore the world.
