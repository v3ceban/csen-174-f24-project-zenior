import styles from "@/styles/profile.module.css";
import AccountForm from "@/components/AccountForm/Form";
import Overview from "@/components/Overview";
// import { Checklist } from "@/components/Checklist";
import { user, skill, projects } from "@/lib/server/actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MyTeam() {
  const session = await auth();
  const users = await user.get({ email: session.user.email });
  const allSkills = await skill.get();

  if (!session || !users) {
    redirect("/");
  }

  // check if the user has completed account setup
  const isAccountComplete = !users[0].new;

  return (
    <main className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.formContainer}>
          <AccountForm
            user={users[0]}
            userUpdate={user.update}
            hideInstruction={isAccountComplete}
            skills={allSkills}
          />
        </div>

        {/* isAccountComplete && (
          <div className={styles.progressContainer}>
            <Checklist />
          </div>
        ) */}
      </div>

      {isAccountComplete && (
        <div className={styles.rightContainer}>
          <Overview
            user={users[0]}
            deleteProject={projects.delete}
            saveProject={projects.update}
            skills={allSkills}
          />
        </div>
      )}
    </main>
  );
}
