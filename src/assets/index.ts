import localFont from 'next/font/local'

export const InterFont = localFont({
    src: [
      {
        path: "/fonts/Inter_18pt-Regular.ttf",
        weight: "400",
        style: "normal",
      },
      {
        path: "/fonts/Inter_18pt-Medium.ttf",
        weight: "500",
        style: "normal",
      }, 
      {
        path: "/fonts/Inter_18pt-SemiBold.ttf",
        weight: "600",
        style: "normal",
      },
      {
        path: "/fonts/Inter_18pt-Bold.ttf",
        weight: "700",
        style: "normal",
      }
    ],
  })
  