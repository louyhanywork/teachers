import { Suspense } from "react";

export const metadata = {
  title: "Course Chapters",
  description: "Explore chapters and lessons available in this course.",
};

export default function SubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
                    <Suspense fallback={null}>

      {children}
                    </Suspense>

    </body>
  );
}
