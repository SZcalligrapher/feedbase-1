'use client';

import { useEffect, useRef } from 'react';
import { DotLottiePlayer, DotLottieRefProps } from '@dotlottie/react-player';
import { useTheme } from 'next-themes';

interface LottieSrc {
  dark: Record<string, unknown> | string;
  light: Record<string, unknown> | string;
}

// TODO: switch to player-component
// https://docs.lottiefiles.com/dotlottie-players/components/player-component/usage/next
export default function LottiePlayer({
  lottieSrc,
  className,
  animate,
  initialColor,
  animationColor,
}: {
  lottieSrc: LottieSrc;
  className?: string;
  animate?: boolean;
  initialColor?: string;
  animationColor?: string;
}) {
  const lottieRef = useRef<DotLottieRefProps>();
  const { theme } = useTheme();

  useEffect(() => {
    if (animate) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [animate]);

  return (
    <DotLottiePlayer
      style={{ transform: '' }}
      src={theme === 'dark' ? lottieSrc.dark : lottieSrc.light}
      lottieRef={lottieRef}
      onEvent={(event) => {
        if (event === 'ready') {
          // Get svg element
          const lottiePlayerSvg = lottieRef.current?.getContainer()?.querySelector('svg');

          //? This is needed because chrome adds a blur filter to the svg
          // Edit transform style but keep other styles
          const transformStyle = lottiePlayerSvg
            ?.getAttribute('style')
            ?.replace('transform: translate3d(0px, 0px, 0px);', '');

          // Apply transform style
          lottiePlayerSvg?.setAttribute('style', transformStyle!);

          // Get computed color from parent element (text color)
          const parentElement = lottiePlayerSvg?.closest('[class*="text-"]') || lottiePlayerSvg?.parentElement;
          const computedColor = parentElement
            ? window.getComputedStyle(parentElement).color
            : null;

          // Use initialColor if provided, otherwise use computed text color, otherwise use currentColor
          const colorToApply = initialColor || computedColor || 'currentColor';

          // Change color of svg
          lottiePlayerSvg?.querySelectorAll('path').forEach((path: SVGPathElement) => {
            path.style.fill = colorToApply;

            // Incase stroke is used in initial svg
            if (
              path.getAttributeNames().includes('stroke') &&
              path.getAttribute('stroke-opacity') !== '0'
            ) {
              path.style.stroke = colorToApply;
            }
          });
        } else if (event === 'play') {
          // Get svg element
          const lottiePlayerSvg = lottieRef.current?.getContainer()?.querySelector('svg');

          // Change color of svg
          if (animationColor) {
            lottiePlayerSvg?.querySelectorAll('path').forEach((path: SVGPathElement) => {
              path.style.fill = animationColor;

              // Incase stroke is used in animation
              if (
                path.getAttributeNames().includes('stroke') &&
                path.getAttribute('stroke-opacity') !== '0'
              ) {
                path.style.stroke = animationColor;
              }
            });
          }
        } else if (event === 'stop') {
          // Get svg element
          const lottiePlayerSvg = lottieRef.current?.getContainer()?.querySelector('svg');

          // Get computed color from parent element (text color)
          const parentElement = lottiePlayerSvg?.closest('[class*="text-"]') || lottiePlayerSvg?.parentElement;
          const computedColor = parentElement
            ? window.getComputedStyle(parentElement).color
            : null;

          // Use initialColor if provided, otherwise use computed text color, otherwise use currentColor
          const colorToApply = initialColor || computedColor || 'currentColor';

          // Reset color of svg
          lottiePlayerSvg?.querySelectorAll('path').forEach((path: SVGPathElement) => {
            path.style.fill = colorToApply;

            // Incase stroke is used in initial svg
            if (path.getAttributeNames().includes('stroke') && path.getAttribute('stroke-opacity') !== '0') {
              path.style.stroke = colorToApply;
            }
          });
        }
      }}
      className={className}
    />
  );
}
