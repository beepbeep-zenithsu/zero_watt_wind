# Reproduce the ZeroWatt Wind screening report

From the repository root, using Python 3 and Node:

```text
node model/audit_site.cjs
python model/finance.py
python model/gauntlet.py
python model/verify_report.py --prepare
python model/build_report.py
```

Compile `report/main.tex` twice, sequentially, with pdfLaTeX (or use latexmk).
The TeX is a single standalone file: no external image, CSV or bibliography is required to compile it. The generator copies calculated/source-input numbers into it; `data/report_numbers.csv` records the raw values, display rounding and origins.

```text
cd report
pdflatex -interaction=nonstopmode -halt-on-error main.tex
pdflatex -interaction=nonstopmode -halt-on-error main.tex
cd ..
python model/verify_report.py
```

`finance.py` and its `supplement.py` use only Python's standard library. `render_qa.py` additionally uses Pillow for contact sheets of rendered pages. The installed MiKTeX required access to its user configuration, automatic installation of a missing package and initial EC font generation; compilation was then successful. Python was run with the Codex bundled interpreter because the `python`/`python3` commands on PATH were Microsoft Store aliases.

Cash flow is monthly, end-period, with inception at month zero and an annual effective discount rate. Fixed annual summaries are monthly sums; their month averages are not separate forecasts. IRR is annual effective from those same monthly dates. Cohorts and fractional deployments are expected values. The late fleet-installation depreciation repair and the three-shaft/six-bearing two-stage production correction are reflected in all final outputs.

Financial and physical checks establish arithmetic consistency, not measured technical performance or market demand. The conventional fan's delivered pressure-flow duty, field aeration performance, actual site wind, all commercial tariffs/WTP and many custom production quotations remain unverified. Some cited source records are explicitly index-only or failed full-text attempts; source access and age are visible in `data/sources.csv`. No source-derived superiority, guaranteed healthcare compliance, fish survival or zero-lifecycle-carbon claim is made.

The requested evidence score >=8 could not honestly be achieved for field/quote/customer-dependent tasks after the maximum review rounds. `notes/gauntlet_log.md`, task notes and `data/gauntlet_scores.csv` preserve those unmet thresholds. No scores, prices, grants, tests or customers were invented to close them.
