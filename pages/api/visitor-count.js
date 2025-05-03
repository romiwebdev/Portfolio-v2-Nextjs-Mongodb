// pages/api/visitor-count.js
import dbConnect from "@/db/connect";
import Visitors from "@/db/VisitorModel";

export default async function handler(req, res) {
  await dbConnect(); // ⬅️ Penting untuk mencegah error saat akses DB

  const userAgent = req.headers["user-agent"];
  const { pageVisited, source } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  // Kecualikan halaman admin dan 404
  if (pageVisited.startsWith('/admin') || pageVisited === '/404') {
    return res.status(200).json({
      success: true,
      message: "Admin/404 page excluded from tracking"
    });
  }

  if (!userAgent || !pageVisited) {
    return res.status(400).json({
      success: false,
      message: "Missing user agent or pageVisited"
    });
  }

  try {
    const newVisitor = new Visitors({
      ipAddress: "unknown",      // ⬅️ Kamu bisa tambahkan IP real nanti
      ipDetails: "unknown",      // ⬅️ Bisa pakai API untuk lookup IP
      userAgent,
      pageVisited,
      source: source || "unknown"
    });

    await newVisitor.save();

    return res.status(201).json({
      success: true,
      message: "Visitor counted",
      visitor: newVisitor
    });
  } catch (error) {
    console.error(`Error saving visitor: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
