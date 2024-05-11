import Locale from "@/locales";
import { Dispatch, useState } from "react";
import UploadCV from "./UploadCV";
import { CheckMark } from "../CheckMark";

export default function Info(
    {
        t,
        fname,
        lname,
        email,
        setUserInfo,
        interests,
        setInterests,
    }: {
        t: Locale;
        fname: string;
        lname: string;
        email: string;
        setUserInfo: Dispatch<{
          first_name: string;
          last_name: string;
          kth_email: string;
          email: string;
          cv: string;
          year: number;
        }>;
        interests: {
          summer: boolean;
          partTime: boolean;
          internship: boolean;
          thesis: boolean;
          trainee: boolean;
          fullTime: boolean;
      };
        setInterests: Dispatch<{
                            summer: boolean;
                            partTime: boolean;
                            internship: boolean;
                            thesis: boolean;
                            trainee: boolean;
                            fullTime: boolean;
                        }>;
    }
    
) {
  const [user, setUser] = useState({fname:fname, lname:lname, email:"", year:NaN, cv:""})
  const [saved, setSaved] = useState(false);
  const [cv, setCv] = useState();

  const [summer, setSummer] = useState<boolean>(interests.summer);
  const [partTime, setPartTime] = useState<boolean>(interests.partTime);
  const [internship, setInternship] = useState<boolean>(interests.internship);

  const [thesis, setThesis] = useState<boolean>(interests.thesis);
  const [trainee, setTrainee] = useState<boolean>(interests.trainee);
  const [fullTime, setFullTime] = useState<boolean>(interests.fullTime);

  const job = t.exhibitorSettings.table.row1.section2.jobs;
  const jobs = [{str:job.summer, checked:summer, set:setSummer}, {str:job.partTime, checked:partTime, set:setPartTime}, {str:job.internship, checked:internship, set:setInternship}];
  const other = t.exhibitorSettings.table.row1.section2.other;
  const others = [{str:other.thesis, checked:thesis, set:setThesis}, {str:other.trainee, checked:trainee, set:setTrainee}, {str:other.fullTime, checked:fullTime, set:setFullTime}];

  function saveInfo(){
    if(user.fname && user.lname && user.year){
      setUserInfo({first_name:user.fname, last_name:user.lname, kth_email:email, email:user.email, cv:user.email, year:user.year});
      setInterests({summer:summer, partTime:partTime, internship:internship, thesis:thesis, trainee:trainee, fullTime:fullTime});
    }else{
      setSaved(true);
    }
  }

  function alternative(alternative:{str: string; checked: boolean; set: Dispatch<boolean>;}){
    return <div key={alternative.str} className="flex">
                <p className="text-white mr-[5px]">{alternative.str}</p>  
                <CheckMark name={alternative.str}
                           checked={alternative.checked} 
                           onClick={function func(){alternative.set(!alternative.checked)}} 
                           onChange={function func(){}}/>
            </div>;
}

  function YearChecks(){
    function check(year: number){
      function changeYear(){
        setUser({ ...user, year: year });
      }

      return <div key={year} className="flex ml-[10px]">
              <p className="text-white mr-[5px]">{year}</p>
              <CheckMark name={year.toString()} checked={user.year === year} onClick={changeYear}/>
            </div>
    }
    
    const years = [1,2,3,4,5];

    return <div className="flex">
            {years.map(check)}
           </div>
  }

    return (
        <div className="relative mt-[100px] w-[50%] mb-12 bg-white/20 border-2 border-cerise rounded-xl overflow-hidden">
          <h1 className="text-white text-center text-3xl mt-[10px] mb-[10px]">{t.students.info.header}</h1>
          <table className="mt-[10px] ml-[10px] mr-[10px] mb-[10px]">
            <tbody
              className="text-lg [&>tr>td]:text-left [&>tr>td>label]:font-normal [&>tr>td>label]:text-white
                          [&>tr>td>input]:bg-white/10 [&>tr>td>input]:outline-none [&>tr>td>input]:w-[250px]
                          [&>tr>td>input]:ml-2 [&>tr>td>input]:font-light"
            >
              <tr>
                <td>
                  <label htmlFor="fname">
                    {t.students.info.firstName}:
                  </label>
                </td>
                <td>
                  <input
                    type="text"
                    className="text-white"
                    name="fname"
                    value={user.fname}
                    required={true}
                    onChange={function changeFirstName(evt){setUser({ ...user, fname: evt.target.value })}}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="lname">
                    {t.students.info.lastName}:
                  </label>
                </td>
                <td>
                  <input
                    type="text"
                    className="text-white"
                    name="lname"
                    value={user.lname}
                    required={true}
                    onChange={function changeFirstName(evt){setUser({ ...user, lname: evt.target.value })}}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="year">
                    {t.students.info.year}:
                  </label>
                </td>
                <td>
                  <YearChecks/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="kthEmail">
                    KTH email:
                  </label>
                </td>
                <td>
                  <input
                    className="text-white"
                    type="text"
                    name="kthEmail"
                    value={email}
                    required={false}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="email">
                    {t.students.info.email}:
                  </label>
                </td>
                <td>
                  <input
                    type="text"
                    className="text-white"
                    name="email"
                    value={user.email}
                    required={false}
                    onChange={function changeFirstName(evt){setUser({ ...user, email: evt.target.value })}}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="role">
                    {t.students.info.cv}:
                  </label>
                </td>
                <td>
                  <UploadCV/>
                </td>
              </tr>
            </tbody>
          </table>

          <h1 className="text-white text-center text-3xl mt-[10px] mb-[10px]">{t.students.interests.header}</h1>
          <div className="flex justify-between mt-[10px] ml-[40px] mr-[40px]">
              {jobs.map(alternative)}
          </div>
          <div className="flex justify-between mt-[10px] mb-[10px] ml-[40px] mr-[40px]">
            {others.map(alternative)} 
          </div>
            

          <div className="flex justify-center">
            <button onClick={saveInfo} className="mt-4 mb-4 mx-2 flex">
              <a className="block hover:scale-105 transition-transform bg-cerise rounded-full text-white text-base font-medium px-6 py-2 max-lg:mx-auto w-max">
                {t.students.info.save}
              </a>
            </button>
            <p className="text-white self-center">
              {saved? (!user.fname ? t.students.info.addFirstName : !user.lname ?  t. students.info.addLastName : !user.year ? t.students.info.addYear : "") : ""}
            </p>
          </div>
          
        </div>
      );
}