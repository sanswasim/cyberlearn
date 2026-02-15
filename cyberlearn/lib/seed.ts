/**
 * Seed script: run with `npm run seed`
 * Requires Firebase env vars and will write to Firestore.
 * Loads .env from project root when run via npm run seed.
 */
import "dotenv/config";
import { getApps, initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { TaskRecord } from "./types";

function initFirebase() {
  if (getApps().length > 0) return getFirestore();
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Set GOOGLE_CLOUD_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
  }
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey } as ServiceAccount),
  });
  return getFirestore();
}

const TASKS: Omit<TaskRecord, "createdAt">[] = [
  {
    title: "Create a new user and verify login",
    platform: "GoogleWorkspace",
    tier: 1,
    difficulty: "Very Easy",
    description:
      "In Google Admin Console, create a new user account and confirm the user can sign in to Google Workspace.",
    objective: "Create a user in Admin Console and confirm the user can sign in.",
    hint1: "Go to Directory > Users. Use 'Add new user' to create the account.",
    hint2: "Set a secure password and note it. After creation, verification means signing in as that user (or using the 'Send sign-in instructions' option).",
    hint3: "Rollback: In Admin Console you can suspend or delete the user. Document that you would suspend the user if this was a mistake.",
    rubric:
      "Must mention user creation in Admin Console, verification (e.g. sign-in test or send sign-in instructions), and rollback (suspend or delete user).",
  },
  {
    title: "Create a group and restrict posting",
    platform: "GoogleWorkspace",
    tier: 2,
    difficulty: "Medium",
    description:
      "Create a Google Group for the Finance team and configure it so only members can post (no external or all-org posting).",
    objective: "Create group for Finance and allow only members to post.",
    hint1: "Use Directory > Groups to create a new group. Choose a name and add at least one member.",
    hint2: "Group settings include 'Who can post' and 'Who can view conversations'. Set posting to members only.",
    hint3: "Verify by sending a test email to the group from a member and from a non-member. Rollback: change settings or delete the group.",
    rubric:
      "Must mention group creation, posting permissions set to members only, verification (e.g. test email as member vs non-member), and rollback (revert settings or delete group).",
  },
  {
    title: "Configure SSO for a custom app (OAuth)",
    platform: "GoogleWorkspace",
    tier: 2,
    difficulty: "Hard",
    description:
      "Add a custom OAuth 2.0 application in Admin Console and configure SSO so users can sign in with their Google accounts.",
    objective: "Configure a custom OAuth app for SSO in Google Admin Console.",
    hint1: "Go to Security > Set up single sign-on (SSO). Or use Apps > Web and mobile apps to add an app.",
    hint2: "You will need the application's client ID and possibly client secret. Configure authorized redirect URIs.",
    hint3: "Verify by attempting sign-in from the app. Rollback: disable the app or remove it from the organization.",
    rubric:
      "Must mention adding/configuring the OAuth app, client ID/redirect URIs, verification of sign-in, and rollback (disable or remove app).",
  },
  {
    title: "Troubleshoot: User cannot access Drive after group change",
    platform: "GoogleWorkspace",
    tier: 3,
    difficulty: "Hard",
    description:
      "A user was moved from 'Sales' to 'Finance' group. They can sign in but no longer see a shared Drive. Diagnose and document the fix.",
    objective: "Diagnose why shared Drive access was lost after group change and document resolution steps.",
    hint1: "Shared Drive membership is often tied to groups. Check whether the Drive is shared with the group or with individuals.",
    hint2: "Compare the user's current group membership with the shared Drive's membership. Add the user (or their new group) to the Drive if needed.",
    hint3: "Rollback: revert group membership or re-add to the Drive. Document least-privilege approach.",
    rubric:
      "Must mention checking shared Drive membership vs user/group, identifying missing group or user on the Drive, verification (user can see Drive), and rollback plan.",
  },
  {
    title: "Create group and assign app",
    platform: "Okta",
    tier: 1,
    difficulty: "Easy",
    description:
      "In Okta Admin, create a group, add a user to it, assign an OIDC application to the group, and verify the user can log in to the app.",
    objective: "Create a group, add user, assign an OIDC app, verify login.",
    hint1: "Use Directory > Groups to create a group, then add users. Applications > Applications to find your OIDC app.",
    hint2: "Assign the app to the group (Assign > Assign to Groups). The user in the group will get access.",
    hint3: "Verify by signing in to the app as that user. Rollback: remove the app assignment from the group or remove the user from the group.",
    rubric:
      "Must mention group creation, user added to group, app assigned to group, verification (login to app), and rollback (remove assignment or user from group).",
  },
  {
    title: "Enforce MFA for a group",
    platform: "Okta",
    tier: 2,
    difficulty: "Medium",
    description:
      "Require MFA for the Finance group only. Test with a user in that group to ensure MFA is prompted.",
    objective: "Require MFA for Finance group only, test with user.",
    hint1: "Security > Authentication Policies (or Sign-On Policies). Create or edit a policy that requires a factor (e.g. Okta Verify).",
    hint2: "Scope the policy to the Finance group so only those users get the MFA requirement.",
    hint3: "Test by signing in as a Finance user. Rollback: change policy to optional or exclude group to avoid lockout; document the rollback clearly.",
    rubric:
      "Must mention policy scope to Finance group, MFA requirement, verification (test sign-in), and rollback plan to avoid lockout.",
  },
  {
    title: "Add a custom OIDC app integration",
    platform: "Okta",
    tier: 2,
    difficulty: "Medium",
    description:
      "Create a new OIDC web application integration in Okta, set redirect URIs and scopes, and assign it to a group.",
    objective: "Create OIDC app integration, configure redirect/scopes, assign to group.",
    hint1: "Applications > Create App Integration. Choose OIDC and Web Application.",
    hint2: "Set Sign-in redirect URI(s) and optional Sign-out. Assign OpenID and any needed scopes.",
    hint3: "Assign the app to a group. Verify by logging in via the app. Rollback: deactivate or delete the integration.",
    rubric:
      "Must mention creating OIDC web app, redirect URI and scopes, assignment to group, verification, and rollback.",
  },
  {
    title: "Troubleshoot: User not seeing assigned app",
    platform: "Okta",
    tier: 3,
    difficulty: "Medium",
    description:
      "A user reports they do not see an app on their Okta dashboard. They should be in a group that has the app assigned. Diagnose and fix.",
    objective: "Diagnose why the user does not see the assigned app and document the fix.",
    hint1: "Confirm the user is in the group that has the app assigned. Check Directory > People and Applications > Assignments.",
    hint2: "Check app visibility settings (e.g. 'Display application icon to users') and that the app is active.",
    hint3: "Verify by having the user refresh the dashboard or re-login. Rollback: remove assignment if it was incorrect.",
    rubric:
      "Must mention checking group membership and app assignment, visibility/active status, verification (user sees app), and rollback.",
  },
];

async function main() {
  const db = initFirebase();
  const col = db.collection("tasks");
  const now = Timestamp.now();
  for (const task of TASKS) {
    await col.add({ ...task, createdAt: now });
    console.log("Added:", task.title);
  }
  console.log("Seed complete. Total tasks:", TASKS.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
