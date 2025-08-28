// utils/profileCompletion.js
const calculateProfileCompletion = (user, profileData) => {
  const fieldChecks = {
    basic: [
      { check: () => !!user?.full_name, weight: 1 },
      { check: () => !!user?.username, weight: 1 },
      { check: () => !!user?.location, weight: 1 },
      { check: () => !!user?.gender, weight: 1 },
      { check: () => !!user?.heading, weight: 1 },
    ],
    resume: [
      { check: () => !!user?.resume, weight: 1 }
    ],
    candidate: [
      { check: () => (user?.role === 3 || user?.role === 2) && !!user?.mobile_no, weight: 1 },
      { check: () => (user?.role === 3 || user?.role === 2) && !!user?.dob, weight: 1 },
      { check: () => (user?.role === 3 || user?.role === 2) && (profileData?.skills?.length > 0), weight: 1 }
    ],
    regularUser: [
      { check: () => user?.role === 3 && !!user?.preference, weight: 1 },
      { check: () => user?.role === 3 && !!profileData?.userProfile, weight: 1 },
      { check: () => user?.role === 3 && (profileData?.certificates?.length > 0), weight: 1 },
      { check: () => user?.role === 3 && (profileData?.projects?.length > 0), weight: 1 }
    ],
    recruiter: [
      { check: () => user?.role === 2 && !!profileData?.recruiterProfile?.purpose, weight: 1 },
      { check: () => user?.role === 2 && !!profileData?.recruiterProfile?.designation, weight: 1 },
      { check: () => user?.role === 2 && !!profileData?.recruiterProfile?.current_company, weight: 1 },
      { check: () => user?.role === 2 && !!profileData?.recruiterProfile?.company_email, weight: 1 },
      { check: () => user?.role === 2 && profileData?.recruiterProfile?.work_experience_years !== undefined, weight: 1 },
      { check: () => user?.role === 2 && !!profileData?.recruiterProfile?.about, weight: 1 },
      { check: () => user?.role === 2 && Object.keys(profileData?.recruiterProfile?.social_links || {}).length > 0, weight: 1 }
    ],
    common: [
      { check: () => (user?.role === 3 || user?.role === 2) && (profileData?.education?.length > 0), weight: 1 },
      { check: () => (user?.role === 3 || user?.role === 2) && (profileData?.workExperiences?.length > 0), weight: 1 }
    ]
  };

  let completedFields = 0;
  let totalFields = 0;

  // Always include basic fields (without resume)
  fieldChecks.basic.forEach(({ check, weight }) => {
    if (check()) completedFields += weight;
    totalFields += weight;
  });

  // Include resume separately
  fieldChecks.resume.forEach(({ check, weight }) => {
    if (check()) completedFields += weight;
    totalFields += weight;
  });

  // Include candidate fields if role is 2 or 3
  if (user?.role === 3 || user?.role === 2) {
    fieldChecks.candidate.forEach(({ check, weight }) => {
      if (check()) completedFields += weight;
      totalFields += weight;
    });
  }

  // Include role-specific fields
  if (user?.role === 3) {
    fieldChecks.regularUser.forEach(({ check, weight }) => {
      if (check()) completedFields += weight;
      totalFields += weight;
    });
  } else if (user?.role === 2) {
    fieldChecks.recruiter.forEach(({ check, weight }) => {
      if (check()) completedFields += weight;
      totalFields += weight;
    });
  }

  // Include common fields
  fieldChecks.common.forEach(({ check, weight }) => {
    if (check()) completedFields += weight;
    totalFields += weight;
  });

      console.log('Profile completion calculation:', {
          user,
          profileData,
          completedFields,
          totalFields,
          percentage: Math.round((completedFields / totalFields) * 100)
      });

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

export default calculateProfileCompletion;