function Frame() {
  return (
    <div className="absolute bg-[rgba(122,35,188,0.2)] inset-[26.53%_0_0_0] rounded-[20px]">
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[28px] left-1/2 overflow-clip top-1/2 w-[120px]">
      <p className="absolute font-['Cabin:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-49px)] text-[32px] text-white top-[calc(50%-19px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        movies
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute inset-[28.57%_74.67%_0_0]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[rgba(122,35,188,0.2)] h-[71px] left-1/2 opacity-0 rounded-[20px] top-[calc(50%-0.5px)] w-[210px]">
        <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
      </div>
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 absolute h-[28px] left-[calc(50%-0.5px)] overflow-clip top-[22px] w-[120px]">
      <p className="absolute font-['Cabin:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-43px)] text-[32px] text-left text-white top-[calc(50%-19px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        shows
      </p>
    </div>
  );
}

function Frame5() {
  return (
    <button className="-translate-x-1/2 absolute block bottom-[-1.02%] cursor-pointer left-1/2 top-[28.57%] w-[225px]">
      <div className="absolute bg-[rgba(122,35,188,0.2)] h-[71px] left-[7px] opacity-0 rounded-[20px] top-0 w-[210px]">
        <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
      </div>
      <Frame2 />
    </button>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[28px] left-[45px] overflow-clip top-[22px] w-[120px]">
      <p className="absolute font-['Cabin:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-42px)] text-[32px] text-black top-[calc(50%-19px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        anime
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute inset-[4.08%_1.45%_23.47%_71.65%]">
      <div className="absolute bg-[rgba(122,35,188,0.2)] h-[71px] left-[7px] rounded-[20px] top-0 w-[210px]">
        <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
      </div>
      <Frame3 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="relative size-full" data-name="Component 1">
      <Frame />
      <Frame4 />
      <Frame5 />
      <Frame6 />
    </div>
  );
}