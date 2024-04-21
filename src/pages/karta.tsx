import { prisma } from "@/server/db";
import { useLocale } from "@/locales";
import { useEffect, useState } from "react"; 
import Search from "@/components/Map/Search";
import { MapProp } from "@/shared/Classes";
import ExhibitorExplorer from "@/components/Map/ExhibitorExplorer";

import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/Map/Map3'), { ssr: false });

export default function Karta({ exhibitorData }: { exhibitorData: MapProp[] }) {
  const t = useLocale();

  const [exhibitors, setExhibitors] = useState(
    Object.fromEntries(
      exhibitorData.map((exhibitor) => [exhibitor.position, exhibitor])
    )
  );
  const [query, setQuery] = useState<{
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
  }>({
    searchQuery: "",
    years: [],
    offers: {
      summer: false,
      internship: false,
      partTime: false,
      thesis: false,
      fullTime: false,
      trainee: false,
    },
  });
  const [mapInView, setMapInView] = useState<1 | 2 | 3>(1);
  const [selectedExhibitor, setSelectedExhibitor] = useState<number>(0);

  useEffect(() => {
    console.log(query);
    setExhibitors(
      Object.fromEntries(
        exhibitorData.map((exhibitor) => {
          if (!RegExp(query.searchQuery).test(exhibitor.name.toLowerCase()))
            return [];
          if (query.years.length != 0) {
            if (
              !query.years.some((year) =>
                exhibitor.offers.summerJob.includes(year)
              ) &&
              !query.years.some((year) =>
                exhibitor.offers.internship.includes(year)
              ) &&
              !query.years.some((year) =>
                exhibitor.offers.partTimeJob.includes(year)
              )
            ) {
              return [];

            }
          }
          if (
            (query.offers.summer && exhibitor.offers.summerJob.length == 0) ||
            (query.offers.internship &&
              exhibitor.offers.internship.length == 0) ||
            (query.offers.partTime &&
              exhibitor.offers.partTimeJob.length == 0) ||
            (query.offers.thesis && !exhibitor.offers.masterThesis) ||
            (query.offers.fullTime && !exhibitor.offers.fullTimeJob) ||
            (query.offers.trainee && !exhibitor.offers.traineeProgram)
          )
            return [];

          return [exhibitor.position, exhibitor];
        })
      )
    );
  }, [query]);

  return (
    <div className="h-80vh flex max-md:flex-col-reverse max-md:items-center md:flex-row md:items-start md:space-x-10 justify-center py-16 pt-32">
      <div className="flex flex-col items-center md:max-w-{250px}">
        <Search t={t} setQuery={setQuery} />
        <ExhibitorExplorer
          t={t}
          exhibitors={exhibitors}
          mapInView={mapInView}
          setMapInView={setMapInView}
          selectedExhibitor={selectedExhibitor}
          setSelectedExhibitor={setSelectedExhibitor}
        />
      </div>
      <Map
        t={t}
        exhibitors={exhibitors}
        mapInView={mapInView}
        setMapInView={setMapInView}
        selectedExhibitor={selectedExhibitor}
        setSelectedExhibitor={setSelectedExhibitor}
      />
    </div>
  ); 
}

export async function getServerSideProps() {
  const exhibitors = await prisma.exhibitor.findMany({
    include: {
      jobOffers: true,
    },
  });

  const exhibitorData = exhibitors.map((exhibitor) => ({
    name: exhibitor.name,
    logoWhite: exhibitor.logoWhite?.toString("base64") || null,
    logoColor: exhibitor.logoColor?.toString("base64") || null,
    description: exhibitor.description,
    package: exhibitor.package,
    jobOfferId: exhibitor.jobOfferId,
    offers: {
      summerJob: exhibitor.jobOffers.summerJob,
      internship: exhibitor.jobOffers.internship,
      partTimeJob: exhibitor.jobOffers.partTimeJob,
      masterThesis: exhibitor.jobOffers.masterThesis,
      fullTimeJob: exhibitor.jobOffers.fullTimeJob,
      traineeProgram: exhibitor.jobOffers.traineeProgram,
    },
    position: exhibitor.mapPosition,
  }));

  return {
    props: {
      exhibitorData,
    },
  };
}
