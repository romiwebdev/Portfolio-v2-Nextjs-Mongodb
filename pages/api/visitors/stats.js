import Visitors from '@/db/VisitorModel';
import dbConnect from '@/db/connect';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Hitung total pengunjung
    const totalVisitors = await Visitors.countDocuments();
    
    // Data untuk line chart (visitor per hari)
    const last30Days = await Visitors.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Data untuk pie chart (halaman yang dikunjungi)
    const pageVisits = await Visitors.aggregate([
      {
        $group: {
          _id: "$pageVisited",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Data untuk bar chart (browser/device)
    const userAgents = await Visitors.aggregate([
      {
        $project: {
          browser: {
            $cond: [
              { $regexMatch: { input: "$userAgent", regex: "Chrome" } },
              "Chrome",
              {
                $cond: [
                  { $regexMatch: { input: "$userAgent", regex: "Firefox" } },
                  "Firefox",
                  {
                    $cond: [
                      { $regexMatch: { input: "$userAgent", regex: "Safari" } },
                      "Safari",
                      {
                        $cond: [
                          { $regexMatch: { input: "$userAgent", regex: "Edge" } },
                          "Edge",
                          "Other"
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Data untuk sumber pengunjung
    const sources = await Visitors.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      totalVisitors,
      last30Days,
      pageVisits,
      userAgents,
      sources
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
}