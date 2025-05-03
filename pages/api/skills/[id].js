import dbConnect from '../../../db/connect';
import Skill from '../../../db/SkillModel';
import { verifyToken } from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();

  // Verifikasi token untuk semua metode
  try {
    await verifyToken(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    // GET single skill
    if (req.method === 'GET') {
      const skill = await Skill.findOne({ id: Number(id) });
      if (!skill) return res.status(404).json({ message: 'Skill not found' });
      return res.status(200).json(skill);
    }
    
    // PUT update skill
    if (req.method === 'PUT') {
      const skill = await Skill.findOneAndUpdate({ id: Number(id) }, req.body, { new: true });
      if (!skill) return res.status(404).json({ message: 'Skill not found' });
      return res.status(200).json(skill);
    }
    
    // DELETE skill
    if (req.method === 'DELETE') {
      const skill = await Skill.findOneAndDelete({ id: Number(id) });
      if (!skill) return res.status(404).json({ message: 'Skill not found' });
      return res.status(200).json({ message: 'Skill deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}