import { SECTIONS } from "./servicesData";

export default function ServicesMobile() {
  return (
    <section className="w-full pb-20">
      <div className="mx-auto w-full space-y-20 px-[5%] sm:space-y-28">
        {SECTIONS.map((service) => {
          const isVideo = /\.(mp4|webm)$/i.test(service.src);

          return (
            <article
              key={service.src}
              className="flex w-full flex-col items-start"
            >
              {/* MEDIA */}
              <div className="relative w-full overflow-hidden">
                {isVideo ? (
                  <video
                    src={service.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={service.title}
                    className="block h-auto w-full"
                  />
                ) : (
                  <img
                    src={service.src}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                )}
              </div>

              {/* TITLE & DESCRIPTION */}
              <div
                className="
                  mt-5
                  grid
                  w-full
                  grid-cols-[32%_minmax(0,1fr)]
                  items-baseline
                  gap-4
                "
              >
                <h2
                  className="
                    text-[14px]
                    font-medium
                    leading-[1.3]
                    tracking-[-0.015em]
                    text-[#e7e3dd]
                  "
                >
                  {service.title}
                </h2>

                <p
                  className="
                    text-[clamp(16px,4.8vw,21px)]
                    font-normal
                    leading-[1.4]
                    tracking-[-0.015em]
                    text-[#e7e3dd]/90
                  "
                >
                  {service.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
