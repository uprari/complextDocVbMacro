import { auth } from "@/lib/auth";

export default async function AddInPage() {
  const session = await auth();

  return (
    <div className="p-6">
      <h2>Hello {session?.user?.name}</h2>
      <p>Access Token: {session?.accessToken?.slice(0, 10)}...</p>
      <form>
        <button
          type="button"
          onClick={() => {
            Office.onReady(() => {
              Word.run(async (context) => {
                const body = context.document.body;
                body.insertText(`Hello ${session?.user?.name || "world"}!`, Word.InsertLocation.end);
                await context.sync();
              });
            });
          }}
        >
          Say Hello in Word
        </button>
      </form>
    </div>
  );
}
