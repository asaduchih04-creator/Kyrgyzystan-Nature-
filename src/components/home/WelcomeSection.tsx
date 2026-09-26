import Image from "next/image";

export function WelcomeSection() {
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <h1 id="welcome-title" className="welcome-composition">
        <Image
          src="/images/typography/welcome-title.png"
          width={2302}
          height={488}
          alt="Кош келиңиз! Сизди көрүп турганыбызга кубанычтабыз"
          className="typography-image"
          unoptimized
        />
      </h1>
    </section>
  );
}
