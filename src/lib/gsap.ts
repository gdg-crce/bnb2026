"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register once, on the client only. Importing this module from anywhere
// guarantees the plugins are available before any tween is created.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);

// On mobile, showing/hiding the URL bar fires a resize and would otherwise
// force a full ScrollTrigger.refresh() mid-scroll — the single biggest source
// of mobile jank. Only refresh on real orientation changes.
ScrollTrigger.config({ ignoreMobileResize: true });

// Do NOT call ScrollTrigger.normalizeScroll() here. It hijacks the scroll
// position the same way Lenis does; running both fights for control.

// Project-wide animation defaults so sections stay visually consistent.
gsap.defaults({ ease: "power3.out", duration: 1 });

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText, useGSAP };
