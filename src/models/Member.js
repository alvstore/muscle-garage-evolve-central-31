
const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number cannot be longer than 20 characters'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership',
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'frozen'],
      default: 'pending',
    },
    primaryBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    renewalDate: Date,
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer not to say'],
    },
    height: Number, // in cm
    weight: Number, // in kg
    healthIssues: [String],
    notes: String,
    fitnessGoals: [String],
    profileImage: String,
    attendanceHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        branchId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Branch',
        },
        checkInTime: Date,
        checkOutTime: Date,
      },
    ],
    measurements: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        weight: Number,
        chest: Number,
        waist: Number,
        biceps: Number,
        thigh: Number,
        hips: Number,
        bodyFat: Number,
        notes: String,
        updatedBy: String,
        updatedByRole: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for current age
MemberSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for membership status
MemberSchema.virtual('isActive').get(function () {
  return this.membershipStatus === 'active';
});

// Middleware before saving (pre-save hook)
MemberSchema.pre('save', function (next) {
  // Update status based on membership dates
  if (this.endDate && new Date(this.endDate) < new Date()) {
    this.membershipStatus = 'inactive';
  }
  next();
});

// Index for efficient queries
MemberSchema.index({ email: 1 });
MemberSchema.index({ membershipStatus: 1 });
MemberSchema.index({ primaryBranchId: 1 });

module.exports = mongoose.model('Member', MemberSchema);
