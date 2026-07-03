---
title: "Estimating the SD from the IQR"
date: 2025-05-25
summary: "Under a Normal distribution assumption, you can estimate the standard deviation from the ratio between your data's IQR and the IQR of a standard Normal — and why that breaks when the data isn't Normal."
canonical: "https://medium.com/@rolando.j123/estimating-the-sd-from-the-iqr-f2f07f2d2985"
tags: ["statistics"]
---

## Beware of excessive reliance on Normality

### So, what's the variance?

I recently needed to estimate a population variance using only the interquartile
range (IQR) from a sample. This came up during a sample size calculation, when the
complete data wasn't available to me.

The core insight is this: under a Normal distribution assumption, you can estimate the
standard deviation (SD) as the ratio between the IQR of your data and the IQR of a
standard Normal distribution.

### From here to there (the math)

The IQR is the difference between the 75th and 25th percentiles — it tells you where
the middle 50% of the data lives. For a normally distributed variable
$X \sim N(\mu, \sigma)$ and a standard normal $Z \sim N(0, 1)$, the relationship
$X = \mu + \sigma Z$ means the quantiles scale linearly. That property is what lets us
estimate: the variance equals the square of the sample IQR divided by the IQR of a
standard normal distribution.

This is only true because I am assuming that $X$ has a Normal distribution.

### Don't believe me yet? (Simulation)

I tested this through simulation with two distributions:

- A Normal distribution: mean 64 inches, SD 2.8 inches — roughly like the heights of US women.
- A Gamma distribution: shape 3.2, rate 0.015 — roughly like seasonal rainfall in a semi-arid region.

Under normality, the SD estimates converged to the true value as the sample size grew.
But when I applied the same formula to the non-normal (Gamma) data, the estimates
converged to the *wrong* value — with average differences of around 7 mm at N = 5000.

The simulation code is available on my GitHub.
