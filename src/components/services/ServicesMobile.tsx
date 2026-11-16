import Image from "next/image";
import { SECTIONS } from "./servicesData";

export default function ServicesMobile() {
  return (
    <section className="w-full pb-20">
      <div className="mx-auto w-full px-5 sm:px-8">
        {SECTIONS.map((service, index) => {
          const isVideo = /\.(mp4|webm)$/i.test(service.src);

          return (
            <article
              key={service.src}
              className="
                flex
                min-h-[85svh]
                w-full
                flex-col
                items-start
                justify-center
                gap-10
                py-16
              "
            >
              {/* IMAGE — LEFT, ORIGINAL ASPECT RATIO */}
              <div
                className="
                  w-[58%]
                  max-w-[260px]
                  self-start
                "
              >
                {isVideo ? (
                  <video
                    src={service.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="block h-auto w-full"
                  />
                ) : (
                  <Image
                    src={service.src}
                    alt={`Design work ${index + 1}`}
                    width={1200}
                    height={1200}
                    sizes="(max-width: 640px) 58vw, 260px"
                    quality={90}
                    className="block h-auto w-full"
                  />
                )}
              </div>

              {/* DESCRIPTION — BELOW IMAGE */}
              <p
                className="
                  w-full
                  text-[clamp(20px,6vw,42px)]
                  font-normal
                  leading-[1.14]
                  tracking-normal
                "
              >
                {service.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
