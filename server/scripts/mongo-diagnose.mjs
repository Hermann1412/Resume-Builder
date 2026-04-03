import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";

mongoose.set("strictQuery", true);

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const run = async () => {
  let uri = process.env.MONGODB_URI || "";

  if (!uri) {
    console.error("MONGODB_URI is missing");
    process.exit(1);
  }

  if (uri.endsWith("/")) {
    uri = uri.slice(0, -1);
  }

  uri = `${uri}/resume-builder`;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("CONNECTED");
  } catch (e) {
    console.log("NAME:", e?.name);
    console.log("MSG:", e?.message);

    if (e?.reason?.servers) {
      for (const [host, server] of e.reason.servers) {
        const detail = server?.error?.message || String(server?.error || "no server error");
        console.log(`SERVER ${host} => ${detail}`);
      }
    }
  } finally {
    try {
      await mongoose.disconnect();
    } catch {}
  }
};

run();
