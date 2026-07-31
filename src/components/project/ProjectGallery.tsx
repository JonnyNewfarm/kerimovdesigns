import ProjectDescription from "./ProjectDescription";
import ProjectGalleryItem from "./ProjectGalleryItem";
import type {
  ImageDimensions,
  ImageDimensionsMap,
  LoadedImages,
  Project,
} from "./projectTypes";
import { imageLayouts } from "./projectUtils";

type ProjectGalleryProps = {
  project: Project;
  images: string[];
  activeIndex: number | null;
  hoveredIndex: number | null;
  loadedImages: LoadedImages;
  imageDimensions: ImageDimensionsMap;
  onHoverAction: (index: number | null) => void;
  onOpenImageAction: (index: number) => void;
  onImageLoadAction: (index: number, dimensions: ImageDimensions) => void;
};

export default function ProjectGallery({
  project,
  images,
  activeIndex,
  hoveredIndex,
  loadedImages,
  imageDimensions,
  onHoverAction,
  onOpenImageAction,
  onImageLoadAction,
}: ProjectGalleryProps) {
  return (
    <div
      className="
        relative
        left-1/2
        w-screen
        -translate-x-1/2
        overflow-hidden
      "
    >
      <div
        className="
          mb-20
          mt-20
          flex
          min-h-[70vh]
          w-full
          flex-col
          gap-y-20
          px-4
          sm:mt-28
          sm:gap-y-32
          sm:px-8
          lg:mt-32
        "
      >
        {images.map((src, index) => {
          const isActive = activeIndex === index;

          const isLoaded = Boolean(loadedImages[index]);

          const shouldBlur =
            (hoveredIndex !== null && hoveredIndex !== index) ||
            (activeIndex !== null && activeIndex !== index);

          const layout = imageLayouts[index % imageLayouts.length];

          return (
            <div key={`${src}-${index}`}>
              <ProjectGalleryItem
                src={src}
                index={index}
                title={project.title}
                layout={layout}
                dimensions={imageDimensions[index]}
                isActive={isActive}
                isLoaded={isLoaded}
                shouldBlur={shouldBlur}
                onHoverAction={onHoverAction}
                onOpenAction={onOpenImageAction}
                onLoadAction={onImageLoadAction}
              />

              {index === 0 ? (
                <ProjectDescription
                  title={project.title}
                  description={project.description}
                />
              ) : null}
            </div>
          );
        })}

        {project.srcVideo ? (
          <div
            className="
              flex
              w-full
              justify-center
              lg:justify-start
            "
          >
            <video
              className="
                h-auto
                w-full
                max-w-[520px]
                lg:max-w-[680px]
                lg:translate-x-20
              "
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={project.srcVideo}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
