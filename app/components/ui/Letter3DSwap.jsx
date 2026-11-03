"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";

const splitIntoCharacters = (text) => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

export default function Letter3DSwap({
  children,
  as: Component = "span",
  mainClassName = "",
  frontFaceClassName = "",
  secondFaceClassName = "",
  rotateDirection = "top",
  staggerDuration = 0.025,
  staggerFrom = "first",
  hoverMode = "word", // "word" | "letter" | "all"
  transition = { type: "spring", damping: 22, stiffness: 170 },
}) {
  const text = typeof children === "string" ? children : String(children || "");
  
  const words = useMemo(() => {
    const t = text.split(" ");
    return t.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== t.length - 1,
    }));
  }, [text]);

  const totalChars = useMemo(() => {
    return words.reduce((acc, word) => acc + word.characters.length, 0);
  }, [words]);

  let charCount = 0;

  const getRotationStyles = (dir, isSecondFace = false) => {
    switch (dir) {
      case "top":
      case "bottom":
        return {
          rotateX: isSecondFace ? (dir === "top" ? 90 : -90) : 0,
          rotateY: 0,
          z: 0,
        };
      case "left":
      case "right":
        return {
          rotateX: 0,
          rotateY: isSecondFace ? (dir === "left" ? -90 : 90) : 0,
          z: 0,
        };
      default:
        return { rotateX: 0, rotateY: 0 };
    }
  };

  const getHoverStyles = (dir, isSecondFace = false) => {
    switch (dir) {
      case "top":
        return {
          rotateX: isSecondFace ? 0 : -90,
        };
      case "bottom":
        return {
          rotateX: isSecondFace ? 0 : 90,
        };
      case "left":
        return {
          rotateY: isSecondFace ? 0 : 90,
        };
      case "right":
        return {
          rotateY: isSecondFace ? 0 : -90,
        };
      default:
        return {};
    }
  };

  return (
    <Component
      className={`inline-flex flex-wrap ${mainClassName}`}
      {...(hoverMode === "all" ? { initial: "initial", whileHover: "hover" } : {})}
    >
      {words.map((wordObj, wordIndex) => (
        <motion.span
          key={wordIndex}
          className="inline-flex whitespace-nowrap cursor-pointer"
          {...(hoverMode === "word" ? { initial: "initial", whileHover: "hover" } : {})}
        >
          {wordObj.characters.map((char, charIndex) => {
            const currentIndex = charCount++;

            let staggerDelay = 0;
            if (staggerFrom === "first") {
              staggerDelay = currentIndex * staggerDuration;
            } else if (staggerFrom === "last") {
              staggerDelay = (totalChars - 1 - currentIndex) * staggerDuration;
            } else if (staggerFrom === "center") {
              const center = (totalChars - 1) / 2;
              staggerDelay = Math.abs(center - currentIndex) * staggerDuration;
            }

            const charTransition = {
              ...transition,
              delay: staggerDelay,
            };

            return (
              <motion.span
                key={charIndex}
                className="relative inline-block select-none overflow-visible"
                style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                {...(hoverMode === "letter" ? { initial: "initial", whileHover: "hover" } : {})}
              >
                {/* Front Face */}
                <motion.span
                  className={`inline-block overflow-visible ${frontFaceClassName}`}
                  style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
                  variants={{
                    initial: getRotationStyles(rotateDirection, false),
                    hover: getHoverStyles(rotateDirection, false),
                  }}
                  transition={charTransition}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>

                {/* Second Face */}
                <motion.span
                  className={`absolute inset-0 inline-block overflow-visible ${secondFaceClassName}`}
                  style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
                  variants={{
                    initial: getRotationStyles(rotateDirection, true),
                    hover: getHoverStyles(rotateDirection, true),
                  }}
                  transition={charTransition}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              </motion.span>
            );
          })}
          {wordObj.needsSpace && <span className="inline-block">&nbsp;</span>}
        </motion.span>
      ))}
    </Component>
  );
}
