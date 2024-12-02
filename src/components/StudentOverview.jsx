"use client";

import styles from "@/styles/StudentOverview.module.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";
import Link from "next/link";
import { useToast, toast } from "@/hooks/use-toast"; 

/* UI component for group request: need to at attach to database */
const GroupRequest = ({ grouprequests, handleAcceptToast }) => {
  return (
    <div className={styles.groupRequestContainer}>
      <h2 className="text-xl font-semibold mb-4">Group Request</h2>
      {grouprequests.length > 0 ? (
        <>
          <p className="mb-4">You have asked to join the following group(s):</p>
          {grouprequests.map((request, index) => (
            <div
              key={index}
              className={
                request.status === "approved"
                  ? styles.groupBoxApproved
                  : request.status === "pending"
                    ? styles.groupBoxPending
                    : styles.groupBoxDenied
              }
            >
              <div className="flex justify-between items-center">
                <span>{request.name}</span>
                <span
                  className={`font-bold ${request.status === "approved"
                      ? "text-green-600"
                      : request.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                >
                  {request.status === "approved"
                    ? "approved ✓"
                    : request.status === "pending"
                      ? "pending ⌛"
                      : "denied ❌ "}
                </span>
              </div>
              <div className="flex justify-end gap-4 mt-2">
                {request.status === "approved" && (
                  <>
                    <Button variant="custom" className="text-white" onClick={handleAcceptToast}>
                      Accept Request
                    </Button>
                    <Button variant="custom" 
                      className="text-white" 
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to reject?", 
                          )
                        ); 
                      }}>
                      Reject Request
                    </Button>
                  </>
                )}
                {request.status === "pending" && (
                  <Button variant="custom" 
                    className="text-white"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to withdraw?",
                        )
                      ); 
                    }}>
                    Withdraw Request
                  </Button>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-center bold text-black-700">No Requests</p>
      )}
    </div>
  );
};

GroupRequest.propTypes = {
  grouprequests: PropTypes.array.isRequired,
  handleAcceptToast: PropTypes.func.isRequired
};

// UI component for team member requests
const TeamRequest = ({ teamrequests, handleAccept, handleReject }) => {
  const { toast } = useToast(); 
  return (
    <div className={styles.teamRequestContainer}>
      <h2 className="text-xl font-semibold mb-4">Team Member Requests</h2>
      {teamrequests.length > 0 ? (
        teamrequests.map((request, index) => (
          <div key={index} className={styles.requestCard}>
            <div className="flex items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src={"/images/default-avatar.png"} alt="Profile" />
                <AvatarFallback>Profile Picture</AvatarFallback>
              </Avatar>
              <div className={styles.requestInfo}>
                <h3 className="text-lg font-semibold text-red-700">
                  {request.name}
                </h3>
                <p className="text-black-600">{request.major.join(", ")}</p>
              </div>
              <div className="gap-5">
                <p className="text-white">....... </p>{" "}
                {/* some other way to get spacing must happen */}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded"
                >
                  ✓
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded"
                >
                  ✗
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-black-500">No team member requests</p>
      )}
    </div>
  );
};

TeamRequest.propTypes = {
  teamrequests: PropTypes.array.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
};

// project dashboard fields
const StudentOverview = ({ user, deleteProject, saveProject, skills }) => {
  const [projects, setProjects] = useState(() => {
    if (user.student) {
      return user.student.projects.map((project) => project.project);
    }

    if (user.faculty) {
      return [
        ...user.faculty.advisedProjects,
        ...user.faculty.coAdvisedProjects,
      ];
    }
  });

  const [teamRequests] = useState([
    { id: 1, name: "name1", major: ["COEN"] }, // connect to database; placeholder for now
  ]);

  const [groupRequests] = useState([
    // insert data for group requests here aka database connection
    { name: "project 1", status: "approved" }, // placeholder!
    { name: "project 2", status: "pending" }, // placeholder
    { name: "project 3", status: "denied" },
  ]);

  // handle accept/reject
  const handleAccept = (id) => {
    console.log("Accepted request ID:", id);
    toast({
      title: "Member Accepted", 
      description: "You have succesfully added them to your team!", 
      variant: "default", 
    })
    // routing here? aka logic
  };

  const handleReject = (id) => {
    console.log("Rejection request ID:", id);
    toast({
      title: "Member Rejected", 
      description: "You have succesfully rejected them from your team.", 
      variant: "default", 
    })
    // if they reject, it should disappear from the view
    // routing here? aka logic
  };

  const handleAcceptToast = (id) => {
    console.log("Accepted request ID:", id); 
    toast({
      title: "Accepted Request", 
      description: "You have successfully been added to this project!", 
      variant: "default", 
    })
  };

  const handleInputChange = (e, project) => {
    const { name, value } = e.target;
    const updatedProjects = projects.map((proj) =>
      proj.id === project.id ? { ...proj, [name]: value } : proj,
    );
    setProjects(updatedProjects);
  };

  const handleCheckboxChange = (e, project) => {
    const { name, checked } = e.target;
    const updatedProjects = projects.map((proj) =>
      proj.id === project.id ? { ...proj, [name]: checked } : proj,
    );
    setProjects(updatedProjects);
  };

  return (
    <div className={styles.container}>
      <GroupRequest 
        grouprequests={groupRequests}
        handleAcceptToast={handleAcceptToast}
       /> {/*database!*/}
      <TeamRequest
        teamrequests={teamRequests}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
      <div className={styles.formCard}>
        <div className="p-6 text-center">
          {projects.length < 1 ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                You are not a project member yet.
              </h2>
              <div className="flex justify-around mb-8">
                <div className="flex flex-col items-center">
                  <p className="mb-2">Have a project idea?</p>
                  <Button variant="custom" asChild>
                    <Link href="/proposal-form">Post a Project Proposal</Link>
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-4">No project ideas yet? No problem!</p>
                <div className={styles.buttonGrid}>
                  <Button variant="custom" asChild>
                    <Link href="/proposals">
                      Explore Student Project Proposals
                    </Link>
                  </Button>
                  <Button variant="custom" asChild>
                    <Link href="/archive">Explore Past Projects</Link>
                  </Button>
                  <Button variant="custom" asChild>
                    <Link href="/advisor-directory">
                      Explore Faculty Advisor Project Proposals
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id}>
                <h2 className="text-3xl font-bold mb-4">Project Title:</h2>
                <Input
                  name="title"
                  placeholder="Title Here"
                  value={project.title}
                  onChange={(e) => handleInputChange(e, project)}
                  className="mb-4 p-2 border border-gray-300 rounded"
                />

                <h2 className="text-3xl font-bold mb-4">
                  Project Description:
                </h2>
                <textarea
                  name="description"
                  placeholder="Enter project description here..."
                  value={project.description}
                  onChange={(e) => handleInputChange(e, project)}
                  className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
                />

                <h2 className="text-3xl font-bold mb-4">Team Members:</h2>
                <div className="mb-4">
                  {project.members.length ? (
                    project.members.map((member) => (
                      <span key={member.student.id} className="text-lg mr-2">
                        {member.student.firstName} {member.student.lastName}
                      </span>
                    ))
                  ) : (
                    <span className="text-lg">No team members yet</span>
                  )}
                </div>

                <div className="flex items-center mb-4">
                  <label className="text-lg mr-4">
                    Do you want additional team member(s)?
                    <input
                      className="ml-2"
                      type="checkbox"
                      name="groupOpen"
                      defaultChecked={project.groupOpen === true}
                      onChange={(e) => handleCheckboxChange(e, project)}
                    />
                  </label>
                </div>
                <Skills
                  data={project.skills}
                  key={project.id}
                  setProjects={setProjects}
                  project={project}
                  skillList={skills}
                />
                <h2 className="text-3xl font-bold mb-4">Advisor(s):</h2>
                <div className="flex items-center mb-4">
                  <span className="flex items-center text-lg">
                    {project.advisor
                      ? `${project.advisor.firstName} ${project.advisor.lastName}`
                      : "No Advisor Yet"}
                  </span>
                  {!project.advisor && (
                    <Button variant="custom" className="ml-4" asChild>
                      <Link href="/advisor-directory">Find an Advisor</Link>
                    </Button>
                  )}
                </div>
                <div className="flex justify-evenly border-b-gray-800 pt-8 pb-4 mb-6 border-b-2">
                  <Button
                    variant="custom"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${project.title}?`,
                        )
                      ) {
                        deleteProject(project.id, window.location.pathname);
                        setProjects(
                          projects.filter((proj) => proj.id !== project.id),
                        );
                      }
                    }}
                  >
                    Delete Project
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      saveProject(
                        project.id,
                        project,
                        window.location.pathname,
                      );
                    }}
                    variant="custom"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

StudentOverview.propTypes = {
  user: PropTypes.object.isRequired,
  deleteProject: PropTypes.func.isRequired,
  saveProject: PropTypes.func.isRequired,
  skills: PropTypes.array.isRequired,
};

export default StudentOverview;

const Skills = ({ data = [], project, setProjects, skillList = [] }) => {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(data.map((skill) => skill.skill));

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value); // fix to update skillInput state
  };

  // add the skill to the list when "Enter" is pressed
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault(); // prevent form submission
      const newSkill = { id: skills.length, name: skillInput };
      setSkills([...skills, newSkill]);
      setSkillInput(""); // clear the input after adding
      const updatedProject = {
        ...project,
        skills: [...skills, newSkill],
      };
      setProjects((projects) =>
        projects.map((proj) =>
          proj.id === project.id ? updatedProject : proj,
        ),
      );
    }
  };

  // remove a skill with the 'x'
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    const updatedProject = {
      ...project,
      skills: skills.filter((skill) => skill !== skillToRemove),
    };
    setProjects((projects) =>
      projects.map((proj) => (proj.id === project.id ? updatedProject : proj)),
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-lg">
        What skill sets should the additional team member(s) have?
      </label>
      <Input
        name="skills"
        placeholder="Type desired skills for the project and press Enter"
        value={skillInput}
        onChange={handleSkillInputChange}
        onKeyDown={handleSkillKeyDown}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        list="skills"
      />
      <datalist id="skills">
        {skillList.map((skill) => (
          <option key={skill.id} value={skill.name} />
        ))}
      </datalist>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-red-500 text-white p-1 rounded flex items-center"
          >
            {skill.name}
            <span
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 cursor-pointer"
            >
              x
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

Skills.propTypes = {
  data: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  setProjects: PropTypes.func.isRequired,
  skillList: PropTypes.array.isRequired,
};
