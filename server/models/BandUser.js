import mongoose from 'mongoose';

const bandUserSchema = new mongoose.Schema(
  {
    bandName: { type: String, required: true, trim: true, maxlength: 100 },
    genre: { type: String, required: true, trim: true },
    bandMembers: { type: String, required: true, trim: true, maxlength: 500 },
    bandBio: { type: String, required: true, trim: true, maxlength: 2000 },
    contactPerson: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    contactPhone: { type: String, required: true, trim: true },
    cityState: { type: String, required: true, trim: true },
    socialLinks: { type: String, trim: true },
    auditionVideoUrl: { type: String, required: true, trim: true },
    termsAccepted: { type: Boolean, required: true, default: false },
    bandPhotoUrl: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const BandUser = mongoose.model('BandUser', bandUserSchema);
export default BandUser;
