"use client";

import useSettingContext from "@/hooks/use-setting";
import CardAvailability from "./_components/card-availability";
import CardSetting from "./_components/card-setting";
const SettingPage = ({}) => {
  const { duration } = useSettingContext();

  return (
    <div className="px-4 md:px-6 grid grid-cols-6 gap-4">
      <CardSetting className="col-span-2" key={`setting-${duration}`} />
      <CardAvailability
        className="col-span-4"
        key={`availability-${duration}`}
      />
    </div>
  );
};

export default SettingPage;
