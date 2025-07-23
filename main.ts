import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { readFile } from "https://deno.land/std@0.224.0/fs/mod.ts";

// 设置你的 API key
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";

serve(async (req) => {
  const url = new URL(req.url);

  // 路由：返回 claude.html
  if (url.pathname === "/" || url.pathname === "/index.html") {
    const html = await Deno.readTextFile("claude.html");
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  }

  // 路由：返回 main.js 静态脚本
  if (url.pathname === "/main.js") {
    const js = await Deno.readTextFile("main.js");
    return new Response(js, {
      headers: { "content-type": "application/javascript" },
    });
  }

  // 路由：处理 /chat 请求
  if (url.pathname === "/chat" && req.method === "POST") {
    const { message } = await req.json();

    const body = {
      model: "gpt-4o", // 可改为 gpt-3.5-turbo
      messages: [{ role: "user", content: message }],
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data?.choices?.[0]?.message?.content) {
      return Response.json({ response: data.choices[0].message.content });
    } else {
      return Response.json({ response: `Error: ${JSON.stringify(data)}` });
    }
  }

  // 未知路由
  return new Response("Not found", { status: 404 });
});
