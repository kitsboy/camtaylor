const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const vp of [{width:1440,height:900},{width:390,height:844}]) {
    const p = await b.newPage({ viewport: vp });
    await p.goto('https://camtaylor.ca/', { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(2600);
    const d = await p.evaluate(() => {
      const caseBtn = document.querySelector('.venture-case-btn');
      const jt = document.querySelector('.journal-toggle');
      return {
        scrollHeight: document.body.scrollHeight,
        ventureCards: document.querySelectorAll('.venture-card').length,
        caseHref: caseBtn ? caseBtn.getAttribute('href') : 'none',
        caseIsA: caseBtn ? caseBtn.tagName.toLowerCase() : 'none',
        modalGone: !document.querySelector('.venture-modal'),
        dotsGone: !document.querySelector('.venture-dots'),
        jtText: jt ? jt.textContent.trim().slice(0,42) : 'none',
        proofStrip: !!document.querySelector('.proof-strip'),
        testimonialCards: document.querySelectorAll('.testimonial-card').length,
        signalPresent: !!document.querySelector('.live-state') || !!document.querySelector('.signal-board'),
      };
    });
    if (vp.width===390) {
      await p.click('.journal-toggle'); await p.waitForTimeout(400);
      const after = await p.evaluate(() => ({ cards: document.querySelectorAll('.testimonial-card').length }));
      console.log(JSON.stringify({vp, d, afterToggle: after}));
    } else {
      console.log(JSON.stringify({vp, d}));
    }
    await p.close();
  }
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
