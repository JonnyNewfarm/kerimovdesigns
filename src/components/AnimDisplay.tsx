import React from "react";

const AnimDisplay = () => {
  return (
    <div className="min-h-[30vh] pb-10 bg-[#24232] mt-14 lg:mt-0 w-full flex flex-col lg:flex-row items-center justify-center gap-x-10 gap-y-14">
      <div className="lg:w-[40vw] w-[80vw]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-contain"
          src="/bylarm-anim.mp4"
        />
      </div>

      <div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="lg:w-[40vw] w-[80vw] hidden lg:block"
          src="bbs-anim.mp4"
        />
      </div>
    </div>
  );
};

export default AnimDisplay;
