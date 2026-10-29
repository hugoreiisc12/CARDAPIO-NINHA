type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  charSplit?: boolean;
  center?: boolean;
};

export function BrandLogo({
  size = "sm",
  className = "",
  charSplit = false,
  center = false,
}: Props) {
  const nameSize =
    size === "xl"
      ? "text-[clamp(84px,28vw,123px)]"
      : size === "lg"
        ? "text-[44px]"
        : size === "md"
          ? "text-[32px]"
          : "text-[22px]";
  const cakesSize =
    size === "xl" ? "text-[clamp(50px,16vw,79px)]" : size === "lg" ? "text-[13px]" : "text-[10px]";
  const cakesTracking = size === "xl" ? "0.34em" : "0.34em";

  if (charSplit) {
    return (
      <div
        className={`inline-flex flex-col leading-none ${center ? "items-center text-center" : "items-start"} ${className}`}
      >
        <span
          aria-hidden
          className={`font-display italic font-medium text-cream-50 ${nameSize}`}
          style={{ letterSpacing: "-0.01em" }}
        >
          {"Ninha".split("").map((ch, i) => (
            <span key={i} className="hero-logo-char inline-block will-change-transform">
              {ch}
            </span>
          ))}
        </span>
        <span
          aria-hidden
          className={`eyebrow text-gradient-brand mt-1 ${cakesSize}`}
          style={{ letterSpacing: cakesTracking }}
        >
          {"Cakes".split("").map((ch, i) => (
            <span key={i} className="hero-logo-char inline-block will-change-transform">
              {ch}
            </span>
          ))}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-col leading-none ${center ? "items-center text-center" : "items-start"} ${className}`}
    >
      <span
        className={`font-display italic font-medium text-cream-50 ${nameSize}`}
        style={{ letterSpacing: "-0.01em" }}
      >
        Ninha
      </span>
      <span
        className={`eyebrow text-gradient-brand mt-1 ${cakesSize}`}
        style={{ letterSpacing: "0.34em" }}
      >
        Cakes
      </span>
    </div>
  );
}
