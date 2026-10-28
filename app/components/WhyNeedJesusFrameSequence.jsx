"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMediaUrl } from "@/lib/media";

const TOTAL_FRAMES = 240;

const getFramePath = (index) => {
  const paddedIndex = String(index).padStart(6, "0");
  return getMediaUrl(`/v1_frames/frame_${paddedIndex}.jpg`);
};

export default function WhyNeedJesusFrameSequence() {
  const pinContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES + 1));
  const isLoadedRef = useRef(new Uint8Array(TOTAL_FRAMES + 1));
  const targetFrameRef = useRef(1);
  const lastDrawnFrameRef = useRef(-1);

  const [activeFrame, setActiveFrame] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Core drawing method
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Find requested frame or fallback to nearest loaded frame
    let img = isLoadedRef.current[frameIndex] ? imagesRef.current[frameIndex] : null;

    if (!img) {
      // Search backwards
      for (let i = frameIndex - 1; i >= 1; i--) {
        if (isLoadedRef.current[i]) {
          img = imagesRef.current[i];
          break;
        }
      }
      // Search forwards
      if (!img) {
        for (let i = frameIndex + 1; i <= TOTAL_FRAMES; i++) {
          if (isLoadedRef.current[i]) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    // Fast object-fit cover
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) * 0.5;
    const ny = (ch - nh) * 0.5;

    ctx.drawImage(img, nx, ny, nw, nh);
  }, []);

  // Continuous 60/120 FPS Render Loop (Never cancels or drops frames)
  useEffect(() => {
    let animationFrameId;

    const renderLoop = () => {
      if (targetFrameRef.current !== lastDrawnFrameRef.current) {
        drawFrame(targetFrameRef.current);
        lastDrawnFrameRef.current = targetFrameRef.current;
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [drawFrame]);

  // Window resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    lastDrawnFrameRef.current = -1; // Force redraw on resize
  }, []);

  // Preload and decode all 240 frames
  useEffect(() => {
    let isCancelled = false;

    const preloadAllFrames = async () => {
      let count = 0;

      // 1. Load Frame 1 immediately
      const img1 = new Image();
      img1.src = getFramePath(1);
      img1.onload = async () => {
        if (isCancelled) return;
        try {
          if (img1.decode) await img1.decode();
        } catch (_) {}
        imagesRef.current[1] = img1;
        isLoadedRef.current[1] = 1;
        count++;
        setLoadedCount(count);
        setIsReady(true);
        handleResize();
        drawFrame(1);
      };

      // 2. Preload remaining 239 frames concurrently in batches
      const remaining = Array.from({ length: TOTAL_FRAMES - 1 }, (_, i) => i + 2);
      const concurrency = 16;

      const worker = async () => {
        while (remaining.length > 0 && !isCancelled) {
          const idx = remaining.shift();
          if (!idx) break;

          await new Promise((resolve) => {
            const img = new Image();
            img.src = getFramePath(idx);
            img.onload = async () => {
              if (!isCancelled) {
                try {
                  if (img.decode) await img.decode();
                } catch (_) {}
                imagesRef.current[idx] = img;
                isLoadedRef.current[idx] = 1;
                count++;
                setLoadedCount(count);
              }
              resolve();
            };
            img.onerror = () => resolve();
          });
        }
      };

      const workers = Array.from({ length: concurrency }, () => worker());
      await Promise.all(workers);
    };

    preloadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, handleResize]);

  // Window resize observer
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // GSAP ScrollTrigger: Lock screen firmly and scrub smoothly at controlled pace
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const pinContainer = pinContainerRef.current;
    if (!pinContainer) return;

    const st = ScrollTrigger.create({
      trigger: pinContainer,
      start: "top top",
      end: "+=600%", // Controlled, slower scroll distance so all frames are clearly visible
      pin: true,
      pinSpacing: true,
      scrub: 1.0, // Silky smooth damping without jerky jumps
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Compute frame from 1 to 240
        const frameIndex = Math.min(
          TOTAL_FRAMES,
          Math.max(1, Math.round(self.progress * (TOTAL_FRAMES - 1) + 1))
        );

        targetFrameRef.current = frameIndex;
        setActiveFrame(frameIndex);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const progressPercent = Math.round((activeFrame / TOTAL_FRAMES) * 100);

  return (
    <div
      ref={pinContainerRef}
      className="w-full h-screen min-h-[100dvh] relative flex flex-col items-center justify-center overflow-hidden bg-background m-0 p-0 select-none"
    >
      {/* Full-Screen Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0 object-cover pointer-events-none"
      />

      {/* Seamless Theme Background Feathering Overlays */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-44 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-36 sm:h-52 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

      {/* Initial Loading State */}
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-3 bg-background">
          <div className="w-10 h-10 border-2 border-[#D9A31A] border-t-transparent rounded-full animate-spin" />
          <p className="font-sans-clean text-xs tracking-widest text-text-secondary uppercase">
            Loading Motion Experience...
          </p>
        </div>
      )}

      {/* Minimal Floating Status Tracker */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2 pointer-events-none">
        <div className="w-52 sm:w-80 h-1.5 bg-text-primary/10 rounded-full overflow-hidden backdrop-blur-sm shadow-sm">
          <div
            className="h-full bg-gradient-to-r from-[#D9A31A] via-amber-300 to-[#D9A31A] rounded-full transition-all duration-75"
            style={{ width: `${(activeFrame / TOTAL_FRAMES) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-text-secondary font-sans-clean text-[11px] sm:text-xs tracking-widest uppercase font-semibold">
          <span>Frame</span>
          <span className="text-[#D9A31A] font-bold tabular-nums">
            {activeFrame} / {TOTAL_FRAMES}
          </span>
          <span className="text-text-secondary/60">({progressPercent}%)</span>
          {progressPercent >= 100 && (
            <span className="text-green-500 font-bold ml-1 animate-pulse">✓ Done</span>
          )}
        </div>
      </div>
    </div>
  );
}
