import type Locale from "@/locales";
import { Dispatch, useState } from "react";
import { CheckMark } from "../CheckMark";
import Button from "./Button";

function applySearch(
  searchQuery: string,
  checkmarks: boolean[],
  setQuery: Dispatch<{
    searchQuery: string;
    years: (0 | 1 | 2 | 3 | 4)[];
    offers: {
      summer: boolean;
      internship: boolean;
      partTime: boolean;
      thesis: boolean;
      fullTime: boolean;
      trainee: boolean;
    };
  }>
) {
  setQuery({
    searchQuery: searchQuery.toLowerCase().trim(),
    years: checkmarks
      .slice(0, 5)
      .map((value, index) => (value ? index : -1))
      .filter((index) => index !== -1) as (0 | 1 | 2 | 3 | 4)[],
    offers: {
      summer: checkmarks[5],
      internship: checkmarks[6],
      partTime: checkmarks[7],
      thesis: checkmarks[8],
      fullTime: checkmarks[9],
      trainee: checkmarks[10],
    },
  });
}

export default function Search({
  t,
  setQuery,
}: {
  t: Locale;
  setQuery: Dispatch<{
    searchQuery: string;
    years: (0 | 1 | 2 | 3 | 4)[];
    offers: {
      summer: boolean;
      internship: boolean;
      partTime: boolean;
      thesis: boolean;
      fullTime: boolean;
      trainee: boolean;
    };
  }>;
}) {
  const years = [0, 1, 2, 3, 4];
  const offers = [
    t.exhibitorSettings.table.row1.section2.jobs.summer,
    t.exhibitorSettings.table.row1.section2.jobs.internship,
    t.exhibitorSettings.table.row1.section2.jobs.partTime,
    t.exhibitorSettings.table.row1.section2.other.thesis,
    t.exhibitorSettings.table.row1.section2.other.fullTime,
    t.exhibitorSettings.table.row1.section2.other.trainee,
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [checkmarks, setCheckmarks] = useState(Array<boolean>(11).fill(false));

  const toggleCheckmark = (index: number) => {
    setCheckmarks((prev) => {
      const newCheckmarks = [...prev];
      newCheckmarks[index] = !newCheckmarks[index];
      return newCheckmarks;
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center my-4">
        <input
          className="grow min-h-[40px] outline-none border-2 border-cerise bg-[#eaeaea] bg-opacity-10 
                    rounded-3xl px-3 text-white text-opacity-50 focus:placeholder:text-transparent"
          type="text"
          placeholder={t.map.search.placeHolder}
          value={searchQuery}
          onChange={(q) => setSearchQuery(q.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter")
              applySearch(searchQuery, checkmarks, setQuery);
          }}
        />
        <div className="flex flex-row text-3xl">
          <Button
            value="⌕"
            loading={false}
            onClick={() => applySearch(searchQuery, checkmarks, setQuery)}
          />
          <Button
            value="≡"
            loading={false}
            onClick={() => setShowFilter(!showFilter)}
          />
          
        </div>
      </div>
      <div className="flex justify-center w-full">
        {showFilter && (
          <div
            className="w-full block border-2 border-cerise bg-[#eaeaea] bg-opacity-10
                          rounded-lg text-white justify-center text-xl"
          >
            <div className="w-full h-full flex flex-col justify-center items-center max-xs:p-6 font-light text-base">
              <div className="flex flex-row mt-1 space-x-4 items-center">
                <span className="mr-2">{t.map.search.filterYear}:</span>
                {years.map((year, pos) => (
                  <div className="flex flex-col items-center" key={`${pos}`}>
                    <span className="text-lg text-gray-500">{year + 1}</span>
                    <input
                      type="checkbox"
                      name={`${pos}`}
                      checked={checkmarks[pos]}
                      onClick={() => toggleCheckmark(pos)}
                      className="form-checkbox w-6 h-6 hover:cursor-pointer hover:border-cerise
                                    bg-black/25 checked:bg-cerise checked:border-white rounded-lg focus:ring-0
                                    border-2 border-yellow"
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-rows-3 grid-cols-2 gap-2 mt-4 mb-2">
                {offers.map((offer, pos) => (
                  <div
                    key={`${pos + 5}`}
                    className="flex flex-row space-x-2 justify-between items-center"
                  >
                    <div className="text-sm flex-grow">{offer}</div>
                    <div style={{ marginTop: '-2px' }}>
                      <CheckMark
                        name={`${pos + 5}`}
                        checked={checkmarks[pos + 5]}
                        onClick={() => toggleCheckmark(pos + 5)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
