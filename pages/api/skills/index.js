import dbConnect from '../../../db/connect';
import Skill from '../../../db/SkillModel';
import { verifyToken } from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();

  // Verifikasi token untuk semua metode kecuali GET
  if (req.method !== 'GET') {
    try {
      await verifyToken(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  try {
    // GET all skills
    if (req.method === 'GET') {
      const skills = await Skill.find().sort({ createdAt: -1 });
      return res.status(200).json(skills);
    }
    
    // POST new skill
    if (req.method === 'POST') {
      const skill = new Skill(req.body);
      await skill.save();
      return res.status(201).json(skill);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}