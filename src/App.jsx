
import { useMemo, useState } from "react";
import {
  Search, Plus, LayoutDashboard, Compass, CalendarDays, BookOpen,
  Users, Star, Clock3, MapPin, ArrowUpRight, X, ChevronDown,
  GraduationCap, Code2, Palette, Camera, Megaphone, Briefcase,
  Sparkles, Menu, CheckCircle2, Video, Filter, MessageCircle,
  TrendingUp, Award, Bookmark, SlidersHorizontal
} from "lucide-react";
import "./App.css";

const initialMentors = [
  { id: 1, name: "Aarav Sharma", initials: "AS", role: "Frontend Developer", college: "Computer Science · Year 3", skills: ["React", "JavaScript", "CSS"], rating: 4.9, reviews: 28, sessions: 42, price: "Free", color: "mint", about: "I enjoy helping beginners understand frontend development by building real projects. Happy to teach React fundamentals, component design and JavaScript.", availability: "Mon, Wed, Fri" },
  { id: 2, name: "Riya Kapoor", initials: "RK", role: "UI/UX Designer", college: "Design · Year 3", skills: ["Figma", "UI/UX", "Prototyping"], rating: 4.8, reviews: 21, sessions: 35, price: "Free", color: "pink", about: "Design enthusiast who loves turning ideas into clean, useful interfaces. I can help with Figma, design systems and portfolio reviews.", availability: "Tue, Thu" },
  { id: 3, name: "Kabir Mehta", initials: "KM", role: "Competitive Programmer", college: "Computer Science · Year 2", skills: ["C++", "DSA", "Algorithms"], rating: 4.9, reviews: 36, sessions: 51, price: "Free", color: "blue", about: "I help students build problem-solving intuition, get comfortable with DSA and start their competitive programming journey.", availability: "Weekends" },
  { id: 4, name: "Meera Iyer", initials: "MI", role: "Python & ML Student", college: "Computer Science · Year 4", skills: ["Python", "Machine Learning", "Pandas"], rating: 4.7, reviews: 17, sessions: 29, price: "Free", color: "purple", about: "Passionate about Python and practical machine learning. Let's learn through small experiments and hands-on projects.", availability: "Mon, Thu, Sat" },
  { id: 5, name: "Dev Malhotra", initials: "DM", role: "Full Stack Developer", college: "Computer Science · Year 3", skills: ["Node.js", "MongoDB", "Express"], rating: 4.8, reviews: 19, sessions: 31, price: "Free", color: "orange", about: "I enjoy teaching backend fundamentals and helping students understand how full-stack applications work behind the scenes.", availability: "Wed, Fri" },
  { id: 6, name: "Ishita Verma", initials: "IV", role: "Content Creator", college: "Media Studies · Year 2", skills: ["Video Editing", "Photography", "Canva"], rating: 4.9, reviews: 24, sessions: 38, price: "Free", color: "yellow", about: "I can help you get started with content creation, visual storytelling, editing workflows and building a creative portfolio.", availability: "Tue, Sat" },
];

const skillCategories = [
  { name: "Web Development", icon: Code2, count: 24 },
  { name: "Design & Creativity", icon: Palette, count: 18 },
  { name: "Programming & DSA", icon: GraduationCap, count: 32 },
  { name: "Business & Marketing", icon: Megaphone, count: 12 },
  { name: "Photography & Media", icon: Camera, count: 15 },
  { name: "Career & Professional", icon: Briefcase, count: 9 },
];

const initialSessions = [
  { id: 1, mentor: "Aarav Sharma", initials: "AS", skill: "React Fundamentals", date: "2026-11-13", time: "5:00 PM", status: "Confirmed", color: "mint", mode: "Online" },
  { id: 2, mentor: "Riya Kapoor", initials: "RK", skill: "Figma for Beginners", date: "2026-11-15", time: "3:30 PM", status: "Pending", color: "pink", mode: "Online" },
];

const pageItems = [
  { id: "Overview", icon: LayoutDashboard },
  { id: "Explore", icon: Compass },
  { id: "My Sessions", icon: CalendarDays },
  { id: "My Skills", icon: BookOpen },
];

const today = () => new Date().toISOString().slice(0, 10);

function App() {
  const [page, setPage] = useState("Overview");
  const [mode, setMode] = useState("Learn");
  const [mentors, setMentors] = useState(initialMentors);
  const [sessions, setSessions] = useState(initialSessions);
  const [mySkills, setMySkills] = useState([]);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All skills");
  const [modal, setModal] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [bookForm, setBookForm] = useState({ date: "", time: "5:00 PM", topic: "" });
  const [skillForm, setSkillForm] = useState({ title: "", category: "Web Development", level: "Beginner", description: "", availability: "Weekends" });

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const allSkills = [...new Set(mentors.flatMap((mentor) => mentor.skills))].sort();

  const filteredMentors = useMemo(() => mentors.filter((mentor) => {
    const query = search.toLowerCase();
    const matchesSearch = `${mentor.name} ${mentor.role} ${mentor.skills.join(" ")} ${mentor.about}`.toLowerCase().includes(query);
    const matchesSkill = skillFilter === "All skills" || mentor.skills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  }), [mentors, search, skillFilter]);

  const openBooking = (mentor) => {
    setSelectedMentor(mentor);
    setBookForm({ date: "", time: "5:00 PM", topic: "" });
    setModal("booking");
  };

  const bookSession = (e) => {
    e.preventDefault();
    if (!bookForm.date || !bookForm.topic.trim()) return;
    const newSession = {
      id: Date.now(),
      mentor: selectedMentor.name,
      initials: selectedMentor.initials,
      skill: bookForm.topic,
      date: bookForm.date,
      time: bookForm.time,
      status: "Pending",
      color: selectedMentor.color,
      mode: "Online",
    };
    setSessions((prev) => [...prev, newSession]);
    setModal(null);
    setPage("My Sessions");
    notify("Session request sent successfully!");
  };

  const publishSkill = (e) => {
    e.preventDefault();
    if (!skillForm.title.trim() || !skillForm.description.trim()) return;
    const newSkill = { ...skillForm, id: Date.now() };
    setMySkills((prev) => [...prev, newSkill]);
    setSkillForm({ title: "", category: "Web Development", level: "Beginner", description: "", availability: "Weekends" });
    setModal(null);
    notify("Your skill listing is now published!");
  };

  const cancelSession = (id) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
    notify("Session removed from your schedule.");
  };

  const Avatar = ({ person, size = "normal" }) => (
    <div className={`avatar avatar-${person.color || "mint"} avatar-${size}`}>{person.initials}</div>
  );

  const MentorCard = ({ mentor }) => (
    <article className="mentor-card">
      <div className="mentor-card-top">
        <Avatar person={mentor} size="large" />
        <button className="bookmark-button" onClick={() => notify("Mentor saved to your shortlist!")} aria-label="Save mentor"><Bookmark size={17} /></button>
      </div>
      <div className="mentor-name-row"><h3>{mentor.name}</h3><span className="rating"><Star size={13} fill="currentColor" /> {mentor.rating}</span></div>
      <p className="mentor-role">{mentor.role}</p>
      <p className="mentor-college">{mentor.college}</p>
      <div className="skill-tags">{mentor.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
      <div className="mentor-stats"><span><Users size={14} /> {mentor.sessions} sessions</span><span><MessageCircle size={14} /> {mentor.reviews} reviews</span></div>
      <div className="mentor-card-footer"><span className="free-label">FREE SESSION</span><button onClick={() => { setSelectedMentor(mentor); setModal("profile"); }}>View profile <ArrowUpRight size={15} /></button></div>
    </article>
  );

  const SessionCard = ({ session }) => (
    <div className="session-card">
      <Avatar person={session} />
      <div className="session-info"><strong>{session.skill}</strong><span>with {session.mentor}</span><small><CalendarDays size={13} /> {new Date(`${session.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {session.time}</small></div>
      <div className="session-right"><span className={`session-status ${session.status.toLowerCase()}`}>{session.status}</span><button className="icon-button small" onClick={() => cancelSession(session.id)} title="Remove session"><X size={15} /></button></div>
    </div>
  );

  return (
    <div className="skill-shell">
      <aside className={`skill-sidebar ${mobileNav ? "open" : ""}`}>
        <div className="skill-brand">
          <div className="skill-brand-icon"><GraduationCap size={23} /></div>
          <div><strong>skill<span>bridge.</span></strong><small>Learn together. Grow together.</small></div>
          <button className="icon-button mobile-close" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>
        <div className="nav-caption">YOUR SPACE</div>
        <nav className="skill-nav">
          {pageItems.map(({ id, icon: Icon }) => (
            <button key={id} className={`skill-nav-link ${page === id ? "active" : ""}`} onClick={() => { setPage(id); setMobileNav(false); }}>
              <Icon size={19} /><span>{id}</span>
              {id === "My Sessions" && sessions.length > 0 && <i>{sessions.length}</i>}
            </button>
          ))}
        </nav>
        <div className="sidebar-promo">
          <div className="promo-icon"><Sparkles size={19} /></div>
          <strong>Everyone has something to teach.</strong>
          <p>Share what you know. Help someone take their next step.</p>
          <button onClick={() => setModal("skill")}>Share a skill <ArrowUpRight size={14} /></button>
        </div>
        <div className="sidebar-profile"><div className="avatar avatar-mint">Y</div><div><strong>Your profile</strong><small>Student member</small></div><ChevronDown size={16} /></div>
      </aside>

      <main className="skill-main">
        <header className="skill-topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
          <div className="top-crumb">SkillBridge <span>/</span> <strong>{page}</strong></div>
          <div className="top-actions">
            <div className="mode-switch"><button className={mode === "Learn" ? "selected" : ""} onClick={() => setMode("Learn")}>Learn</button><button className={mode === "Teach" ? "selected" : ""} onClick={() => setMode("Teach")}>Teach</button></div>
            <button className="icon-button" onClick={() => notify("You're all caught up!")}><MessageCircle size={18} /></button>
            <div className="top-user">Y</div>
          </div>
        </header>

        <div className="skill-content">
          {page === "Overview" && (
            <>
              <section className="hero-section">
                <div className="hero-copy">
                  <div className="hero-eyebrow"><Sparkles size={14} /> THE POWER OF PEER LEARNING</div>
                  <h1>Learn from peers.<br /><span>Teach what you know.</span></h1>
                  <p>Great things happen when students learn from each other. Find your people, exchange skills, and grow together.</p>
                  <div className="hero-buttons"><button className="btn-primary" onClick={() => { setPage("Explore"); setMode("Learn"); }}><Compass size={17} /> Explore mentors</button><button className="btn-ghost" onClick={() => setModal("skill")}><Plus size={17} /> Offer a skill</button></div>
                </div>
                <div className="hero-art">
                  <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
                  <div className="hero-center"><GraduationCap size={49} /></div>
                  <div className="float-card float-one"><div className="float-avatar fa-one">A</div><div><strong>Learn React</strong><small>with Aarav</small></div><CheckCircle2 size={16} /></div>
                  <div className="float-card float-two"><div className="float-avatar fa-two">R</div><div><strong>Design better</strong><small>with Riya</small></div><Star size={15} fill="currentColor" /></div>
                  <div className="hero-sparkle"><Sparkles size={19} /></div>
                </div>
              </section>

              <section className="overview-stats">
                <div><span className="overview-stat-icon mint-bg"><Users size={19} /></span><div><strong>{mentors.length + 124}</strong><small>Student mentors</small></div></div>
                <div><span className="overview-stat-icon purple-bg"><BookOpen size={19} /></span><div><strong>48</strong><small>Skills available</small></div></div>
                <div><span className="overview-stat-icon orange-bg"><Video size={19} /></span><div><strong>320+</strong><small>Sessions completed</small></div></div>
                <div><span className="overview-stat-icon blue-bg"><Star size={19} /></span><div><strong>4.9/5</strong><small>Average rating</small></div></div>
              </section>

              <section className="section-block">
                <div className="section-title"><div><h2>Explore by category</h2><p>Find the skill you want to pick up next.</p></div><button className="link-button" onClick={() => setPage("Explore")}>Browse all <ArrowUpRight size={15} /></button></div>
                <div className="category-grid">
                  {skillCategories.map(({ name, icon: Icon, count }, i) => (
                    <button className={`category-card category-${i}`} key={name} onClick={() => { setSearch(""); setSkillFilter("All skills"); setPage("Explore"); }}>
                      <span><Icon size={21} /></span><strong>{name}</strong><small>{count} mentors <ArrowUpRight size={13} /></small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="section-block">
                <div className="section-title"><div><h2>People you can learn from</h2><p>Meet students who are ready to share what they know.</p></div><button className="link-button" onClick={() => setPage("Explore")}>See all mentors <ArrowUpRight size={15} /></button></div>
                <div className="mentor-grid">{mentors.slice(0, 3).map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)}</div>
              </section>

              <section className="section-block upcoming-block">
                <div className="section-title"><div><h2>Your upcoming sessions</h2><p>Stay on top of your learning plans.</p></div><button className="link-button" onClick={() => setPage("My Sessions")}>View schedule <ArrowUpRight size={15} /></button></div>
                {sessions.length ? <div className="session-list">{sessions.slice(0, 2).map((session) => <SessionCard key={session.id} session={session} />)}</div> : <div className="empty-message">No sessions booked yet. Explore mentors to get started!</div>}
              </section>
            </>
          )}

          {page === "Explore" && (
            <>
              <section className="page-heading">
                <div><div className="hero-eyebrow"><Compass size={14} /> DISCOVER YOUR NEXT SKILL</div><h1>Find your <span>mentor.</span></h1><p>Learn directly from students who've been where you are.</p></div>
                <button className="btn-ghost" onClick={() => setModal("skill")}><Plus size={17} /> Offer a skill</button>
              </section>
              <div className="explore-toolbar">
                <div className="explore-search"><Search size={18} /><input placeholder="Search skills, mentors, topics..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                <div className="skill-filter"><SlidersHorizontal size={16} /><select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}><option>All skills</option>{allSkills.map((skill) => <option key={skill}>{skill}</option>)}</select></div>
              </div>
              <div className="explore-results"><span><strong>{filteredMentors.length}</strong> mentors available</span><span>Peer-led · Student community</span></div>
              {filteredMentors.length ? <div className="mentor-grid explore-grid">{filteredMentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)}</div> : <div className="empty-message">No mentors match that search. Try another skill or keyword.</div>}
            </>
          )}

          {page === "My Sessions" && (
            <>
              <section className="page-heading"><div><div className="hero-eyebrow"><CalendarDays size={14} /> YOUR LEARNING CALENDAR</div><h1>My <span>sessions.</span></h1><p>All your peer-learning sessions, in one place.</p></div><button className="btn-primary" onClick={() => setPage("Explore")}><Plus size={17} /> Find a mentor</button></section>
              <div className="session-summary">
                <div><span>All sessions</span><strong>{sessions.length}</strong></div>
                <div><span>Confirmed</span><strong>{sessions.filter((s) => s.status === "Confirmed").length}</strong></div>
                <div><span>Awaiting response</span><strong>{sessions.filter((s) => s.status === "Pending").length}</strong></div>
              </div>
              <div className="section-title schedule-title"><div><h2>Your schedule</h2><p>Manage your upcoming learning sessions.</p></div></div>
              {sessions.length ? <div className="session-list">{sessions.map((session) => <SessionCard key={session.id} session={session} />)}</div> : <div className="empty-message">Your calendar is clear. Book a session to start learning!</div>}
            </>
          )}

          {page === "My Skills" && (
            <>
              <section className="page-heading"><div><div className="hero-eyebrow"><BookOpen size={14} /> SHARE YOUR KNOWLEDGE</div><h1>My <span>skills.</span></h1><p>Turn what you know into someone else's next breakthrough.</p></div><button className="btn-primary" onClick={() => setModal("skill")}><Plus size={17} /> Add a skill</button></section>
              <div className="skill-promo-banner"><div className="promo-icon"><Sparkles size={21} /></div><div><strong>What can you teach someone today?</strong><p>It doesn't have to be advanced. Even a beginner can help another beginner.</p></div><button onClick={() => setModal("skill")}>Create listing <ArrowUpRight size={15} /></button></div>
              <div className="section-title schedule-title"><div><h2>Your listings</h2><p>Skills you've made available to the community.</p></div></div>
              {mySkills.length ? <div className="my-skill-grid">{mySkills.map((skill) => <article className="my-skill-card" key={skill.id}><div className="my-skill-icon"><GraduationCap size={21} /></div><span className="listing-level">{skill.level}</span><h3>{skill.title}</h3><p>{skill.description}</p><div className="my-skill-meta"><span>{skill.category}</span><span><Clock3 size={13} /> {skill.availability}</span></div><span className="listing-live"><i /> Published</span></article>)}</div> : <div className="empty-message">You haven't listed any skills yet. Share something you know!</div>}
            </>
          )}

          <footer className="skill-footer"><span>skillbridge<span className="footer-dot">.</span> Learn together. Grow together.</span><span>Made for student communities <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>

      {modal === "profile" && selectedMentor && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="skill-modal">
            <div className="modal-top"><span className="modal-label">MENTOR PROFILE</span><button className="icon-button" onClick={() => setModal(null)}><X size={19} /></button></div>
            <div className="profile-hero"><Avatar person={selectedMentor} size="profile" /><div><h2>{selectedMentor.name}</h2><p>{selectedMentor.role}</p><div className="profile-rating"><Star size={14} fill="currentColor" /> {selectedMentor.rating} <span>({selectedMentor.reviews} reviews)</span></div></div></div>
            <p className="profile-college">{selectedMentor.college}</p>
            <h3 className="modal-section-label">ABOUT</h3><p className="profile-about">{selectedMentor.about}</p>
            <h3 className="modal-section-label">SKILLS THEY CAN TEACH</h3><div className="skill-tags profile-tags">{selectedMentor.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            <div className="availability-box"><Clock3 size={16} /><div><strong>Availability</strong><small>{selectedMentor.availability}</small></div><span>Free</span></div>
            <button className="btn-primary modal-submit" onClick={() => openBooking(selectedMentor)}><CalendarDays size={17} /> Request a session</button>
          </div>
        </div>
      )}

      {modal === "booking" && selectedMentor && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="skill-modal">
            <div className="modal-top"><div><span className="modal-label">SESSION REQUEST</span><h2>Book a learning session</h2><p>Request a session with {selectedMentor.name}.</p></div><button className="icon-button" onClick={() => setModal(null)}><X size={19} /></button></div>
            <form className="skill-form" onSubmit={bookSession}>
              <label>What would you like to learn?</label><input required placeholder="e.g. React hooks and state" value={bookForm.topic} onChange={(e) => setBookForm({ ...bookForm, topic: e.target.value })} />
              <label>Preferred date</label><input type="date" required min={today()} value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
              <label>Preferred time</label><select value={bookForm.time} onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}>{["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"].map((time) => <option key={time}>{time}</option>)}</select>
              <div className="booking-note"><Video size={16} /><span>Session format: Online · 1 hour (demo)</span></div>
              <button className="btn-primary modal-submit" type="submit"><CheckCircle2 size={17} /> Send session request</button>
            </form>
          </div>
        </div>
      )}

      {modal === "skill" && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="skill-modal">
            <div className="modal-top"><div><span className="modal-label">COMMUNITY CONTRIBUTION</span><h2>Share your skills</h2><p>Help another student learn something new.</p></div><button className="icon-button" onClick={() => setModal(null)}><X size={19} /></button></div>
            <form className="skill-form" onSubmit={publishSkill}>
              <label>What can you teach?</label><input required placeholder="e.g. Intro to JavaScript" value={skillForm.title} onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })} />
              <label>Category</label><select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>{["Web Development", "Design & Creativity", "Programming & DSA", "Business & Marketing", "Photography & Media", "Career & Professional", "Other"].map((c) => <option key={c}>{c}</option>)}</select>
              <label>Teaching level</label><select value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}>{["Beginner", "Intermediate", "Advanced", "All levels"].map((l) => <option key={l}>{l}</option>)}</select>
              <label>Description</label><textarea rows="3" required placeholder="Tell students what they'll learn from you..." value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} />
              <label>Availability</label><select value={skillForm.availability} onChange={(e) => setSkillForm({ ...skillForm, availability: e.target.value })}>{["Weekdays", "Weekends", "Evenings", "Flexible"].map((a) => <option key={a}>{a}</option>)}</select>
              <div className="booking-note"><Sparkles size={16} /><span>Your listing will be visible to the SkillBridge community.</span></div>
              <button className="btn-primary modal-submit" type="submit"><Plus size={17} /> Publish my skill</button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="skill-toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

export default App;
