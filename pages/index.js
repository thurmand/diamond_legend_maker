import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create custom diamond painting stickers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main class="flex justify-center">
        <div class="border p-2 rounded">
          <Link href="/sticker-profile">
            <a> Lets make stickers &rarr;</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
