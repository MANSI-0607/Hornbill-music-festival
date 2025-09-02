import BandUser from '../models/BandUser.js';

export const submitAudition = async (req, res) => {

  try {
    const {
      bandName,
      genre,
      bandMembers,
      bandBio,
      contactPerson,
      contactEmail,
      contactPhone,
      cityState,
      socialLinks,
      auditionVideoUrl,
      termsAccepted
    } = req.body;
    console.log("controllers")

    // Check required fields
    if (!bandName || !contactEmail || !auditionVideoUrl) {
      return res.status(400).json({ message: 'Band name, email, and audition video URL are required' });
    }

    // Terms must be accepted
    if (!termsAccepted || termsAccepted === 'false') {
      return res.status(400).json({ message: 'Terms must be accepted' });
    }

    // If you uploaded a file using multer-cloudinary, the URL is here:
    let bandPhotoUrl = null;
    if (req.file) {
      bandPhotoUrl = req.file.path; // Cloudinary-hosted URL
    } else if (req.body.bandPhotoUrl) {
      // fallback if front-end sent URL directly
      bandPhotoUrl = req.body.bandPhotoUrl;
    }

    // Save to DB
    const created = await BandUser.create({
      bandName,
      genre,
      bandMembers,
      bandBio,
      contactPerson,
      contactEmail,
      contactPhone,
      cityState,
      socialLinks,
      auditionVideoUrl,
      termsAccepted: true,
      bandPhotoUrl
    });
    console.log(created)

    return res.status(201).json({ 
      message: 'Audition submitted successfully', 
      auditionId: created._id,
      bandPhotoUrl
    });

  } catch (error) {
    console.error('Submit audition error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
