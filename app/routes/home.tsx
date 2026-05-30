import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "Smart way to analyze your resume!" },
  ];
}

export default function Home() {

    const {auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {

        if(!auth.isAuthenticated) navigate('/auth?next=/');

    }, [auth.isAuthenticated]);



  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className="main-section">
      <div className="page-heading">
        <h1>Track your Applications and Resume Ratings</h1>
        <h2>Get insights on how your resume is performing and where you can improve.</h2>
      </div>

      {resumes.length > 0 && (
      <div className="resume-section">
  {resumes.map((resume) => (
    <ResumeCard
      key={resume.id}
      resume={resume}
    />
  ))}
</div>
    )}
    </section>
  </main>
}
