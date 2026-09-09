import {test,expect} from "@playwright/test";
for(const theme of ["light","dark"]){
  test(`vector labels fit and contrast in ${theme}`,async({page})=>{
    await page.addInitScript(value=>localStorage.setItem("physicslab-theme",value),theme);
    await page.emulateMedia({reducedMotion:"reduce"});
    for(const family of ["relative-velocity-vectors","resultant-force-2d"]){
      await page.goto(`/practice/family/${family}`);
      const svg=page.getByTestId("vector-diagram").locator("svg");
      await expect(svg).toBeVisible();
      const report=await svg.evaluate(element=>{
        const svg=element as SVGSVGElement;
        const box=svg.viewBox.baseVal;
        const bg=getComputedStyle(svg.querySelector("rect")!).fill;
        const luminance=(color:string)=>{
          const channels=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{const s=v/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;});
          return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
        };
        return Array.from(svg.querySelectorAll("text")).map(label=>{
          const b=label.getBBox(),fg=luminance(getComputedStyle(label).fill),back=luminance(bg);
          return {label:label.textContent,fits:b.x>=0&&b.y>=0&&b.x+b.width<=box.width&&b.y+b.height<=box.height,contrast:(Math.max(fg,back)+.05)/(Math.min(fg,back)+.05)};
        });
      });
      expect(report.length).toBeGreaterThan(0);
      for(const item of report){expect(item.fits,item.label??"").toBe(true);expect(item.contrast,item.label??"").toBeGreaterThanOrEqual(4.5);}
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      if(family==="relative-velocity-vectors") await expect(page.locator("main")).toContainText(/относительно (воды|воздуха) со скоростью/);
    }
  });
}
