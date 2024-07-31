import { auth, signOut } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  let session = await auth();

  if (session === null) redirect("/login");

  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-white">
        You are logged in as {session?.user?.email}
        <SignOutComponent />
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  );
}

function SignOutComponent() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
